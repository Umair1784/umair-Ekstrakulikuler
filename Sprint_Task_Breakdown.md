# Sprint_Task_Breakdown.md — EkskulKu

## Document Info

| Field | Detail |
|---|---|
| **Format** | Each task = one AI coding session (15–45 min), Antigravity/Claude Code/Cursor-style |
| **Convention** | Task ID = `S{sprint}-T{task}` — referenced in `PROJECT_CONTEXT.md` "Current Task" field |
| **Last Updated** | 2026-06-21 |

> **Session sizing rule:** every task below is scoped so a single AI session can complete it without running out of context or needing mid-task clarification. Tasks that touch the database schema always come before the UI that depends on them.

---

## Sprint 0 — Documentation (✅ Complete)

| Task | Description | Output |
|---|---|---|
| S0-T1 | Requirements analysis from original Dokumen Kebutuhan + Figma | Analysis summary (chat) |
| S0-T2 | Architecture decisions finalized | 12 decisions (chat) |
| S0-T3 | PRD.md | `PRD.md` |
| S0-T4 | database_design.md | `database_design.md` |
| S0-T5 | api_contract.md | `api_contract.md` |
| S0-T6 | role_permission_matrix.md | `role_permission_matrix.md` |
| S0-T7 | component_tree.md | `component_tree.md` |
| S0-T8 | folder_structure.md | `folder_structure.md` |
| S0-T9 | sequence_diagrams.md | `sequence_diagrams.md` |
| S0-T10 | Sprint_Task_Breakdown.md | `Sprint_Task_Breakdown.md` (this file) |
| S0-T11 | development_roadmap.md | `development_roadmap.md` |

---

## Sprint 1 — Foundation & Auth

**Sprint Goal:** Project scaffolded, database connected, login/auth working end-to-end for all 4 roles.

| Task | Title | Duration | Description | Acceptance Criteria |
|---|---|---|---|---|
| S1-T1 | Project Initialization | 30 min | `create-next-app` dengan TypeScript + Tailwind + App Router; install shadcn/ui, init `components.json`; install `prisma`, `@prisma/client`, `bcryptjs`, `next-auth` | `npm run dev` berjalan tanpa error; shadcn `Button` render di `/` |
| S1-T2 | Prisma + Supabase Setup | 40 min | (1) Buat project di Supabase Dashboard. (2) Ambil `DATABASE_URL` (pooler, port 6543) dan `DIRECT_URL` (direct, port 5432) dari Settings → Database. (3) Tambahkan keduanya ke `.env.local`. (4) Paste schema dari `database_design.md` §3 ke `prisma/schema.prisma` — pastikan `datasource db` punya `url` DAN `directUrl`. (5) Nonaktifkan RLS di Supabase. (6) Jalankan `npx prisma migrate dev --name init` | Migration berhasil; tabel terlihat di Supabase Dashboard → Table Editor; `npx prisma validate` pass |
| S1-T3 | Prisma Client Singleton + Seed Script | 30 min | Buat `lib/db.ts` singleton; tambahkan `"prisma": { "seed": "ts-node ..." }` ke `package.json`; tulis `prisma/seed.ts` sesuai skeleton di `database_design.md` §6.5 | `npx prisma db seed` berhasil mengisi 1 Admin, 3 Coaches, 4 Ekskul, 2 Rooms, sample Students/Parents di Supabase (verifikasi di Table Editor) |
| S1-T4 | NextAuth Configuration | 45 min | Configure Credentials Provider in `lib/auth/config.ts`; module-augment `types/next-auth.d.ts` for `session.user.role` | Manual login via seeded Admin account returns a session with correct `role` |
| S1-T5 | Auth Guard Helpers | 30 min | Build `lib/auth/guards.ts`: `requireRole()`, `requireCoachOwnership()`, `requireParentOfStudent()` per `role_permission_matrix.md` §11 | Unit-testable functions; throws on unauthorized, returns session on success |
| S1-T6 | Middleware Route Gating | 30 min | `src/middleware.ts` — redirect unauthenticated to `/login`; redirect role-mismatched users to their own dashboard | Visiting `/admin/dashboard` as Siswa redirects away |
| S1-T7 | Login Page UI | 45 min | Build `(auth)/login/page.tsx` + `LoginForm` + `RoleSelector` per `component_tree.md` §1, matching Figma login screen | Form submits via NextAuth `signIn`; role chip is cosmetic only (Decision #11) |
| S1-T8 | Role-Based Root Redirect | 15 min | `app/page.tsx` — redirect logged-in users to their role's `/dashboard`; redirect logged-out to `/login` | Each of the 4 seeded roles lands on the correct dashboard route |
| S1-T9 | Root Layout + Providers | 20 min | `app/layout.tsx` with `SessionProvider`, `Toaster`, global font/CSS | No console errors; toast notifications work from any page |
| S1-T10 | Base Navigation Shells | 45 min | Build `BottomNav` (Siswa/Orang Tua) and `Sidebar` (Admin/Pembina) shells per `component_tree.md` §1, no data yet — just nav structure | Nav renders correct items per role; active state highlights current route |

---

## Sprint 2 — Extracurricular & Registration Core

**Sprint Goal:** Admin can create ekskul; students can browse and register; Pembina/Admin can approve.

| Task | Title | Duration | Description | Acceptance Criteria |
|---|---|---|---|---|
| S2-T1 | Extracurricular Server Actions | 30 min | `createExtracurricular`, `updateExtracurricular` per `api_contract.md` §3, with Zod validation | Actions enforce `ADMIN`/`PEMBINA` (own scope) rules |
| S2-T2 | Extracurricular List + Detail Route Handlers | 30 min | `GET /api/extracurriculars`, `GET /api/extracurriculars/[id]` | Returns paginated list + single detail with coach + schedules |
| S2-T3 | Admin: Create/Edit Ekskul UI | 40 min | `(admin)/extracurriculars/page.tsx`, `new/page.tsx`, `[id]/page.tsx` per `component_tree.md` §5 | Admin can create, list, and edit ekskul end-to-end |
| S2-T4 | Siswa: Beranda (Browse Ekskul) UI | 40 min | `(siswa)/activities/page.tsx` — `ExtracurricularList` + `ExtracurricularCard`, matching Figma Screen #3 | List renders with category filter chips, search, join/preview buttons |
| S2-T5 | Siswa: Activity Detail UI | 35 min | `(siswa)/activities/[id]/page.tsx` per Figma Screen #5 | Shows about section, schedule summary, capacity, coach card, Continue button |
| S2-T6 | Registration Zod Schema + Server Action | 30 min | `lib/validations/registration.ts` + `submitRegistration` action per `api_contract.md` §4 — **8 fields exactly** (Decision #3, #4) | Rejects missing/invalid fields; rejects duplicate (studentId, extracurricularId) with 409 |
| S2-T7 | Siswa: Registration Form UI | 40 min | `(siswa)/activities/[id]/register/page.tsx` — `RegistrationForm` with all 8 fields, matching Figma Screen #4 but extended | Submits successfully; shows "Pendaftaran dikirim, menunggu persetujuan" on success |
| S2-T8 | Registration Approval Server Actions | 35 min | `approveRegistration`, `rejectRegistration` per `api_contract.md` §4, including `Membership` creation on approve | Approve creates `Membership(ACTIVE)`; reject sets `REJECTED` + optional reason; both create `Notification` |
| S2-T9 | Pembina/Admin: Registration Approval Queue UI | 40 min | `(pembina)/registrations/page.tsx` + `(admin)/registrations/page.tsx` — `ApprovalQueueTable` per `component_tree.md` §4 | List shows pending registrations, Approve/Reject buttons work, reject opens reason dialog |
| S2-T10 | Member List + Search (Pembina/Admin) | 35 min | `GET /api/members` Route Handler + `(pembina)/members/page.tsx` / `(admin)/students/page.tsx` | Search/filter by name, class, NISN, ekskul works; scoped correctly per role |

---

## Sprint 3 — Schedule & Attendance

**Sprint Goal:** Schedule management with dual conflict detection; full digital attendance flow.

| Task | Title | Duration | Description | Acceptance Criteria |
|---|---|---|---|---|
| S3-T1 | Room CRUD (Admin) | 25 min | `Room` Server Actions + `(admin)/rooms/page.tsx` | Admin can create/edit/delete rooms |
| S3-T2 | Conflict Detection Logic — Student | 35 min | `lib/conflict-detection/check-student-conflict.ts` per `database_design.md` §5 | Returns warnings array for overlapping student schedules; unit-testable |
| S3-T3 | Conflict Detection Logic — Room | 30 min | `lib/conflict-detection/check-room-conflict.ts` per `database_design.md` §5 | Returns warnings array for overlapping room bookings |
| S3-T4 | Schedule Server Actions | 35 min | `createSchedule`, `updateSchedule`, `deleteSchedule` per `api_contract.md` §5 — wires in both conflict checks (Decision #8), non-blocking | Both warning types surface in response; schedule still saves |
| S3-T5 | Pembina/Admin: Schedule Management UI | 45 min | `(pembina)/schedule/page.tsx` + `(admin)/schedule/page.tsx` — calendar, `AddSessionForm`, `ConflictWarningBanner` per Figma Screen #11 | Both conflict warnings render distinctly; form saves successfully despite warnings |
| S3-T6 | Siswa/Orang Tua: Read-Only Schedule View | 30 min | `(siswa)/dashboard` schedule widget + dedicated schedule list view | Scoped to own/linked-child ekskul only |
| S3-T7 | Attendance Status Constants + Badge Component | 15 min | `constants/attendance-status.ts` + `AttendanceStatusBadge` — **5 values exactly** (Decision #12) | Badge renders correct color/label for `HADIR, IZIN, SAKIT, ALFA, TERLAMBAT` |
| S3-T8 | Attendance Session + Submit Server Actions | 35 min | `createAttendanceSession`, `submitAttendance` per `api_contract.md` §6 | Session creation pre-populates member list; submit upserts records correctly |
| S3-T9 | Pembina: Attendance Taking UI | 45 min | `(pembina)/attendance/[sessionId]/page.tsx` — `StatusButtonGroup` (5 buttons), `MarkAllPresentButton`, search, per Figma Screen #9 | All 5 statuses selectable per student; Simpan & Submit persists correctly |
| S3-T10 | Attendance Recap Route Handler + UI | 40 min | `GET /api/attendance/recap` + Siswa recap page (calendar, percentage card) per Figma Screen #6 | Percentage calculated correctly; calendar color-codes by status |

---

## Sprint 4 — Announcements & Notifications

**Sprint Goal:** Full announcement lifecycle + in-app notification system wired to all triggers.

| Task | Title | Duration | Description | Acceptance Criteria |
|---|---|---|---|---|
| S4-T1 | Notification Helper + Entity Wiring | 30 min | `lib/notifications/create-notification.ts` — internal helper used by other actions | Function correctly inserts `Notification` rows for given user list |
| S4-T2 | Notification Route Handler + Mark-Read Actions | 30 min | `GET /api/notifications`, `markNotificationAsRead`, `markAllNotificationsAsRead` per `api_contract.md` §10 | Unread count accurate; mark-read persists |
| S4-T3 | NotificationBell + Notification List UI | 35 min | `components/notifications/*` — bell icon w/ badge, dropdown/page list | Clicking bell shows list; clicking item marks read + navigates to `referenceUrl` |
| S4-T4 | Announcement Server Actions | 30 min | `createAnnouncement`, `publishAnnouncement`, `archiveAnnouncement` per `api_contract.md` §7 — publish triggers notification fanout | Publishing creates `Notification(ANNOUNCEMENT)` for all relevant recipients |
| S4-T5 | Pembina/Admin: Announcement Form + List UI | 40 min | `(pembina)/announcements/*`, `(admin)/announcements/*` per Figma Screen #10 | Draft → Publish → Archive lifecycle works in UI |
| S4-T6 | Siswa/Orang Tua: Announcement Feed UI | 30 min | Read-only announcement list, scoped to own/linked-child ekskul + global | Correct scoping; published-only visible |
| S4-T7 | Schedule Change → Notification Wiring | 25 min | Wire `SCHEDULE_CHANGE` notification into `updateSchedule` action (Sprint 3 task, revisited) | Updating a schedule notifies affected students + parents |

---

## Sprint 5 — Achievements & Competitions

**Sprint Goal:** Full competition lifecycle and achievement recording with reporting visibility.

| Task | Title | Duration | Description | Acceptance Criteria |
|---|---|---|---|---|
| S5-T1 | Competition Server Actions | 30 min | `createCompetition`, `updateCompetitionStatus` per `api_contract.md` §8 | Status transitions follow `BELUM_MENGIKUTI → MENGIKUTI → MENUNGGU_HASIL → SELESAI`; `MENGIKUTI` triggers `COMPETITION` notification |
| S5-T2 | Achievement Server Action | 30 min | `recordAchievement` per `api_contract.md` §8 | Creates `Achievement`; auto-updates `Competition.status = SELESAI` when complete |
| S5-T3 | Pembina/Admin: Competition + Achievement Form UI | 45 min | `(pembina)/achievements/*` per Figma Screen #12 | Add Achievement form works with all fields (student, date, type, title, description) |
| S5-T4 | Achievement Route Handler + Display UI | 35 min | `GET /api/achievements` + Siswa/Orang Tua achievement view | Scoped correctly; shows medal/certificate counts |
| S5-T5 | Achievement Stats Widgets | 25 min | Medal count card, certificate count card, school milestone timeline (Sejarah Keunggulan) | Counts aggregate correctly from DB |

---

## Sprint 6 — Finance / Kas Module

**Sprint Goal:** Complete income/expense tracking, balance calculation, payment reminders.

| Task | Title | Duration | Description | Acceptance Criteria |
|---|---|---|---|---|
| S6-T1 | Payment Zod Schema + recordPayment Action | 30 min | `lib/validations/payment.ts` + `recordPayment` per `api_contract.md` §9 — all 6 fields from Decision #10 | Validates `amount`, `type`, `paymentDate`, `status`, `paymentMethod`, `description` |
| S6-T2 | updatePaymentStatus Action | 20 min | Per `api_contract.md` §9 | Status transitions correctly; scoped to Pembina's own ekskul |
| S6-T3 | Payments Route Handler + Balance Aggregation | 35 min | `GET /api/payments` with `summary: { totalIncome, totalExpense, balance }` per `sequence_diagrams.md` §11 | Aggregation correct; respects role scoping |
| S6-T4 | Pembina/Admin: Finance Dashboard UI | 45 min | `(pembina)/finance/page.tsx`, `(admin)/finance/page.tsx` per Figma Screen #14 | Total income card, outstanding bills, payment history table, unpaid members list all render |
| S6-T5 | Record Income/Expense Form UI | 35 min | `PaymentForm` component, toggles between Income/Expense per `component_tree.md` | Both transaction types submit correctly |
| S6-T6 | Siswa/Orang Tua: Payment Status View | 30 min | Read-only `PaymentTable` scoped to own/linked-child | Shows paid/pending/overdue with `PaymentStatusBadge` |
| S6-T7 | Cron: Overdue Status Update | 25 min | `app/api/cron/payment-reminders/route.ts` (overdue sweep portion) per `api_contract.md` §12 | `PENDING` + past `paymentDate` → `OVERDUE`, secured via `CRON_SECRET` |
| S6-T8 | Cron: Payment Reminder Notification Sweep | 25 min | Same route, reminder portion | Creates `PAYMENT_REMINDER` notifications for pending/overdue payments |
| S6-T9 | vercel.json Cron Configuration | 15 min | Configure both cron schedules | Crons visible in Vercel dashboard after deploy |

---

## Sprint 7 — Reporting & Export

**Sprint Goal:** PDF/Excel export for all four report types, scoped correctly per role.

| Task | Title | Duration | Description | Acceptance Criteria |
|---|---|---|---|---|
| S7-T1 | PDF Generation Utility | 35 min | `lib/reports/generate-pdf.ts` — generic table-to-PDF renderer | Produces valid PDF buffer from tabular data input |
| S7-T2 | Excel Generation Utility | 30 min | `lib/reports/generate-excel.ts` using `exceljs` | Produces valid `.xlsx` buffer from tabular data input |
| S7-T3 | Member Report Route Handler | 25 min | `GET /api/reports/members?format=` per `api_contract.md` §11 | Returns correct binary stream + headers for both formats |
| S7-T4 | Attendance Report Route Handler | 25 min | `GET /api/reports/attendance?format=` | Includes date-range filtering |
| S7-T5 | Achievement Report Route Handler | 25 min | `GET /api/reports/achievements?format=` | Includes per-ekskul breakdown |
| S7-T6 | Finance Report Route Handler | 30 min | `GET /api/reports/finance?format=` | Includes income/expense/balance summary |
| S7-T7 | Admin: Reports & Analytics UI | 45 min | `(admin)/reports/page.tsx` per Figma Screen #15 — tabs, charts, `ExportButtons` | Charts render (attendance trend, achievement donut); export buttons trigger downloads |
| S7-T8 | Pembina: Scoped Reports UI | 35 min | `(pembina)/reports/page.tsx` | Same as above, scoped to own ekskul only |

---

## Sprint 8 — Admin Panel Polish, QA & Deployment

**Sprint Goal:** Admin dashboard complete, full RBAC audit, responsive QA, production deploy.

| Task | Title | Duration | Description | Acceptance Criteria |
|---|---|---|---|---|
| S8-T1 | Admin Dashboard Stats + Module Grid | 40 min | `(admin)/dashboard/page.tsx` per Figma Screen #13 | Stats cards (students/coaches/clubs), module grid, activity feed render with real data |
| S8-T2 | Coach Directory UI | 25 min | `(admin)/coaches/page.tsx` | List + add coach (Admin only) |
| S8-T3 | System Settings Page | 25 min | `(admin)/settings/page.tsx` — room management section, basic settings | Functional CRUD for rooms surfaced here too |
| S8-T4 | RBAC Full Audit Pass | 45 min | Walk every Server Action + Route Handler against `role_permission_matrix.md`; add missing checks | No action is callable without its documented role/scope check |
| S8-T5 | Empty States & Loading Skeletons | 30 min | `EmptyState`, `LoadingSkeleton` applied across all list views | No raw blank screens or unhandled loading states |
| S8-T6 | Mobile Responsive QA Pass | 40 min | Test all Siswa/Orang Tua screens at 375px width | No horizontal scroll, nav usable, forms usable on mobile |
| S8-T7 | Seed Data Expansion for Demo | 25 min | Expand `prisma/seed.ts` with realistic demo data across all modules | Demo login showcases populated dashboards for all 4 roles |
| S8-T8 | Environment Variables + Vercel Project Setup | 25 min | Buat `.env.example` (tanpa nilai). Link project ke Vercel. Tambahkan env vars di Vercel Settings: `DATABASE_URL` (Supabase pooler), `DIRECT_URL` (Supabase direct), `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `CRON_SECRET`. Verifikasi IPv4 add-on Supabase (jika perlu). Jalankan `npx prisma migrate deploy` untuk production migration. | Preview deploy berhasil; tidak ada DB connection error di Vercel Function logs |
| S8-T9 | Production Deployment | 20 min | Deploy to Vercel production, run migration against production DB | App live and functional at production URL |
| S8-T10 | Post-Deploy Smoke Test | 30 min | Manual pass through all 4 role flows in production | Login, registration, approval, attendance, finance, reports all work end-to-end |

---

## Task Status Legend

| Symbol | Meaning |
|---|---|
| ⬜ | Not started |
| 🟦 | In progress |
| ✅ | Complete |
| ⚠️ | Blocked |

> Update `PROJECT_CONTEXT.md` → "Current Task" and "Current Sprint" fields as each task completes. Do not skip ahead to a later sprint's task even if it seems quick — dependencies are ordered intentionally (e.g., S3-T7 attendance constants must exist before S3-T9 attendance UI).
