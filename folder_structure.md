# folder_structure.md — EkskulKu

## Document Info

| Field | Detail |
|---|---|
| **Pattern** | Next.js 15 App Router, feature-based organization |
| **Last Updated** | 2026-06-21 |

> Organized by **feature module** inside `lib/` and `components/`, with route groups in `app/` separating by **role/area** rather than by feature — this matches how users actually navigate (a Pembina lives in `/pembina/*`, not jumping between feature folders).

---

## 1. Top-Level Structure

```
ekskulku/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   └── images/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   └── constants/
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── vercel.json
```

---

## 2. `src/app/` — App Router (route-grouped by role)

```
app/
├── layout.tsx                          # Root layout — providers (NextAuth SessionProvider, Toaster)
├── globals.css
├── page.tsx                            # Redirects to /login or dashboard based on session
│
├── (auth)/
│   ├── layout.tsx                      # Centered auth layout, no navbar
│   ├── login/
│   │   └── page.tsx
│   └── forgot-password/
│       └── page.tsx
│
├── (siswa)/
│   ├── layout.tsx                      # Mobile bottom-nav layout (Home/Activities/Schedule/Profile)
│   ├── dashboard/
│   │   └── page.tsx                    # Student Dashboard (Screen #2)
│   ├── activities/
│   │   ├── page.tsx                    # Beranda — browse/join ekskul (Screen #3)
│   │   └── [extracurricularId]/
│   │       ├── page.tsx                # Activity Detail (Screen #5)
│   │       └── register/
│   │           └── page.tsx            # Registration Form (Screen #4)
│   ├── attendance/
│   │   └── page.tsx                    # Attendance Recap — student view (Screen #6)
│   ├── achievements/
│   │   └── page.tsx
│   ├── finance/
│   │   └── page.tsx
│   ├── announcements/
│   │   └── page.tsx
│   ├── notifications/
│   │   └── page.tsx
│   └── profile/
│       └── page.tsx
│
├── (orangtua)/
│   ├── layout.tsx                      # Mobile bottom-nav layout
│   ├── dashboard/
│   │   └── page.tsx                    # Parent Dashboard (Screen #7)
│   ├── children/
│   │   └── [studentId]/
│   │       ├── attendance/page.tsx
│   │       ├── achievements/page.tsx
│   │       └── finance/page.tsx
│   ├── schedule/
│   │   └── page.tsx
│   ├── announcements/
│   │   └── page.tsx
│   └── notifications/
│       └── page.tsx
│
├── (pembina)/
│   ├── layout.tsx                      # Mobile/desktop hybrid layout (Home/Members/Schedule/Settings)
│   ├── dashboard/
│   │   └── page.tsx                    # Pembina Dashboard (Screen #8)
│   ├── members/
│   │   ├── page.tsx                    # Member list
│   │   └── [studentId]/page.tsx        # Member detail/edit
│   ├── registrations/
│   │   └── page.tsx                    # Registration Approval Queue (Screen #16)
│   ├── attendance/
│   │   ├── page.tsx                    # Session list
│   │   └── [sessionId]/page.tsx        # Halaman Kehadiran — take attendance (Screen #9)
│   ├── schedule/
│   │   └── page.tsx                    # Halaman Pengelolaan Jadwal (Screen #11)
│   ├── announcements/
│   │   ├── page.tsx
│   │   └── new/page.tsx
│   ├── achievements/
│   │   ├── page.tsx                    # Halaman Prestasi (Screen #12)
│   │   └── competitions/
│   │       ├── page.tsx
│   │       └── new/page.tsx
│   ├── finance/
│   │   └── page.tsx                    # Halaman Keuangan (Screen #14)
│   ├── reports/
│   │   └── page.tsx                    # Scoped reports
│   └── notifications/
│       └── page.tsx
│
├── (admin)/
│   ├── layout.tsx                      # Desktop sidebar layout (Screen #13/14 sidebar)
│   ├── dashboard/
│   │   └── page.tsx                    # Admin Panel (Screen #13)
│   ├── extracurriculars/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   ├── rooms/
│   │   └── page.tsx
│   ├── users/
│   │   ├── page.tsx
│   │   └── new/page.tsx
│   ├── students/
│   │   ├── page.tsx                    # Manajemen Siswa
│   │   └── [studentId]/page.tsx
│   ├── coaches/
│   │   └── page.tsx                    # Direktori Pelatih
│   ├── registrations/
│   │   └── page.tsx                    # Registration Approval Queue (all ekskul)
│   ├── schedule/
│   │   └── page.tsx
│   ├── announcements/
│   │   ├── page.tsx
│   │   └── new/page.tsx
│   ├── achievements/
│   │   └── page.tsx
│   ├── finance/
│   │   └── page.tsx                    # Keuangan (global)
│   ├── reports/
│   │   └── page.tsx                    # Laporan & Analisis (Screen #15)
│   ├── settings/
│   │   └── page.tsx                    # Pengaturan Sistem
│   └── notifications/
│       └── page.tsx
│
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── extracurriculars/route.ts
    ├── extracurriculars/[id]/route.ts
    ├── registrations/pending/route.ts
    ├── members/route.ts
    ├── schedules/route.ts
    ├── rooms/route.ts
    ├── attendance/recap/route.ts
    ├── announcements/route.ts
    ├── achievements/route.ts
    ├── payments/route.ts
    ├── notifications/route.ts
    ├── reports/
    │   ├── members/route.ts
    │   ├── attendance/route.ts
    │   ├── achievements/route.ts
    │   └── finance/route.ts
    └── cron/
        └── payment-reminders/route.ts
```

> Route groups `(siswa)`, `(orangtua)`, `(pembina)`, `(admin)` each have **middleware-enforced** role gating (see §5). This keeps URLs clean (`/dashboard`, `/members`) while isolating layouts per role.

---

## 3. `src/components/`

```
components/
├── ui/                                  # shadcn/ui primitives (button, card, dialog, table, etc.)
│
├── layout/
│   ├── navbar.tsx
│   ├── bottom-nav.tsx                   # Mobile bottom nav (Siswa/Orang Tua)
│   ├── sidebar.tsx                      # Desktop sidebar (Admin/Pembina)
│   └── notification-bell.tsx
│
├── auth/
│   ├── login-form.tsx
│   └── role-selector.tsx                # UI-only role picker (Decision #11)
│
├── extracurricular/
│   ├── extracurricular-card.tsx
│   ├── extracurricular-list.tsx
│   └── extracurricular-detail.tsx
│
├── registration/
│   ├── registration-form.tsx
│   ├── registration-status-badge.tsx
│   └── approval-queue-table.tsx
│
├── members/
│   ├── member-table.tsx
│   ├── member-search-bar.tsx
│   └── member-detail-card.tsx
│
├── schedule/
│   ├── schedule-calendar.tsx
│   ├── schedule-form.tsx
│   └── conflict-warning-banner.tsx      # Renders both conflict types (Decision #8)
│
├── attendance/
│   ├── attendance-form.tsx              # 5-status selector (Decision #12)
│   ├── attendance-status-badge.tsx
│   └── attendance-recap-chart.tsx
│
├── announcements/
│   ├── announcement-card.tsx
│   ├── announcement-form.tsx
│   └── announcement-list.tsx
│
├── achievements/
│   ├── achievement-card.tsx
│   ├── achievement-form.tsx
│   ├── competition-form.tsx
│   └── competition-status-badge.tsx
│
├── finance/
│   ├── payment-table.tsx
│   ├── payment-form.tsx
│   ├── balance-summary-card.tsx
│   └── payment-status-badge.tsx
│
├── notifications/
│   ├── notification-list.tsx
│   └── notification-item.tsx
│
├── reports/
│   ├── report-filter-form.tsx
│   └── export-buttons.tsx               # PDF + Excel (Decision #9)
│
└── shared/
    ├── data-table.tsx                   # Generic paginated table wrapper
    ├── empty-state.tsx
    ├── loading-skeleton.tsx
    └── confirm-dialog.tsx
```

---

## 4. `src/lib/`

```
lib/
├── auth/
│   ├── config.ts                        # NextAuth config (Credentials Provider)
│   ├── guards.ts                        # requireRole, requireCoachOwnership, etc.
│   └── session.ts                       # auth() wrapper helpers
│
├── actions/                             # Server Actions, grouped by module
│   ├── auth/
│   ├── extracurricular/
│   ├── registration/
│   ├── schedule/
│   ├── attendance/
│   ├── announcement/
│   ├── achievement/
│   ├── payment/
│   └── notification/
│
├── validations/                         # Zod schemas, one file per module
│   ├── registration.ts
│   ├── schedule.ts
│   ├── attendance.ts
│   ├── announcement.ts
│   ├── achievement.ts
│   └── payment.ts
│
├── notifications/
│   └── create-notification.ts           # Internal helper, used by other actions
│
├── reports/
│   ├── generate-pdf.ts
│   └── generate-excel.ts
│
├── conflict-detection/
│   ├── check-student-conflict.ts
│   └── check-room-conflict.ts
│
├── db.ts                                # Prisma client singleton
└── utils.ts                             # cn(), formatDate(), formatCurrency(), etc.
```

---

## 5. Middleware (Role Gating)

```
src/
└── middleware.ts
```

```ts
// src/middleware.ts (conceptual)
// Protects route groups: redirects unauthenticated users to /login,
// and redirects authenticated users whose role doesn't match the
// route group prefix to their own dashboard.
export const config = {
  matcher: ["/dashboard/:path*", "/members/:path*", "/registrations/:path*", "..."],
};
```

---

## 6. `src/types/` & `src/constants/`

```
types/
├── next-auth.d.ts                       # Module augmentation: session.user.role, .coach, .student, .parent
├── api.ts                               # ActionResult<T>, pagination types
└── domain.ts                            # Re-exported Prisma types + composed view models

constants/
├── attendance-status.ts                 # Labels + colors for HADIR/IZIN/SAKIT/ALFA/TERLAMBAT
├── roles.ts
├── navigation.ts                        # Per-role nav item definitions
└── competition-levels.ts
```

---

## 7. Conventions

| Convention | Rule |
|---|---|
| **File naming** | `kebab-case.tsx` for components, `camelCase.ts` for utility/action files |
| **Server Actions** | Always `"use server"` at top of file in `lib/actions/**` — never inline in components unless trivial |
| **Client Components** | `"use client"` only when interactivity (forms, state) is required — default to Server Components |
| **Data fetching** | Server Components fetch directly via Prisma where possible; Route Handlers only for client-side pagination/export needs |
| **Validation** | Every Server Action input passes through its Zod schema before reaching Prisma |
| **Auth checks** | Every Server Action calls `requireRole()` / `requireCoachOwnership()` as the **first** line |
| **Styling** | Tailwind utility classes; shared variants via `cva()` where shadcn/ui pattern applies |
