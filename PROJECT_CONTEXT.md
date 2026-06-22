# PROJECT_CONTEXT.md

## Project Information

| Field | Detail |
|---|---|
| **Project Name** | EkskulKu — Sistem Informasi Ekstrakurikuler |
| **Owner** | Mutia Nur Safiqa, Rizky Khairunisa, Fiqri Arisandi, M. Umair Tilmisani |
| **Institution** | Universitas Jenderal Achmad Yani — Program Studi Informatika |

**Goal:**
Membangun sistem informasi ekstrakurikuler berbasis web yang mengintegrasikan pendaftaran online, manajemen anggota, jadwal kegiatan, absensi digital, pengumuman, prestasi & lomba, keuangan/kas, dan pelaporan — dengan akses berbasis peran untuk Admin, Pembina, Siswa, dan Orang Tua.

---

## Current Status

| Field | Detail |
|---|---|
| **Current Sprint** | Sprint 5 |
| **Current Task** | Project Complete |
| **Progress** | 100% |
| **Project Status** | 🟢 Ready For Deployment |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js Server Actions + Route Handlers |
| **Database** | PostgreSQL — hosted on **Supabase** |
| **ORM** | Prisma (satu-satunya cara akses DB — tidak menggunakan `@supabase/supabase-js`) |
| **DB Connection (Runtime)** | Supabase connection pooler / pgBouncer — `DATABASE_URL` (port 6543, Transaction mode) |
| **DB Connection (Migration)** | Supabase direct connection — `DIRECT_URL` (port 5432) |
| **Authentication** | NextAuth (Credentials Provider) — bukan Supabase Auth |
| **Deployment** | Vercel |
| **PDF Export** | `@react-pdf` |
| **Excel Export** | `exceljs` |

> ⚠️ **Supabase digunakan HANYA sebagai database host (Opsi B).** Tidak menggunakan Supabase Auth, Supabase Realtime, Supabase Storage, atau `@supabase/supabase-js`. Semua query database melalui Prisma. Semua auth melalui NextAuth.
>
> ⚠️ **Deprecated:** Original requirements document specified Laravel + MySQL — **tidak valid**. Stack di atas adalah satu-satunya source of truth.

---

## Design System

| Attribute | Value |
|---|---|
| **Style** | Clean, functional, dashboard-first, mobile-first for Siswa/Orang Tua, desktop-first for Admin |
| **Component Library** | shadcn/ui (Tailwind-based) |
| **Primary Accent** | Blue (per Figma — `EkskulKu` brand blue, buttons, active nav state) |
| **Background** | Light gray/white (`bg-slate-50` / `bg-white`) |
| **Status Colors** | Green = Hadir/Approved/Paid, Yellow = Izin/Pending/Warning, Red = Alfa/Rejected/Overdue, Blue = Sakit/Info, Orange = Terlambat |
| **Typography** | System default / Inter (match Figma) |
| **Navigation** | Bottom nav (mobile: Siswa/Orang Tua) + Sidebar (desktop: Admin/Pembina) |

---

## Source-of-Truth Documents

| Document | Purpose |
|---|---|
| `PRD.md` | Full product requirements, functional + non-functional |
| `database_design.md` | ERD + Prisma schema + enums (canonical schema) |
| `api_contract.md` | Server Action / Route Handler contracts |
| `role_permission_matrix.md` | RBAC rules — every action must be checked against this |
| `component_tree.md` | Page → component mapping |
| `folder_structure.md` | Where every file goes |
| `sequence_diagrams.md` | Flow diagrams for all major processes (Mermaid) |
| `Sprint_Task_Breakdown.md` | Task-by-task build plan |
| `development_roadmap.md` | Phase-level delivery plan |

---

## Key Architecture Decisions (Locked — Do Not Revisit Without Explicit Approval)

| # | Decision |
|---|---|
| 1 | Stack adalah Next.js 15 + Prisma + PostgreSQL (hosted Supabase) + NextAuth + Vercel — **bukan** Laravel/MySQL. Supabase digunakan sebagai DB host saja (Opsi B) — bukan Supabase Auth/Realtime/Storage |
| 2 | Students may join **unlimited** ekskul — no max-2 cap |
| 3 | Registration form fields: Full Name, NISN, Class, Gender, Address, Parent Phone, Student Phone, Selected Ekskul |
| 4 | Use **NISN only** — never "NIS" |
| 5 | Finance is a full module with Activity/Sequence/State flows for Payment, Cash Flow, Income, Expense |
| 6 | Registration requires approval: `Draft → Pending Approval → Approved/Rejected → Active Member` |
| 7 | Notifications are **in-app only** (no email/push in MVP) |
| 8 | Schedule conflict detection covers **both** student-schedule overlap AND room/resource overlap |
| 9 | Reports export as **PDF and Excel (.xlsx)** only; print is a browser-level convenience, not a separate feature |
| 10 | `Payment` entity includes: `amount`, `description`, `type` (income/expense), `paymentDate`, `status`, `paymentMethod` |
| 11 | `User.role` in the database is the **only** source of truth for authorization — the login screen's role selector is cosmetic |
| 12 | Attendance status enum is exactly: `Hadir, Izin, Sakit, Alfa, Terlambat` — no generic "Absen" |

---

## Current Folder Structure (Target)

```
src/
├── app/
│   ├── (auth)/
│   ├── (siswa)/
│   ├── (orangtua)/
│   ├── (pembina)/
│   ├── (admin)/
│   └── api/
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── layout/
│   ├── auth/
│   ├── extracurricular/
│   ├── registration/
│   ├── members/
│   ├── schedule/
│   ├── attendance/
│   ├── announcements/
│   ├── achievements/
│   ├── finance/
│   ├── notifications/
│   ├── reports/
│   └── shared/
├── lib/
│   ├── auth/
│   ├── actions/
│   ├── validations/
│   ├── notifications/
│   ├── reports/
│   ├── conflict-detection/
│   └── db.ts
├── hooks/
├── types/
└── constants/
```

> Full detail in `folder_structure.md`.

---

## Completed Tasks

### Sprint 0 — Documentation
- [x] S0-T1 Requirements analysis (from original Dokumen Kebutuhan)
- [x] S0-T2 Architecture decisions finalized (12 decisions, see above)
- [x] S0-T3 PRD.md generated
- [x] S0-T4 database_design.md (ERD + Prisma schema) generated
- [x] S0-T5 api_contract.md generated
- [x] S0-T6 role_permission_matrix.md generated
- [x] S0-T7 component_tree.md generated
- [x] S0-T8 folder_structure.md generated
- [x] S0-T9 sequence_diagrams.md generated
- [x] S0-T10 Sprint_Task_Breakdown.md generated
- [x] S0-T11 development_roadmap.md generated

### Sprint 1 — Foundation & Auth
- [x] S1-T1 Project Initialization
- [x] S1-T2 Prisma + Supabase Setup
- [x] S1-T3 Prisma Client Singleton + Seed Script
- [x] S1-T4 NextAuth Configuration
- [x] S1-T5 Auth Guard Helpers
- [x] S1-T6 Middleware Protection
- [x] S1-T7 Error Pages
- [x] S2-T1 Public Layout
- [x] S2-T2 Home Page Hero Section
- [x] S2-T3 About Section
- [x] S2-T4 Extracurricular Section
- [x] S2-T5 Achievement Section
- [x] S2-T6 Announcement Section
- [x] S2-T7 Contact Section

### Sprint 3 — Dashboard & Profiles
- [x] S3-T1 Login Page
- [x] S3-T2 Dashboard Layout
- [x] S3-T3 Admin Dashboard Overview
- [x] S3-T4 Extracurricular CRUD
- [x] S3-T5 Announcement CRUD
### Sprint 4 — Announcements & Notifications
- [x] S4-T1 Attendance Management
- [x] S4-T2 Student Attendance History
- [x] S4-T3 Parent Monitoring

### Sprint 5 — Reports & Export
- [x] S5-T1 Reports & Export PDF
- [x] S5-T2 Excel Export
- [x] S5-T3 Final Polish & Deployment

---

## Known Issues

> None — project has not started implementation yet.

---

## Open Questions (Tracked from PRD §11)

1. Can Pembina create new ekskul, or only Admin? *(Current assumption: Admin-only creation; Pembina is assigned.)*
2. Are rejected registrations deleted or retained? *(Current assumption: retained with `status: REJECTED` for audit.)*
3. Online payment gateway — explicitly deferred post-MVP.
4. Email/push notifications — explicitly deferred post-MVP (Decision #7).

---

## Next Task

**S5-T3 Final Polish & Deployment** (see `Sprint_Task_Breakdown.md`)

**Expected Output:**
- Cleaned UI, final bug fixes, deployment preparation.

---

## Notes for AI Assistant

> **Important Rules:**
> 1. Follow `PRD.md` sebagai single source of product truth.
> 2. Follow `database_design.md` Prisma schema exactly — jangan buat field/model baru tanpa konfirmasi dulu.
> 3. Setiap Server Action **harus** mulai dengan `requireRole()` / `requireCoachOwnership()` check sesuai `role_permission_matrix.md` — tanpa pengecualian.
> 4. Setiap mutation input **harus** melewati Zod schema sesuai `api_contract.md` §13 sebelum menyentuh Prisma.
> 5. Follow `Sprint_Task_Breakdown.md` — jangan build fitur di luar current task.
> 6. Fokus hanya pada current sprint; jangan pre-build fitur sprint berikutnya.
> 7. Komponen harus reusable — cek `component_tree.md` §6 sebelum membuat komponen baru.
> 8. Mobile-first untuk Siswa/Orang Tua; desktop-first acceptable untuk Admin.
> 9. Attendance status **selalu** 5-value enum (`HADIR, IZIN, SAKIT, ALFA, TERLAMBAT`) — jangan disederhanakan.
> 10. Gunakan **NISN** saja — jika melihat "NIS" di mockup lama, koreksi ke NISN.
> 11. Notifikasi hanya in-app — jangan tambahkan kode email/SMS/push.
> 12. Schedule conflict check harus selalu jalankan **keduanya** (student-level DAN room-level), dan harus **non-blocking warnings**, bukan hard errors.
> 13. Prioritaskan simplicity. Jangan over-engineer di luar kebutuhan current sprint task.
> 14. Ketika sprint task mereferensikan screen, cek di `component_tree.md` sebelum build.
> 15. **Database adalah Supabase (Opsi B):** `DATABASE_URL` = pooler (pgBouncer, port 6543, untuk runtime). `DIRECT_URL` = direct connection (port 5432, untuk migrate/seed). Jangan gunakan satu URL untuk keduanya.
> 16. **Jangan install `@supabase/supabase-js`** — semua akses database melalui Prisma. Supabase hanya sebagai host, bukan SDK.
> 17. **Jangan aktifkan Row Level Security (RLS)** di Supabase — RBAC ditangani di application layer via Prisma + Server Actions.
> 18. **`prisma migrate dev`** untuk development lokal. **`prisma migrate deploy`** untuk production (Vercel build atau manual post-deploy).

---

## Last Updated

| Field | Value |
|---|---|
| **Date** | 2026-06-22 |
| **Updated By** | Claude (Supabase Opsi B update) |
