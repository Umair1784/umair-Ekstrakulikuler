# api_contract.md — EkskulKu

## Document Info

| Field | Detail |
|---|---|
| **Pattern** | Next.js 15 Server Actions (mutations) + Route Handlers (exports, list/read endpoints consumed by client components needing fetch-based pagination) |
| **Validation** | Zod schemas, colocated with each action in `lib/validations/` |
| **Auth** | NextAuth session via `auth()`; every entry point enforces `role_permission_matrix.md` |
| **Error format** | Standardized — see §1 |
| **Last Updated** | 2026-06-21 |

> **Convention:** Server Actions are used for all create/update/delete (mutation) operations triggered from forms. Route Handlers (`app/api/.../route.ts`) are used for: (a) data exports (PDF/Excel), (b) paginated/filtered list reads consumed by client-side data tables, (c) notification polling.

---

## 1. Standard Response & Error Format

**Success (Server Action return type):**
```ts
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

**Route Handler JSON response:**
```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": "FORBIDDEN", "message": "You do not have access to this extracurricular." }
```

**HTTP Status Codes (Route Handlers):**
| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized (role/scope mismatch) |
| 404 | Resource not found |
| 409 | Conflict (e.g., duplicate registration, unique constraint) |
| 500 | Unexpected server error |

---

## 2. Auth Module

### `POST /api/auth/[...nextauth]`
Handled entirely by NextAuth — Credentials Provider configured in `lib/auth/config.ts`. Not manually implemented.

### Server Action: `registerUserAccount` *(Admin-only utility, not self-signup)*
| Field | Value |
|---|---|
| Location | `lib/actions/auth/register-user.ts` |
| Roles allowed | `ADMIN` |
| Input | `{ email: string; password: string; role: Role; profileData: object }` |
| Output | `ActionResult<{ userId: string }>` |
| Errors | `400` invalid email/weak password, `409` email already exists |

---

## 3. Extracurricular Module

### Server Action: `createExtracurricular`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN` |
| Input (Zod) | `{ name: string; description: string; coachId: string }` |
| Output | `ActionResult<Extracurricular>` |

### Server Action: `updateExtracurricular`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own scope only) |
| Input | `{ id: string; name?: string; description?: string; status?: ExtracurricularStatus }` |
| Output | `ActionResult<Extracurricular>` |
| Errors | `403` if Pembina ≠ owner |

### Route Handler: `GET /api/extracurriculars`
| Field | Value |
|---|---|
| Roles allowed | All authenticated roles |
| Query params | `?search=&status=&page=&pageSize=` |
| Output | `{ success: true, data: { items: Extracurricular[], total: number } }` |

### Route Handler: `GET /api/extracurriculars/[id]`
| Field | Value |
|---|---|
| Roles allowed | All authenticated roles |
| Output | `Extracurricular & { coach: Coach; schedules: Schedule[]; memberCount: number }` |

---

## 4. Registration & Membership Module

### Server Action: `submitRegistration`
| Field | Value |
|---|---|
| Location | `lib/actions/registration/submit-registration.ts` |
| Roles allowed | `SISWA` (self only) |
| Input (Zod) | `{ extracurricularId: string; fullName: string; nisn: string; className: string; gender: Gender; address: string; studentPhone: string; parentPhone: string }` |
| Behavior | Creates/updates `Student` profile fields if missing; creates `Registration` with status `PENDING_APPROVAL`; checks `@@unique([studentId, extracurricularId])` |
| Output | `ActionResult<Registration>` |
| Errors | `409` if already registered to this ekskul, `400` invalid NISN format |
| Side effect | None yet — notification fires only on approval/rejection (Decision #7) |

### Server Action: `approveRegistration`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input | `{ registrationId: string }` |
| Behavior | Sets `Registration.status = APPROVED`, `reviewedById`, `reviewedAt`; creates `Membership` record with `status = ACTIVE`; creates `Notification` (type `REGISTRATION_APPROVED`) for the student's `User` |
| Output | `ActionResult<{ registration: Registration; membership: Membership }>` |
| Errors | `403` scope mismatch, `404` registration not found, `409` already reviewed |

### Server Action: `rejectRegistration`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input | `{ registrationId: string; rejectionReason?: string }` |
| Behavior | Sets `Registration.status = REJECTED`; creates `Notification` (type `REGISTRATION_REJECTED`) |
| Output | `ActionResult<Registration>` |

### Route Handler: `GET /api/registrations/pending`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN` (all), `PEMBINA` (own ekskul only — enforced server-side) |
| Query params | `?extracurricularId=&page=&pageSize=` |
| Output | `{ items: Registration[], total: number }` |

### Route Handler: `GET /api/members`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own scope) |
| Query params | `?search=&className=&extracurricularId=&page=&pageSize=` |
| Output | `{ items: Membership[], total: number }` |

### Server Action: `updateMemberData`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul members only) |
| Input | `{ studentId: string; fullName?: string; className?: string; address?: string; studentPhone?: string; parentPhone?: string }` |
| Output | `ActionResult<Student>` |

### Server Action: `removeMembership`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input | `{ membershipId: string }` |
| Behavior | Sets `Membership.status = INACTIVE` (soft delete) |
| Output | `ActionResult<void>` |

---

## 5. Schedule Module

### Server Action: `createSchedule`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input (Zod) | `{ extracurricularId: string; roomId?: string; dayOfWeek: DayOfWeek; startTime: string; endTime: string }` |
| Behavior | Runs **both** conflict checks (Decision #8) before insert; returns warnings in response (non-blocking) |
| Output | `ActionResult<{ schedule: Schedule; warnings: ConflictWarning[] }>` |

```ts
type ConflictWarning =
  | { type: "STUDENT_SCHEDULE_CONFLICT"; conflictingExtracurricular: string; affectedStudentCount: number }
  | { type: "ROOM_CONFLICT"; conflictingExtracurricular: string; room: string };
```

### Server Action: `updateSchedule` / `deleteSchedule`
Same role rules as `createSchedule`. `updateSchedule` re-runs conflict checks excluding itself.

### Route Handler: `GET /api/schedules`
| Field | Value |
|---|---|
| Roles allowed | All (scoped: Siswa → own ekskul; Orang Tua → linked child's ekskul) |
| Query params | `?extracurricularId=&dayOfWeek=` |
| Output | `Schedule[]` |

### Route Handler: `GET /api/rooms`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` |
| Output | `Room[]` |

---

## 6. Attendance Module

### Server Action: `createAttendanceSession`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input | `{ extracurricularId: string; sessionDate: string }` |
| Output | `ActionResult<AttendanceSession & { members: Student[] }>` — pre-populates member list for the form |
| Errors | `409` session already exists for that date |

### Server Action: `submitAttendance`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input (Zod) | `{ sessionId: string; records: { studentId: string; status: AttendanceStatus; note?: string }[] }` |
| Behavior | Upserts `AttendanceRecord` per student (enum: `HADIR \| IZIN \| SAKIT \| ALFA \| TERLAMBAT` — Decision #12) |
| Output | `ActionResult<AttendanceRecord[]>` |

### Route Handler: `GET /api/attendance/recap`
| Field | Value |
|---|---|
| Roles allowed | All (scoped) |
| Query params | `?studentId=&extracurricularId=&from=&to=&groupBy=week\|month` |
| Output | `{ summary: { HADIR: number; IZIN: number; SAKIT: number; ALFA: number; TERLAMBAT: number; percentage: number }, records: AttendanceRecord[] }` |

---

## 7. Announcement Module

### Server Action: `createAnnouncement`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN` (global or own), `PEMBINA` (own ekskul only, `isGlobal` forced false) |
| Input | `{ title: string; body: string; extracurricularId?: string; isGlobal: boolean }` |
| Output | `ActionResult<Announcement>` (created as `status: DRAFT`) |

### Server Action: `publishAnnouncement`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own only) |
| Input | `{ announcementId: string }` |
| Behavior | Sets `status = PUBLISHED`, `publishedAt = now()`; creates `Notification` (type `ANNOUNCEMENT`) for all relevant users (ekskul members + parents, or all users if global) |
| Output | `ActionResult<Announcement>` |

### Server Action: `archiveAnnouncement`
Same role rules. Sets `status = ARCHIVED`.

### Route Handler: `GET /api/announcements`
| Field | Value |
|---|---|
| Roles allowed | All (scoped to relevant ekskul + global) |
| Query params | `?extracurricularId=&status=&page=&pageSize=` |
| Output | `{ items: Announcement[], total: number }` |

---

## 8. Achievements & Competitions Module

### Server Action: `createCompetition`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input | `{ extracurricularId: string; name: string; level: CompetitionLevel; location: string; eventDate: string }` |
| Output | `ActionResult<Competition>` (status `BELUM_MENGIKUTI`) |

### Server Action: `updateCompetitionStatus`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input | `{ competitionId: string; status: CompetitionStatus }` |
| Behavior | If transitioning to a status that implies public visibility (e.g., `MENGIKUTI`), optionally triggers `Notification` (type `COMPETITION`) |
| Output | `ActionResult<Competition>` |

### Server Action: `recordAchievement`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input | `{ competitionId: string; studentId: string; result: AchievementResult; certificateUrl?: string; description?: string }` |
| Behavior | Also sets parent `Competition.status = SELESAI` if all expected participants have results recorded (optional logic, app-level) |
| Output | `ActionResult<Achievement>` |

### Route Handler: `GET /api/achievements`
| Field | Value |
|---|---|
| Roles allowed | All (scoped: Siswa → own; Orang Tua → linked child; Pembina → own ekskul; Admin → all) |
| Query params | `?studentId=&extracurricularId=&page=&pageSize=` |
| Output | `{ items: Achievement[], total: number }` |

---

## 9. Finance / Payment Module (Decision #10)

### Server Action: `recordPayment`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input (Zod) | `{ extracurricularId: string; studentId?: string; amount: number; description: string; type: PaymentType; paymentDate: string; status: PaymentStatus; paymentMethod?: PaymentMethod }` |
| Behavior | If `type = INCOME` and `status = PENDING`, may later trigger a `PAYMENT_REMINDER` notification via scheduled job (see §12) |
| Output | `ActionResult<Payment>` |

### Server Action: `updatePaymentStatus`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own ekskul only) |
| Input | `{ paymentId: string; status: PaymentStatus }` |
| Output | `ActionResult<Payment>` |

### Route Handler: `GET /api/payments`
| Field | Value |
|---|---|
| Roles allowed | All (scoped: Siswa → own; Orang Tua → linked child; Pembina/Admin → ekskul scope) |
| Query params | `?extracurricularId=&studentId=&type=&status=&from=&to=` |
| Output | `{ items: Payment[], total: number, summary: { totalIncome: number; totalExpense: number; balance: number } }` |

---

## 10. Notification Module (Decision #7)

### Route Handler: `GET /api/notifications`
| Field | Value |
|---|---|
| Roles allowed | Any authenticated user (own notifications only) |
| Query params | `?isRead=&page=&pageSize=` |
| Output | `{ items: Notification[], unreadCount: number }` |

### Server Action: `markNotificationAsRead`
| Field | Value |
|---|---|
| Roles allowed | Any authenticated user (own notifications only) |
| Input | `{ notificationId: string }` |
| Output | `ActionResult<void>` |

### Server Action: `markAllNotificationsAsRead`
| Field | Value |
|---|---|
| Roles allowed | Any authenticated user |
| Input | `{}` (implicit: current user) |
| Output | `ActionResult<{ updatedCount: number }>` |

> **Internal-only helper (not user-facing endpoint):** `lib/notifications/create-notification.ts` — called internally by other Server Actions (approve/reject registration, publish announcement, schedule change, payment reminder cron, competition status update) to insert `Notification` rows. Not exposed as a public action.

---

## 11. Reporting Module (Decision #9)

### Route Handler: `GET /api/reports/members?format=pdf|xlsx`
| Field | Value |
|---|---|
| Roles allowed | `ADMIN`, `PEMBINA` (own scope) |
| Query params | `?extracurricularId=&format=pdf\|xlsx` |
| Output | Binary file stream (`Content-Type: application/pdf` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`) |

### Route Handler: `GET /api/reports/attendance?format=pdf|xlsx`
| Field | Value |
|---|---|
| Query params | `?extracurricularId=&from=&to=&format=` |
| Output | Binary file stream |

### Route Handler: `GET /api/reports/achievements?format=pdf|xlsx`
Same pattern, scoped per `role_permission_matrix.md` §10.

### Route Handler: `GET /api/reports/finance?format=pdf|xlsx`
Same pattern. Includes income, expense, and balance summary.

> Print (browser print-to-PDF) is a UI-level affordance on top of the PDF export — not a separate backend requirement (per Decision #9).

---

## 12. Scheduled / Background Jobs (Vercel Cron)

| Job | Schedule | Action |
|---|---|---|
| Payment reminder sweep | Daily, 08:00 | Find `Payment` where `status IN (PENDING, OVERDUE)` and `paymentDate` is approaching/passed → create `PAYMENT_REMINDER` notifications |
| Overdue status update | Daily, 00:00 | Find `Payment` where `status = PENDING` and `paymentDate < today` → set `status = OVERDUE` |

Implemented as `app/api/cron/payment-reminders/route.ts`, secured via `CRON_SECRET` header check, configured in `vercel.json`.

---

## 13. Validation Schema Conventions (Zod)

All input schemas live in `lib/validations/<module>.ts`, e.g.:

```ts
// lib/validations/registration.ts
import { z } from "zod";

export const submitRegistrationSchema = z.object({
  extracurricularId: z.string().cuid(),
  fullName: z.string().min(3).max(100),
  nisn: z.string().regex(/^\d{10}$/, "NISN must be 10 digits"),
  className: z.string().min(1).max(20),
  gender: z.enum(["LAKI_LAKI", "PEREMPUAN"]),
  address: z.string().min(5).max(255),
  studentPhone: z.string().regex(/^08\d{8,11}$/, "Invalid phone format"),
  parentPhone: z.string().regex(/^08\d{8,11}$/, "Invalid phone format"),
});

export type SubmitRegistrationInput = z.infer<typeof submitRegistrationSchema>;
```

Every Server Action **must** parse input through its Zod schema before touching Prisma — validation errors return `fieldErrors` mapped from `ZodError.flatten()`.
