# sequence_diagrams.md — EkskulKu

## Document Info

| Field | Detail |
|---|---|
| **Format** | Mermaid `sequenceDiagram` |
| **Purpose** | Updated flows reflecting all 12 agreed decisions (approval workflow, notifications, dual conflict detection, finance) |
| **Last Updated** | 2026-06-21 |

---

## 1. Registration with Approval Workflow (Decision #6)

```mermaid
sequenceDiagram
    actor Siswa
    participant UI as RegistrationForm
    participant SA as submitRegistration (Server Action)
    participant DB as PostgreSQL (Prisma)
    actor Pembina

    Siswa->>UI: Fill form (Name, NISN, Class, Gender, Address, Phones, Ekskul)
    UI->>SA: Submit
    SA->>SA: Validate via Zod schema
    alt Invalid data
        SA-->>UI: 400 fieldErrors
        UI-->>Siswa: Show validation errors
    else Valid data
        SA->>DB: Check unique(studentId, extracurricularId)
        alt Already registered
            DB-->>SA: Conflict
            SA-->>UI: 409 "Sudah terdaftar"
        else Not registered
            SA->>DB: Create Registration (status: PENDING_APPROVAL)
            DB-->>SA: Registration created
            SA-->>UI: 201 success
            UI-->>Siswa: "Pendaftaran dikirim, menunggu persetujuan"
        end
    end

    Note over Pembina,DB: Later — approval step
    Pembina->>SA: approveRegistration(registrationId)
    SA->>SA: requireCoachOwnership check
    SA->>DB: Update Registration.status = APPROVED
    SA->>DB: Create Membership (status: ACTIVE)
    SA->>DB: Create Notification (REGISTRATION_APPROVED) for Siswa
    DB-->>SA: Success
    SA-->>Pembina: 200 success
    Note over Siswa: Sees in-app notification on next load
```

---

## 2. Registration Rejection Flow

```mermaid
sequenceDiagram
    actor Pembina
    participant SA as rejectRegistration (Server Action)
    participant DB as PostgreSQL (Prisma)
    actor Siswa

    Pembina->>SA: rejectRegistration(registrationId, reason?)
    SA->>SA: requireCoachOwnership check
    SA->>DB: Find Registration (must be PENDING_APPROVAL)
    alt Already reviewed
        DB-->>SA: status != PENDING_APPROVAL
        SA-->>Pembina: 409 "Already reviewed"
    else Pending
        SA->>DB: Update Registration.status = REJECTED, rejectionReason
        SA->>DB: Create Notification (REGISTRATION_REJECTED) for Siswa
        DB-->>SA: Success
        SA-->>Pembina: 200 success
        Note over Siswa: Sees rejection + reason in Notifications panel
        Note over Siswa: No Membership record created
    end
```

---

## 3. Digital Attendance (5-Status Enum — Decision #12)

```mermaid
sequenceDiagram
    actor Pembina
    participant UI as AttendanceTakingPage
    participant SA1 as createAttendanceSession
    participant SA2 as submitAttendance
    participant DB as PostgreSQL (Prisma)

    Pembina->>UI: Open /attendance for ekskul + date
    UI->>SA1: createAttendanceSession(extracurricularId, sessionDate)
    SA1->>DB: Check unique(extracurricularId, sessionDate)
    alt Session exists
        DB-->>SA1: Existing session
        SA1-->>UI: Return existing session + members
    else New session
        SA1->>DB: Create AttendanceSession
        SA1->>DB: Fetch active Memberships for ekskul
        DB-->>SA1: Member list
        SA1-->>UI: session + members (default status: not set)
    end

    Pembina->>UI: Mark each student: Hadir / Izin / Sakit / Alfa / Terlambat
    Pembina->>UI: Click "Simpan & Submit"
    UI->>SA2: submitAttendance(sessionId, records[])
    SA2->>SA2: requireCoachOwnership check
    SA2->>DB: Upsert AttendanceRecord per student
    DB-->>SA2: Records saved
    SA2-->>UI: 200 success
    UI-->>Pembina: "Absensi berhasil disimpan"
```

---

## 4. Schedule Creation with Dual Conflict Detection (Decision #8)

```mermaid
sequenceDiagram
    actor PembinaOrAdmin as Pembina/Admin
    participant UI as ScheduleManagementPage
    participant SA as createSchedule (Server Action)
    participant CS as check-student-conflict
    participant CR as check-room-conflict
    participant DB as PostgreSQL (Prisma)

    PembinaOrAdmin->>UI: Fill schedule form (ekskul, day, time, room)
    UI->>SA: createSchedule(input)
    SA->>SA: requireCoachOwnership check (Pembina) / bypass (Admin)
    par Student-level conflict check
        SA->>CS: checkStudentScheduleConflict(extracurricularId, day, time)
        CS->>DB: Find schedules of ekskul sharing members with target
        DB-->>CS: Overlapping schedules
        CS-->>SA: warnings[]
    and Room-level conflict check
        SA->>CR: checkRoomConflict(roomId, day, time)
        CR->>DB: Find other schedules in same room/day
        DB-->>CR: Overlapping schedules
        CR-->>SA: warnings[]
    end
    SA->>DB: Create Schedule (regardless of warnings — non-blocking)
    DB-->>SA: Schedule created
    SA-->>UI: { schedule, warnings: [STUDENT_SCHEDULE_CONFLICT?, ROOM_CONFLICT?] }
    alt Warnings present
        UI-->>PembinaOrAdmin: Show ConflictWarningBanner (yellow, non-blocking)
    else No warnings
        UI-->>PembinaOrAdmin: "Jadwal berhasil disimpan"
    end
    Note over DB: On schedule UPDATE (not create), also trigger SCHEDULE_CHANGE notification
```

---

## 5. Schedule Change Notification (Decision #7)

```mermaid
sequenceDiagram
    actor Pembina
    participant SA as updateSchedule (Server Action)
    participant DB as PostgreSQL (Prisma)
    participant NotifHelper as create-notification helper

    Pembina->>SA: updateSchedule(scheduleId, newTime/newRoom)
    SA->>SA: requireCoachOwnership check
    SA->>DB: Re-run conflict checks (excluding self)
    SA->>DB: Update Schedule
    DB-->>SA: Updated
    SA->>DB: Fetch affected Memberships (students) + linked Parents
    DB-->>SA: Affected users
    SA->>NotifHelper: createNotification(SCHEDULE_CHANGE) for each affected Student + Parent
    NotifHelper->>DB: Bulk insert Notification rows
    DB-->>SA: Done
    SA-->>Pembina: 200 success
```

---

## 6. Announcement Publish Flow with Notification Fanout

```mermaid
sequenceDiagram
    actor PembinaOrAdmin as Pembina/Admin
    participant SA1 as createAnnouncement
    participant SA2 as publishAnnouncement
    participant DB as PostgreSQL (Prisma)
    participant NotifHelper as create-notification helper

    PembinaOrAdmin->>SA1: createAnnouncement(title, body, scope)
    SA1->>DB: Insert Announcement (status: DRAFT)
    DB-->>SA1: Created
    SA1-->>PembinaOrAdmin: Draft saved

    PembinaOrAdmin->>SA2: publishAnnouncement(announcementId)
    SA2->>SA2: requireCoachOwnership check (if not Admin/global)
    SA2->>DB: Update status = PUBLISHED, publishedAt = now()
    alt isGlobal = true
        SA2->>DB: Fetch all active Users
    else scoped to ekskul
        SA2->>DB: Fetch Members of ekskul + linked Parents
    end
    DB-->>SA2: Recipient list
    SA2->>NotifHelper: createNotification(ANNOUNCEMENT) for each recipient
    NotifHelper->>DB: Bulk insert Notification rows
    DB-->>SA2: Done
    SA2-->>PembinaOrAdmin: 200 success
```

---

## 7. Achievement & Competition Lifecycle

```mermaid
sequenceDiagram
    actor PembinaOrAdmin as Pembina/Admin
    participant SA1 as createCompetition
    participant SA2 as updateCompetitionStatus
    participant SA3 as recordAchievement
    participant DB as PostgreSQL (Prisma)
    participant NotifHelper as create-notification helper

    PembinaOrAdmin->>SA1: createCompetition(name, level, location, eventDate)
    SA1->>DB: Insert Competition (status: BELUM_MENGIKUTI)
    DB-->>SA1: Created

    PembinaOrAdmin->>SA2: updateCompetitionStatus(id, MENGIKUTI)
    SA2->>DB: Update status
    SA2->>NotifHelper: createNotification(COMPETITION) for ekskul members + parents
    NotifHelper->>DB: Insert Notification rows

    Note over PembinaOrAdmin,DB: Competition takes place

    PembinaOrAdmin->>SA2: updateCompetitionStatus(id, MENUNGGU_HASIL)
    SA2->>DB: Update status

    PembinaOrAdmin->>SA3: recordAchievement(competitionId, studentId, result, certificateUrl)
    SA3->>DB: Insert Achievement (result: JUARA_1 | ... | TIDAK_JUARA)
    DB-->>SA3: Created
    SA3->>DB: Check if all expected participants have results
    alt All recorded
        SA3->>DB: Update Competition.status = SELESAI
    end
    SA3-->>PembinaOrAdmin: 200 success
```

---

## 8. Finance — Income (Dues) Payment Flow (Decision #5, #10)

```mermaid
sequenceDiagram
    actor PembinaOrAdmin as Pembina/Admin
    participant SA as recordPayment (Server Action)
    participant DB as PostgreSQL (Prisma)
    actor SiswaOrOrangTua as Siswa/Orang Tua

    PembinaOrAdmin->>SA: recordPayment({ studentId, amount, description, type: INCOME, paymentDate, status: PENDING, paymentMethod })
    SA->>SA: requireCoachOwnership check
    SA->>DB: Insert Payment (type: INCOME, status: PENDING)
    DB-->>SA: Payment created
    SA-->>PembinaOrAdmin: 200 success

    Note over SiswaOrOrangTua: Views /finance — sees "Belum Membayar"

    PembinaOrAdmin->>SA: updatePaymentStatus(paymentId, PAID)
    SA->>DB: Update Payment.status = PAID
    DB-->>SA: Updated
    SA-->>PembinaOrAdmin: 200 success
    Note over SiswaOrOrangTua: Status reflects PAID on next view
```

---

## 9. Finance — Overdue Detection & Payment Reminder (Decision #7, #10 — Cron)

```mermaid
sequenceDiagram
    participant Cron as Vercel Cron (daily 00:00)
    participant Job1 as overdue-status-update
    participant DB as PostgreSQL (Prisma)
    participant Cron2 as Vercel Cron (daily 08:00)
    participant Job2 as payment-reminder-sweep
    participant NotifHelper as create-notification helper
    actor SiswaOrOrangTua as Siswa/Orang Tua

    Cron->>Job1: Trigger
    Job1->>DB: Find Payment WHERE status=PENDING AND paymentDate < today
    DB-->>Job1: Overdue payments
    Job1->>DB: Update status = OVERDUE (bulk)

    Cron2->>Job2: Trigger
    Job2->>DB: Find Payment WHERE status IN (PENDING, OVERDUE)
    DB-->>Job2: Payments needing reminder
    Job2->>NotifHelper: createNotification(PAYMENT_REMINDER) per affected Student + Parent
    NotifHelper->>DB: Insert Notification rows
    Note over SiswaOrOrangTua: Sees reminder badge in-app on next login
```

---

## 10. Finance — Expense Recording Flow

```mermaid
sequenceDiagram
    actor PembinaOrAdmin as Pembina/Admin
    participant SA as recordPayment (Server Action)
    participant DB as PostgreSQL (Prisma)

    PembinaOrAdmin->>SA: recordPayment({ extracurricularId, studentId: null, amount, description, type: EXPENSE, paymentDate, status: RECORDED, paymentMethod })
    SA->>SA: requireCoachOwnership check
    SA->>DB: Insert Payment (type: EXPENSE, status: RECORDED — no approval cycle)
    DB-->>SA: Created
    SA-->>PembinaOrAdmin: 200 success
    Note over DB: Balance = SUM(INCOME, status=PAID) − SUM(EXPENSE)
```

---

## 11. Finance — Cash Balance Calculation (Read Flow)

```mermaid
sequenceDiagram
    actor PembinaOrAdmin as Pembina/Admin
    participant RH as GET /api/payments
    participant DB as PostgreSQL (Prisma)

    PembinaOrAdmin->>RH: GET /api/payments?extracurricularId=X
    RH->>RH: requireCoachOwnership check (if Pembina)
    RH->>DB: Aggregate SUM(amount) WHERE type=INCOME AND status=PAID
    RH->>DB: Aggregate SUM(amount) WHERE type=EXPENSE
    DB-->>RH: totalIncome, totalExpense
    RH->>RH: balance = totalIncome - totalExpense
    RH-->>PembinaOrAdmin: { items, summary: { totalIncome, totalExpense, balance } }
```

---

## 12. Report Generation & Export (PDF/Excel — Decision #9)

```mermaid
sequenceDiagram
    actor Admin
    participant UI as ReportsAnalysisPage
    participant RH as GET /api/reports/{type}
    participant DB as PostgreSQL (Prisma)
    participant Gen as generate-pdf / generate-excel

    Admin->>UI: Select report type + date range + format
    UI->>RH: GET /api/reports/finance?from=&to=&format=pdf
    RH->>RH: requireRole check (ADMIN or scoped PEMBINA)
    RH->>DB: Query aggregated data (members/attendance/achievements/finance)
    DB-->>RH: Raw data set
    RH->>Gen: generatePdf(data) OR generateExcel(data)
    Gen-->>RH: Binary file buffer
    RH-->>UI: 200, Content-Type: application/pdf (or xlsx)
    UI-->>Admin: Browser downloads file
```

---

## 13. Login & Role Validation (Decision #11)

```mermaid
sequenceDiagram
    actor User
    participant UI as LoginForm
    participant NA as NextAuth (Credentials Provider)
    participant DB as PostgreSQL (Prisma)

    User->>UI: Select role chip (UI convenience only) + enter email/password
    UI->>NA: signIn("credentials", { email, password })
    NA->>DB: Find User by email
    alt User not found or password mismatch
        DB-->>NA: null / mismatch
        NA-->>UI: Auth error
        UI-->>User: "Email atau password salah"
    else Valid credentials
        DB-->>NA: User record (with role from DB, NOT from UI selector)
        NA->>NA: Create session with session.user.role = User.role
        NA-->>UI: Session established
        UI->>UI: Redirect based on session.user.role
        Note over UI: Redirect target ignores the role chip the user clicked —
        Note over UI: only DB-stored role determines redirect & access
    end
```

---

## 14. In-App Notification Read Flow

```mermaid
sequenceDiagram
    actor User
    participant Bell as NotificationBell
    participant RH as GET /api/notifications
    participant SA as markNotificationAsRead
    participant DB as PostgreSQL (Prisma)

    User->>Bell: Click bell icon
    Bell->>RH: GET /api/notifications?isRead=false
    RH->>DB: Find Notification WHERE userId = session.user.id
    DB-->>RH: { items, unreadCount }
    RH-->>Bell: Render list + badge count

    User->>Bell: Click a notification item
    Bell->>SA: markNotificationAsRead(notificationId)
    SA->>DB: Update isRead = true
    DB-->>SA: Updated
    SA-->>Bell: 200 success
    Bell->>Bell: Decrement unread badge
    Bell->>Bell: Navigate to referenceUrl (if present)
```
