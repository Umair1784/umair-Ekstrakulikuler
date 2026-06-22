# PRD.md — EkskulKu (Sistem Informasi Ekstrakurikuler)

## Document Info

| Field | Detail |
|---|---|
| **Product Name** | EkskulKu |
| **Type** | Web-based Extracurricular Management System |
| **Source Institution** | Universitas Jenderal Achmad Yani — Program Studi Informatika |
| **Source Document** | Dokumen Kebutuhan Sistem Pendaftaran Ekstrakurikuler (2026) |
| **Status** | 🟢 Approved for implementation |
| **Version** | 1.0 |
| **Last Updated** | 2026-06-21 |

---

## Design System

### Colors
- Primary: Orange
- Secondary: Navy
- Background: White

### Components
- Rounded card
- Shadow-sm
- Button radius lg

### Typography
- Heading: Navy
- Body: Gray-700

### Style
- Clean
- Modern
- Mobile-first
- Consistent spacing

## 1. Problem Statement

School extracurricular activities (ekskul) are currently managed manually or via plain Google Forms. This causes:

- Duplicate / inconsistent student data (no central record)
- Attendance tracked on paper, easily lost or miscounted
- Announcements only via WhatsApp groups — students/parents miss updates
- Achievement & competition records scattered across individual coaches' personal files
- Cash/dues tracked manually with no transparency for members
- Parents have no visibility into their child's attendance, schedule, or achievements
- No centralized reporting for school administration or accreditation needs

**EkskulKu** replaces this with a single web platform covering registration, membership, scheduling, digital attendance, announcements, achievements, finance, and reporting — with role-based access for Admin, Pembina (coach), Siswa (student), and Orang Tua (parent).

---

## 2. Goals

| # | Goal |
|---|---|
| 1 | Enable fully online ekskul registration with approval workflow |
| 2 | Centralize member data — eliminate duplicates, enable fast search |
| 3 | Digitize attendance with 5-state status tracking |
| 4 | Deliver schedule & announcement info instantly online (replace WhatsApp dependency) |
| 5 | Document achievements/competitions in a structured, reportable format |
| 6 | Provide transparent, auditable cash/dues tracking |
| 7 | Give parents real-time, read-only monitoring of their child's activity |
| 8 | Generate exportable (PDF/Excel) reports for school administration & accreditation |

## 3. Non-Goals (Out of Scope for MVP)

- Email or push notifications (in-app only — see Decision #7)
- Payment gateway integration (dues recorded manually by Admin/Pembina, not paid online)
- Multi-school / multi-tenant support (single school instance)
- Native mobile app (responsive web only)
- Public-facing marketing pages outside the authenticated app

---

## 4. User Roles & Personas

| Role | Description | Primary Device |
|---|---|---|
| **Admin** | Highest privilege. Manages all data, users, approvals, and global reports. | Desktop |
| **Pembina** | Coach/supervisor of one or more ekskul. Manages members, attendance, schedule, announcements, achievements, finance for *their* ekskul. | Desktop + Mobile |
| **Siswa** | Student. Registers for ekskul, views schedule/announcements/attendance/achievements/payment status. | Mobile |
| **Orang Tua** | Parent/guardian. Read-only monitoring of their linked child(ren). | Mobile |

Full capability breakdown lives in **`role_permission_matrix.md`**.

---

## 5. Functional Requirements

### FR-1: Authentication & Authorization
- FR-1.1: Users log in via email + password (NextAuth Credentials Provider)
- FR-1.2: Login screen offers a role selector (Siswa / Orang Tua / Admin / Pembina) as **UI convenience only** — the actual role is read from `User.role` in the database and validated server-side (Decision #11)
- FR-1.3: Session-based route protection: each role only accesses authorized routes/actions
- FR-1.4: Password reset flow (basic, token-based)

### FR-2: Extracurricular Registration (Online)
- FR-2.1: System displays list of available ekskul (name, description, coach, schedule, capacity)
- FR-2.2: Student fills registration form with: **Full Name, NISN, Class, Gender, Address, Parent Phone Number, Student Phone Number, Selected Extracurricular** (Decision #3 — NISN only, no "NIS" field, Decision #4)
- FR-2.3: Students may register for **multiple ekskul with no maximum limit** (Decision #2)
- FR-2.4: System prevents duplicate registration to the *same* ekskul by the same student (unique constraint: studentId + ekskulId)
- FR-2.5: System validates required fields and NISN format before submission
- FR-2.6: **New registrations require approval** before becoming active members (Decision #6). Flow:
  `Draft Registration → Pending Approval → Approved / Rejected → Active Member`
- FR-2.7: Admin or Pembina (of the relevant ekskul) can approve or reject pending registrations
- FR-2.8: Rejected registrations notify the student in-app with a reason (optional text field)
- FR-2.9: Admin/Pembina can view, search, edit, and delete registrant/member data

### FR-3: Member Management
- FR-3.1: List members filterable/searchable by name, class, NISN, or ekskul
- FR-3.2: View member profile including registration history across all ekskul
- FR-3.3: Admin/Pembina can edit or remove member records
- FR-3.4: System groups members by ekskul automatically

### FR-4: Schedule Management
- FR-4.1: Each ekskul has one or more weekly schedule slots (day, start time, end time, room/location)
- FR-4.2: Admin/Pembina can create, edit, delete schedule entries
- FR-4.3: **Two conflict detection types required (Decision #8):**
  - **Student-level conflict:** warns if a student is registered in two ekskul whose schedules overlap
  - **Room-level conflict:** warns if two ekskul are scheduled in the same room at an overlapping time
- FR-4.4: Conflicts are shown as warnings (non-blocking) at creation/edit time — final decision rests with Admin/Pembina
- FR-4.5: Students and parents view schedules in read-only calendar/list view
- FR-4.6: Schedule changes trigger an in-app notification (Decision #7)

### FR-5: Digital Attendance
- FR-5.1: Pembina takes attendance per session, per member
- FR-5.2: Attendance status enum (Decision #12): **Hadir, Izin, Sakit, Alfa, Terlambat** (no generic "Absen")
- FR-5.3: System generates weekly and monthly attendance recaps per student and per ekskul
- FR-5.4: Students/parents view attendance history and percentage
- FR-5.5: Admin/Pembina view attendance reports filterable by ekskul/date range
- FR-5.6: Attendance once submitted can be edited by Pembina/Admin (with audit trail: updatedAt, updatedBy)

### FR-6: Announcements
- FR-6.1: Admin/Pembina create announcements (title, body, target ekskul or global, optional attachment)
- FR-6.2: Announcement lifecycle: **Draft → Published → Archived**
- FR-6.3: Students/parents see published announcements relevant to their ekskul(s)
- FR-6.4: Announcement history is retained and searchable/filterable
- FR-6.5: New announcement triggers in-app notification to relevant users (Decision #7)

### FR-7: Achievements & Competitions (Prestasi & Lomba)
- FR-7.1: Pembina/Admin records a **Lomba** (competition): name, level/tingkat, date, location
- FR-7.2: Pembina/Admin records **Prestasi** (achievement) tied to a Lomba and a student: result (juara/tidak juara), certificate/documentation upload
- FR-7.3: Competition lifecycle (state): **Belum Mengikuti Lomba → Mengikuti Lomba → Menunggu Hasil → Juara / Tidak Juara**
- FR-7.4: Students/parents view their own achievements; all users can view public competition announcements
- FR-7.5: Admin generates achievement reports per ekskul or school-wide
- FR-7.6: New competition announcement triggers in-app notification (Decision #7)

### FR-8: Finance / Cash Management (Kas)
- FR-8.1: Admin/Pembina records financial transactions per ekskul: **dues (income)** and **expenses**
- FR-8.2: Each transaction (Payment entity, Decision #10) includes: `amount`, `description`, `type` (INCOME/EXPENSE), `paymentDate`, `status`, `paymentMethod`
- FR-8.3: Payment status lifecycle: **Pending → Paid / Overdue** (for dues); **Recorded** (for expenses, no approval needed)
- FR-8.4: Students/parents view their own payment history and outstanding balance
- FR-8.5: Pembina/Admin views running cash balance (income − expense) per ekskul
- FR-8.6: System sends in-app payment reminder notifications for pending/overdue dues (Decision #7)
- FR-8.7: Admin generates financial reports (income, expense, balance) exportable to PDF/Excel

### FR-9: Notifications (In-App Only)
- FR-9.1: Notification entity stores: recipient, type, title, message, read status, link/reference, createdAt
- FR-9.2: Triggers (Decision #7): new announcement, schedule change, registration approved/rejected, payment reminder, competition announcement
- FR-9.3: Users see unread count badge; mark-as-read on view
- FR-9.4: No email/push delivery in MVP — in-app bell icon only

### FR-10: Reporting
- FR-10.1: Admin generates reports: Member, Attendance, Achievement, Financial
- FR-10.2: Reports filterable by date range and/or ekskul
- FR-10.3: **Export formats: PDF and Excel (.xlsx)** (Decision #9). Print is a "browser print" convenience on top of PDF, not a separate requirement.
- FR-10.4: Pembina can generate reports scoped to their own ekskul only

### FR-11: Role-Based Access Control
- FR-11.1: Every route/Server Action enforces role + ownership checks (e.g., Pembina can only edit their own ekskul's data)
- FR-11.2: Orang Tua access is scoped to their linked child/children only (via ParentStudent relation)
- FR-11.3: Unauthorized access attempts return 403 and are not silently ignored

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | NextAuth session-based auth; hashed passwords (bcrypt); RBAC enforced server-side on every Server Action/Route Handler; CSRF protection via NextAuth defaults |
| **Performance** | Member search & list views respond < 500ms for up to ~5,000 students; paginated queries via Prisma (`take`/`skip`) |
| **Usability** | Mobile-first responsive UI (shadcn/ui + Tailwind); simple forms; clear validation errors |
| **Reliability** | PostgreSQL with proper foreign keys/constraints to prevent orphaned/duplicate data; unique constraint on (studentId, ekskulId) registration |
| **Availability** | Deployed on Vercel; accessible via any modern browser, desktop or mobile |
| **Data Validation** | NISN required + unique per student; phone number format validated; enum-constrained fields (status, role, type) enforced at DB + app layer via Zod |
| **Scalability** | Schema supports growth in students, ekskul, and historical data (attendance/finance/achievements) without redesign |
| **Maintainability** | Feature-based folder structure; typed end-to-end (TypeScript + Prisma + Zod); reusable shadcn/ui components |
| **Portability** | Fully browser-based; no native install required |
| **Auditability** | createdAt/updatedAt timestamps on all core entities; attendance and registration changes are traceable |

---

## 7. System Architecture (Source of Truth — Decision #1)

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js Server Actions (mutations) + Route Handlers (REST-style endpoints for exports/webhooks) |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | NextAuth (Credentials Provider, JWT or database session strategy) |
| **Deployment** | Vercel |
| **File/Doc Export** | PDF generation (e.g., `@react-pdf/renderer` or `pdf-lib`) + Excel export (e.g., `exceljs` or `xlsx`) — implemented inside Route Handlers |

> ⚠️ The original requirements document's deployment diagram (Laravel + MySQL) is **deprecated and not used**. This Next.js/Prisma/PostgreSQL stack is the only source of truth going forward.

---

## 8. Key Business Rules

1. A student may register for **any number of ekskul** (no cap) — Decision #2.
2. A student cannot register twice for the **same** ekskul.
3. Registration is not active until **approved** by Admin or the relevant Pembina — Decision #6.
4. Schedule conflicts (student-level and room-level) are **warnings, not hard blocks** — final say belongs to the approver.
5. Attendance status must be one of exactly 5 enum values — Decision #12.
6. Orang Tua accounts can only view data for students explicitly linked to them.
7. Pembina can only manage data (members, attendance, schedule, announcements, finance, achievements) for ekskul they are assigned to coach.
8. Payment/Finance records are manually entered by Admin/Pembina — there is no online payment gateway in MVP.
9. NISN is the canonical student identifier; "NIS" is not used anywhere in the system — Decision #4.

---

## 9. Pages / Screens (from Figma + UI screenshots)

| # | Screen | Primary Role(s) |
|---|---|---|
| 1 | Login (with role selector) | All |
| 2 | Student Dashboard | Siswa |
| 3 | Beranda (Browse/Join Ekskul) | Siswa |
| 4 | Registration Form | Siswa |
| 5 | Activity Detail | Siswa |
| 6 | Attendance Recap (student view) | Siswa |
| 7 | Parent Dashboard | Orang Tua |
| 8 | Pembina Dashboard | Pembina |
| 9 | Attendance Taking | Pembina |
| 10 | Announcements | Admin, Pembina, Siswa, Orang Tua (scoped) |
| 11 | Schedule Management (with conflict warning) | Admin, Pembina |
| 12 | Achievements / Prestasi | Admin, Pembina, Siswa, Orang Tua (scoped) |
| 13 | Admin Panel (+ sidebar) | Admin |
| 14 | Finance / Keuangan | Admin, Pembina, Siswa, Orang Tua (scoped) |
| 15 | Reports & Analytics | Admin, Pembina (scoped) |
| 16 | Registration Approval Queue *(new — Decision #6)* | Admin, Pembina |
| 17 | Notifications Panel *(new — Decision #7)* | All |

Full route mapping is in **`component_tree.md`** and **`folder_structure.md`**.

---

## 10. Success Metrics (Post-Launch)

| Metric | Target |
|---|---|
| Registration completion time | < 3 minutes per student |
| Attendance recording time per session | < 2 minutes per ekskul group |
| Parent monthly active usage | > 60% of linked parent accounts |
| Report generation time | < 10 seconds for PDF/Excel export |
| Data duplication incidents | 0 (enforced via unique constraints) |

---

## 11. Open Questions / Future Considerations

- Should Pembina be allowed to create new ekskul, or only Admin? *(Current assumption: Admin creates ekskul; Pembina is assigned to it.)*
- Should rejected registrations be permanently deleted or retained for audit? *(Current assumption: retained with status REJECTED.)*
- Future: online payment gateway integration (Midtrans/Xendit) — explicitly out of scope for MVP.
- Future: push/email notifications — explicitly out of scope for MVP (Decision #7).

---

## 12. Related Documents

- `PROJECT_CONTEXT.md` — current build status, conventions, AI assistant rules
- `Sprint_Task_Breakdown.md` — sprint-by-sprint task list
- `database_design.md` — ERD, Prisma schema, enums
- `api_contract.md` — endpoint/action contracts
- `component_tree.md` — App Router + component structure
- `folder_structure.md` — recommended project layout
- `role_permission_matrix.md` — full RBAC matrix
- `sequence_diagrams.md` — Mermaid sequence diagrams per flow
- `development_roadmap.md` — phased delivery plan
