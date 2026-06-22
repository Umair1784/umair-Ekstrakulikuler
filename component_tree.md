# component_tree.md — EkskulKu

## Document Info

| Field | Detail |
|---|---|
| **Purpose** | Maps App Router pages to the components they render, for implementation planning |
| **Companion doc** | See `folder_structure.md` for file locations |
| **Last Updated** | 2026-06-21 |

---

## 1. Global Layout Tree

```
RootLayout (app/layout.tsx)
├── SessionProvider (NextAuth)
├── Toaster (shadcn/ui sonner)
└── {children}
    │
    ├── (auth) layout — no nav, centered card
    │   └── LoginPage
    │       └── LoginForm
    │           ├── RoleSelector (UI convenience only — Decision #11)
    │           ├── EmailInput
    │           ├── PasswordInput
    │           └── SubmitButton
    │
    ├── (siswa) layout — BottomNav (Home / Activities / Schedule / Profile)
    ├── (orangtua) layout — BottomNav (Home / Activities / Schedule / Profile)
    ├── (pembina) layout — BottomNav or Sidebar (Home / Members / Schedule / Settings)
    └── (admin) layout — Sidebar (Dashboard / Manajemen Siswa / Direktori Pelatih / Keuangan / Laporan & Analisis / Pengaturan Sistem)
```

---

## 2. Siswa (Student) Route Tree

### `/dashboard` — Student Dashboard (Screen #2)
```
StudentDashboardPage
├── Navbar (logo, NotificationBell, Avatar)
├── WelcomeBanner ("Hi {name}, Siap untuk mendaftar eskul?")
├── HotNewsCard
├── JoinNewClubCTA → links to /activities
└── BottomNav
```

### `/activities` — Beranda / Browse Ekskul (Screen #3)
```
ActivitiesPage
├── Navbar (SearchInput, NotificationBell, Avatar)
├── PageHeader ("Temukan Minat Anda!")
├── CategoryFilterChips (Semua / Bahasa / Art / ...)
├── ExtracurricularList
│   └── ExtracurricularCard (repeated)
│       ├── CoverImage
│       ├── CategoryBadge
│       ├── Title + Description
│       ├── CoachAvatar + Name
│       ├── JoinButton → /activities/[id]/register
│       └── PreviewButton → /activities/[id]
└── BottomNav
```

### `/activities/[id]` — Activity Detail (Screen #5)
```
ActivityDetailPage
├── BackHeader (title, share, favorite icons)
├── CoverImageBanner
├── AboutSection (Tentang ...)
├── ProgramHighlightsList
├── CoachProfileCard
├── ScheduleSummaryCard (Jadwal — upcoming sessions)
├── CapacityIndicator (e.g., "15 / 25 Terisi")
└── ContinueButton → /activities/[id]/register
```

### `/activities/[id]/register` — Registration Form (Screen #4)
```
RegistrationFormPage
├── BackHeader
└── RegistrationForm                       (Decision #3 fields)
    ├── FullNameInput
    ├── NisnInput                          (Decision #4 — NISN only)
    ├── ClassSelect
    ├── GenderRadioGroup
    ├── AddressTextarea
    ├── StudentPhoneInput
    ├── ParentPhoneInput
    ├── SelectedExtracurricularDisplay (read-only, from route param)
    ├── ConflictWarningBanner (if student-schedule conflict detected pre-submit)
    └── SubmitButton ("Daftar") → submitRegistration() → status: PENDING_APPROVAL
```

### `/attendance` — Attendance Recap (Screen #6)
```
StudentAttendancePage
├── Navbar
├── PageHeader ("Rekap Kehadiran")
├── MonthFilterDropdown + ActivityFilterDropdown
├── AttendancePercentageCard ("95% — Kehadiran Luar Biasa")
├── AttendanceCalendar (color-coded by status)
├── AttendanceLegend (5 statuses — Decision #12)
└── RecentRecordsList
    └── AttendanceRecordItem (repeated)
```

### `/achievements`, `/finance`, `/announcements`, `/notifications`, `/profile`
Same general pattern — `Navbar` + `PageHeader` + module-specific list/card components (see §6–§9 below, reused across roles with scoped data).

---

## 3. Orang Tua (Parent) Route Tree

### `/dashboard` — Parent Dashboard (Screen #7)
```
ParentDashboardPage
├── Navbar (greeting "Halo, Bapak/Ibu {name}!")
├── ChildSelectorChip (if multiple linked children)
├── AttendanceSummaryCard (% + target progress bar)
├── BillingSummaryCard (Daftar Tagihan — outstanding payments)
│   └── PayReminderButton (informational — no online payment gateway)
├── UpcomingScheduleCard
│   └── ScheduleListItem (repeated)
├── AchievementHighlightCard ("Ahmad won Gold in ENGLISH CLUB!")
│   └── ShareNewsButton / DetailsButton
├── CoachContactCard
└── BottomNav
```

### `/children/[studentId]/attendance` | `/achievements` | `/finance`
Reuses `AttendanceRecapView`, `AchievementList`, `PaymentTable` components scoped to the linked child — same components as Siswa views, parameterized by `studentId` instead of session user.

---

## 4. Pembina (Coach) Route Tree

### `/dashboard` — Pembina Dashboard (Screen #8)
```
PembinaDashboardPage
├── Navbar (greeting "Selamat datang, Pak/Bu {name}")
├── PendingRegistrationBanner ("Anda memiliki N permintaan pendaftaran baru")
├── QuickStatsRow
│   ├── TotalMembersCard
│   └── NextSessionCard
├── TakeAttendanceCTA → /attendance
├── PendingRegistrationsPreviewCard → /registrations
│   └── ReviewAllButton
├── CompetitionCTA ("Siap untuk mengikuti Perlombaan?")
└── BottomNav / Sidebar
```

### `/registrations` — Registration Approval Queue (Screen #16, new — Decision #6)
```
RegistrationQueuePage
├── PageHeader ("Pendaftaran Tertunda")
├── StatusFilterTabs (Pending / Approved / Rejected)
└── ApprovalQueueTable
    └── RegistrationRow (repeated)
        ├── StudentInfo (name, NISN, class)
        ├── SubmittedDate
        ├── ApproveButton → approveRegistration()
        └── RejectButton → opens RejectReasonDialog → rejectRegistration()
```

### `/attendance/[sessionId]` — Halaman Kehadiran (Screen #9)
```
AttendanceTakingPage
├── SessionHeader (ekskul name, date/time)
├── MarkAllPresentButton
├── MemberSearchInput
├── MemberAttendanceList
│   └── MemberAttendanceRow (repeated)
│       ├── Avatar + Name + NISN
│       └── StatusButtonGroup [Hadir | Izin | Sakit | Alfa | Terlambat]   (Decision #12)
└── ActionBar
    ├── CancelButton
    └── SubmitButton ("Simpan & Submit") → submitAttendance()
```

### `/schedule` — Halaman Pengelolaan Jadwal (Screen #11)
```
ScheduleManagementPage
├── MonthNavigator (< Juni 2026 >) + ViewToggle (Bulan/Pekan)
├── CalendarGrid
├── AddSessionForm
│   ├── ExtracurricularSelect
│   ├── DateInput + TimeInput
│   ├── CoachDisplay (auto-filled)
│   ├── RoomSelect
│   ├── ConflictWarningBanner               (Decision #8 — both types)
│   │   ├── StudentConflictMessage (if any)
│   │   └── RoomConflictMessage (if any)
│   └── ConfirmSessionButton → createSchedule()
└── UpcomingSessionsList
    └── SessionListItem (repeated)
```

### `/announcements`, `/announcements/new`
```
AnnouncementListPage / NewAnnouncementPage
├── AnnouncementForm
│   ├── TitleInput
│   ├── BodyTextarea
│   ├── ScopeToggle (own ekskul only — isGlobal forced false for Pembina)
│   └── SaveDraftButton / PublishButton
└── AnnouncementList
    └── AnnouncementCard (repeated, with status badge: Draft/Published/Archived)
```

### `/achievements`, `/achievements/competitions`, `/achievements/competitions/new` (Screen #12)
```
PrestasiPage
├── LatestWinBanner
├── StatsRow (MedalCountCard, CertificateCountCard)
├── StudentAchievementSearchInput
├── StudentAchievementList
│   └── AchievementListItem (repeated, clickable → detail)
├── SchoolMilestoneTimeline (Sejarah Keunggulan)
└── AddAchievementForm
    ├── StudentSelect
    ├── DateInput
    ├── TypeSelect (Academic/Sport/Art...)
    ├── AwardTitleInput
    ├── DescriptionTextarea
    └── SubmitButton ("Kirim Prestasi") → recordAchievement()
```

### `/finance` — Halaman Keuangan (Screen #14)
```
PembinaFinancePage
├── TotalIncomeCard (Pendapatan Total Bulan Ini)
├── OutstandingBillsCard (Tagihan)
├── SendReminderCTA → triggers PAYMENT_REMINDER notifications
├── PaymentHistoryTable
│   ├── FilterTabs (Semua / Berhasil)
│   └── PaymentRow (repeated)
├── UnpaidMembersList
│   └── UnpaidMemberRow
│       ├── StudentInfo + AmountDue
│       ├── ViewDetailButton
│       └── RemindButton
└── AnnualAuditReportCard → /reports
```

### `/reports` — Scoped Reports
```
PembinaReportsPage
├── DateRangeFilter
├── ExportButtons (PDF, Excel — Decision #9)
├── ReportTabs (Kehadiran / Anggota / Prestasi / Keuangan)
└── ReportPreviewTable / Chart
```

---

## 5. Admin Route Tree

### `/dashboard` — Admin Panel (Screen #13)
```
AdminDashboardPage
├── Navbar (search, NotificationBell)
├── SystemStatusBanner ("1 Kegagalan Pembayaran" — alert)
├── StatsCardsRow
│   ├── TotalStudentsCard (+12%)
│   ├── ActiveCoachesCard
│   └── TotalClubsCard (Active/Vacant breakdown)
├── ManagementModuleGrid
│   ├── ModuleCard → "Catatan Siswa" → /students
│   ├── ModuleCard → "Keuangan" → /finance
│   ├── ModuleCard → "Laporan Tahunan" → /reports
│   └── ModuleCard → "Club" → /extracurriculars
├── ActivityFeedList (recent system events)
└── QuickActionsList
    ├── TambahSiswaBaruLink → /students/new (via registration approval, not direct add)
    ├── BuatAnggaranKlubLink → /finance
    └── PemberitahuanSiaranLink → /announcements/new

AdminSidebar (Screen #14 — collapsible)
├── ProfileHeader (avatar, name, "EkskulKu Premium" badge)
├── DashboardLink
├── ManajemenSiswaLink
├── DirektoriPelatihLink
├── KeuanganLink
├── LaporanAnalisisLink
└── PengaturanSistemLink
```

### `/students`, `/students/[studentId]` — Manajemen Siswa
```
StudentManagementPage
├── SearchAndFilterBar (name, class, NISN, ekskul)
└── MemberTable
    └── MemberRow → /students/[studentId]

StudentDetailPage
├── ProfileCard (editable)
├── MembershipsList (all ekskul this student belongs to)
├── AttendanceSummary
├── AchievementsSummary
└── PaymentsSummary
```

### `/coaches` — Direktori Pelatih
```
CoachDirectoryPage
├── CoachList
│   └── CoachCard (name, assigned ekskul, contact)
└── AddCoachButton (Admin only)
```

### `/extracurriculars`, `/extracurriculars/new`, `/extracurriculars/[id]`
```
ExtracurricularManagementPage
├── ExtracurricularTable
└── CreateExtracurricularForm
    ├── NameInput
    ├── DescriptionTextarea
    ├── CoachSelect
    └── SubmitButton → createExtracurricular()
```

### `/registrations` — Global Registration Approval Queue
Same `ApprovalQueueTable` component as Pembina view, unscoped (all ekskul), with an `ExtracurricularFilterDropdown` added.

### `/finance` — Global Keuangan
```
AdminFinancePage
├── GlobalBalanceSummaryCard (all ekskul combined)
├── PerExtracurricularBalanceTable
└── PaymentHistoryTable (cross-ekskul, filterable)
```

### `/reports` — Laporan & Analisis (Screen #15)
```
ReportsAnalysisPage
├── DateRangeFilter
├── ExportButtons (PDF / Excel)
├── ReportTypeTabs (Kehadiran / Anggota / Prestasi)
├── AttendanceTrendChart (weekly bar chart)
├── AchievementDonutChart (Gold/Silver/Bronze tier breakdown)
├── ClubPopularityList
│   └── ClubTrendCard (active member count + mini sparkline)
└── SmartInsightCard ("Masukan Cerdas" — computed text insight)
```

### `/settings` — Pengaturan Sistem
```
SystemSettingsPage
├── GeneralSettingsForm
├── RoomManagementSection (CRUD for Room entity)
└── UserAccountManagementSection
```

---

## 6. Shared Cross-Role Components

| Component | Used In |
|---|---|
| `NotificationBell` + `/notifications` page | All roles — renders `NotificationList` scoped to `session.user.id` |
| `AttendanceStatusBadge` | Student/Parent recap views, Pembina attendance table, Admin reports |
| `ConflictWarningBanner` | Pembina + Admin schedule forms only |
| `ExportButtons` (PDF/Excel) | Pembina + Admin report pages |
| `RegistrationStatusBadge` | Siswa (own status), Pembina/Admin (queue table) |
| `PaymentStatusBadge` | Siswa/Orang Tua (own payments), Pembina/Admin (finance tables) |
| `DataTable` (generic) | Members, Registrations, Payments, Reports — all paginated tables |
| `EmptyState` | Any list view with zero results |

---

## 7. Notes for AI Coding Assistants

- Build **shared/ui primitives first** (DataTable, StatusBadge variants, ConflictWarningBanner) before role-specific pages — they're reused 4–6× each.
- `AttendanceForm` and `AttendanceTakingPage` should share the same `StatusButtonGroup` component with all 5 statuses (Decision #12) — do not hardcode 3 or 4 buttons.
- `RegistrationForm` must include all 8 fields from Decision #3 — cross-check against `database_design.md` §3 `Student` model before marking the form "complete."
- Every list page should default to **Server Component data fetching**; only wrap interactive bits (filters, forms) in `"use client"` children, per `folder_structure.md` §7 conventions.
