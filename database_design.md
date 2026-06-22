# database_design.md — EkskulKu

## Document Info

| Field | Detail |
|---|---|
| **Database** | PostgreSQL — hosted on **Supabase** |
| **ORM** | Prisma (Opsi B: Prisma tetap sebagai ORM, Supabase hanya sebagai host) |
| **Connection** | Supabase connection pooling (pgBouncer) untuk runtime + direct connection untuk migrations |
| **Status** | 🟢 Source of truth for schema |
| **Last Updated** | 2026-06-22 |

> All decisions from the agreed decision list are reflected here, in particular:
> #2 (no max-2-ekskul cap), #3/#4 (NISN-only registration fields), #6 (registration approval workflow), #7 (Notification entity), #8 (dual conflict detection support), #10 (Payment entity fields), #12 (5-state attendance enum).
>
> **Supabase stack note:** Prisma digunakan sebagai satu-satunya ORM — Supabase hanya menyediakan database PostgreSQL-nya. Tidak menggunakan `@supabase/supabase-js`, Supabase Auth, atau Supabase Realtime dalam konfigurasi ini. NextAuth tetap digunakan untuk authentication.

---

## 1. Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    USER ||--o| STUDENT : "has profile"
    USER ||--o| COACH : "has profile"
    USER ||--o| PARENT : "has profile"
    USER ||--o| ADMIN : "has profile"

    PARENT ||--o{ PARENT_STUDENT : links
    STUDENT ||--o{ PARENT_STUDENT : "linked to"

    COACH ||--o{ EXTRACURRICULAR : coaches
    EXTRACURRICULAR ||--o{ SCHEDULE : has
    EXTRACURRICULAR ||--o{ ANNOUNCEMENT : has
    EXTRACURRICULAR ||--o{ REGISTRATION : receives
    EXTRACURRICULAR ||--o{ ATTENDANCE_SESSION : has
    EXTRACURRICULAR ||--o{ PAYMENT : has
    EXTRACURRICULAR ||--o{ COMPETITION : organizes

    STUDENT ||--o{ REGISTRATION : submits
    REGISTRATION }o--|| EXTRACURRICULAR : "for"
    REGISTRATION ||--o| MEMBERSHIP : "becomes (on approval)"

    MEMBERSHIP }o--|| STUDENT : belongs_to
    MEMBERSHIP }o--|| EXTRACURRICULAR : "member of"

    ATTENDANCE_SESSION ||--o{ ATTENDANCE_RECORD : contains
    STUDENT ||--o{ ATTENDANCE_RECORD : has
    ATTENDANCE_RECORD }o--|| ATTENDANCE_SESSION : "part of"

    ROOM ||--o{ SCHEDULE : "used by"

    COMPETITION ||--o{ ACHIEVEMENT : produces
    STUDENT ||--o{ ACHIEVEMENT : earns

    STUDENT ||--o{ PAYMENT : "owes/pays"

    USER ||--o{ NOTIFICATION : receives

    USER {
        string id PK
        string email UK
        string passwordHash
        Role role
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    STUDENT {
        string id PK
        string userId FK
        string nisn UK
        string fullName
        string className
        Gender gender
        string address
        string studentPhone
        string parentPhone
        datetime createdAt
        datetime updatedAt
    }

    COACH {
        string id PK
        string userId FK
        string fullName
        string phone
        string email
    }

    PARENT {
        string id PK
        string userId FK
        string fullName
        string phone
        string address
    }

    ADMIN {
        string id PK
        string userId FK
        string fullName
    }

    PARENT_STUDENT {
        string id PK
        string parentId FK
        string studentId FK
    }

    EXTRACURRICULAR {
        string id PK
        string name
        string description
        string coachId FK
        ExtracurricularStatus status
        datetime createdAt
        datetime updatedAt
    }

    ROOM {
        string id PK
        string name
        string location
        int capacity
    }

    SCHEDULE {
        string id PK
        string extracurricularId FK
        string roomId FK
        DayOfWeek dayOfWeek
        time startTime
        time endTime
        datetime createdAt
        datetime updatedAt
    }

    REGISTRATION {
        string id PK
        string studentId FK
        string extracurricularId FK
        RegistrationStatus status
        string rejectionReason
        string reviewedById FK
        datetime submittedAt
        datetime reviewedAt
    }

    MEMBERSHIP {
        string id PK
        string studentId FK
        string extracurricularId FK
        string registrationId FK
        MembershipStatus status
        datetime joinedAt
    }

    ATTENDANCE_SESSION {
        string id PK
        string extracurricularId FK
        date sessionDate
        string createdById FK
        datetime createdAt
    }

    ATTENDANCE_RECORD {
        string id PK
        string sessionId FK
        string studentId FK
        AttendanceStatus status
        string note
        string recordedById FK
        datetime createdAt
        datetime updatedAt
    }

    ANNOUNCEMENT {
        string id PK
        string extracurricularId FK
        string title
        string body
        AnnouncementStatus status
        string createdById FK
        boolean isGlobal
        datetime publishedAt
        datetime createdAt
        datetime updatedAt
    }

    COMPETITION {
        string id PK
        string extracurricularId FK
        string name
        CompetitionLevel level
        string location
        date eventDate
        CompetitionStatus status
        datetime createdAt
    }

    ACHIEVEMENT {
        string id PK
        string competitionId FK
        string studentId FK
        AchievementResult result
        string certificateUrl
        string description
        datetime createdAt
    }

    PAYMENT {
        string id PK
        string extracurricularId FK
        string studentId FK
        decimal amount
        string description
        PaymentType type
        date paymentDate
        PaymentStatus status
        PaymentMethod paymentMethod
        string recordedById FK
        datetime createdAt
        datetime updatedAt
    }

    NOTIFICATION {
        string id PK
        string userId FK
        NotificationType type
        string title
        string message
        string referenceUrl
        boolean isRead
        datetime createdAt
    }
```

---

## 2. Enums

| Enum | Values | Notes |
|---|---|---|
| `Role` | `ADMIN`, `PEMBINA`, `SISWA`, `ORANG_TUA` | Stored on `User.role`; source of truth for auth (Decision #11) |
| `Gender` | `LAKI_LAKI`, `PEREMPUAN` | |
| `ExtracurricularStatus` | `ACTIVE`, `INACTIVE` | Soft-disable instead of delete |
| `DayOfWeek` | `SENIN`, `SELASA`, `RABU`, `KAMIS`, `JUMAT`, `SABTU`, `MINGGU` | |
| `RegistrationStatus` | `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED` | Decision #6 workflow |
| `MembershipStatus` | `ACTIVE`, `INACTIVE` | Created only after `RegistrationStatus = APPROVED` |
| `AttendanceStatus` | `HADIR`, `IZIN`, `SAKIT`, `ALFA`, `TERLAMBAT` | Decision #12 — exactly these 5, no `ABSEN` |
| `AnnouncementStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` | |
| `CompetitionLevel` | `SEKOLAH`, `KECAMATAN`, `KOTA_KABUPATEN`, `PROVINSI`, `NASIONAL`, `INTERNASIONAL` | |
| `CompetitionStatus` | `BELUM_MENGIKUTI`, `MENGIKUTI`, `MENUNGGU_HASIL`, `SELESAI` | |
| `AchievementResult` | `JUARA_1`, `JUARA_2`, `JUARA_3`, `JUARA_HARAPAN`, `TIDAK_JUARA` | |
| `PaymentType` | `INCOME`, `EXPENSE` | Decision #10 |
| `PaymentStatus` | `PENDING`, `PAID`, `OVERDUE`, `RECORDED` | `RECORDED` used for `EXPENSE` type (no approval cycle) |
| `PaymentMethod` | `CASH`, `TRANSFER`, `QRIS`, `OTHER` | Decision #10 |
| `NotificationType` | `ANNOUNCEMENT`, `SCHEDULE_CHANGE`, `REGISTRATION_APPROVED`, `REGISTRATION_REJECTED`, `PAYMENT_REMINDER`, `COMPETITION` | Decision #7 trigger list |

---

## 3. Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")       // Supabase connection pooler (pgBouncer) — digunakan saat runtime (Server Actions, Route Handlers)
  directUrl = env("DIRECT_URL")         // Supabase direct connection — digunakan HANYA untuk prisma migrate & prisma db push
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum Role {
  ADMIN
  PEMBINA
  SISWA
  ORANG_TUA
}

enum Gender {
  LAKI_LAKI
  PEREMPUAN
}

enum ExtracurricularStatus {
  ACTIVE
  INACTIVE
}

enum DayOfWeek {
  SENIN
  SELASA
  RABU
  KAMIS
  JUMAT
  SABTU
  MINGGU
}

enum RegistrationStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REJECTED
}

enum MembershipStatus {
  ACTIVE
  INACTIVE
}

enum AttendanceStatus {
  HADIR
  IZIN
  SAKIT
  ALFA
  TERLAMBAT
}

enum AnnouncementStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum CompetitionLevel {
  SEKOLAH
  KECAMATAN
  KOTA_KABUPATEN
  PROVINSI
  NASIONAL
  INTERNASIONAL
}

enum CompetitionStatus {
  BELUM_MENGIKUTI
  MENGIKUTI
  MENUNGGU_HASIL
  SELESAI
}

enum AchievementResult {
  JUARA_1
  JUARA_2
  JUARA_3
  JUARA_HARAPAN
  TIDAK_JUARA
}

enum PaymentType {
  INCOME
  EXPENSE
}

enum PaymentStatus {
  PENDING
  PAID
  OVERDUE
  RECORDED
}

enum PaymentMethod {
  CASH
  TRANSFER
  QRIS
  OTHER
}

enum NotificationType {
  ANNOUNCEMENT
  SCHEDULE_CHANGE
  REGISTRATION_APPROVED
  REGISTRATION_REJECTED
  PAYMENT_REMINDER
  COMPETITION
}

// ─────────────────────────────────────────────
// CORE IDENTITY
// ─────────────────────────────────────────────

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         Role
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  student      Student?
  coach        Coach?
  parent       Parent?
  admin        Admin?
  notifications Notification[]

  @@index([role])
  @@map("users")
}

model Student {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  nisn         String   @unique
  fullName     String
  className    String
  gender       Gender
  address      String
  studentPhone String
  parentPhone  String

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  parentLinks       ParentStudent[]
  registrations     Registration[]
  memberships       Membership[]
  attendanceRecords AttendanceRecord[]
  achievements      Achievement[]
  payments          Payment[]

  @@index([nisn])
  @@index([className])
  @@map("students")
}

model Coach {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  fullName  String
  phone     String
  email     String

  extracurriculars Extracurricular[]

  @@map("coaches")
}

model Parent {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  fullName  String
  phone     String
  address   String

  studentLinks ParentStudent[]

  @@map("parents")
}

model Admin {
  id       String @id @default(cuid())
  userId   String @unique
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  fullName String

  @@map("admins")
}

model ParentStudent {
  id        String  @id @default(cuid())
  parentId  String
  studentId String

  parent  Parent  @relation(fields: [parentId], references: [id], onDelete: Cascade)
  student Student @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@unique([parentId, studentId])
  @@map("parent_students")
}

// ─────────────────────────────────────────────
// EXTRACURRICULAR CORE
// ─────────────────────────────────────────────

model Extracurricular {
  id          String                 @id @default(cuid())
  name        String
  description String
  coachId     String
  status      ExtracurricularStatus  @default(ACTIVE)

  coach Coach @relation(fields: [coachId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  schedules      Schedule[]
  announcements  Announcement[]
  registrations  Registration[]
  memberships    Membership[]
  attendanceSessions AttendanceSession[]
  payments       Payment[]
  competitions   Competition[]

  @@index([coachId])
  @@map("extracurriculars")
}

model Room {
  id       String @id @default(cuid())
  name     String
  location String
  capacity Int?

  schedules Schedule[]

  @@map("rooms")
}

model Schedule {
  id                String    @id @default(cuid())
  extracurricularId String
  roomId            String?
  dayOfWeek         DayOfWeek
  startTime         DateTime  @db.Time
  endTime           DateTime  @db.Time

  extracurricular Extracurricular @relation(fields: [extracurricularId], references: [id], onDelete: Cascade)
  room            Room?           @relation(fields: [roomId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([extracurricularId])
  @@index([roomId, dayOfWeek])
  @@map("schedules")
}

// ─────────────────────────────────────────────
// REGISTRATION & MEMBERSHIP (Decision #6)
// ─────────────────────────────────────────────

model Registration {
  id                String              @id @default(cuid())
  studentId         String
  extracurricularId String
  status            RegistrationStatus  @default(PENDING_APPROVAL)
  rejectionReason   String?
  reviewedById      String?

  student         Student         @relation(fields: [studentId], references: [id], onDelete: Cascade)
  extracurricular Extracurricular @relation(fields: [extracurricularId], references: [id], onDelete: Cascade)

  submittedAt DateTime  @default(now())
  reviewedAt  DateTime?

  membership Membership?

  @@unique([studentId, extracurricularId]) // prevents duplicate registration to same ekskul
  @@index([extracurricularId, status])
  @@map("registrations")
}

model Membership {
  id                String            @id @default(cuid())
  studentId         String
  extracurricularId String
  registrationId    String            @unique
  status            MembershipStatus  @default(ACTIVE)
  joinedAt          DateTime          @default(now())

  student         Student         @relation(fields: [studentId], references: [id], onDelete: Cascade)
  extracurricular Extracurricular @relation(fields: [extracurricularId], references: [id], onDelete: Cascade)
  registration    Registration    @relation(fields: [registrationId], references: [id], onDelete: Cascade)

  @@unique([studentId, extracurricularId])
  @@index([extracurricularId, status])
  @@map("memberships")
}

// ─────────────────────────────────────────────
// ATTENDANCE
// ─────────────────────────────────────────────

model AttendanceSession {
  id                String   @id @default(cuid())
  extracurricularId String
  sessionDate       DateTime @db.Date
  createdById       String

  extracurricular Extracurricular @relation(fields: [extracurricularId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  records AttendanceRecord[]

  @@unique([extracurricularId, sessionDate])
  @@index([extracurricularId, sessionDate])
  @@map("attendance_sessions")
}

model AttendanceRecord {
  id           String            @id @default(cuid())
  sessionId    String
  studentId    String
  status       AttendanceStatus
  note         String?
  recordedById String

  session AttendanceSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  student Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([sessionId, studentId])
  @@index([studentId])
  @@map("attendance_records")
}

// ─────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────

model Announcement {
  id                String              @id @default(cuid())
  extracurricularId String?             // null if isGlobal = true
  title             String
  body              String
  status            AnnouncementStatus  @default(DRAFT)
  createdById       String
  isGlobal          Boolean             @default(false)

  extracurricular Extracurricular? @relation(fields: [extracurricularId], references: [id], onDelete: Cascade)

  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([extracurricularId, status])
  @@map("announcements")
}

// ─────────────────────────────────────────────
// ACHIEVEMENTS & COMPETITIONS
// ─────────────────────────────────────────────

model Competition {
  id                String             @id @default(cuid())
  extracurricularId String
  name              String
  level             CompetitionLevel
  location          String
  eventDate         DateTime           @db.Date
  status            CompetitionStatus  @default(BELUM_MENGIKUTI)

  extracurricular Extracurricular @relation(fields: [extracurricularId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  achievements Achievement[]

  @@index([extracurricularId])
  @@map("competitions")
}

model Achievement {
  id             String             @id @default(cuid())
  competitionId  String
  studentId      String
  result         AchievementResult
  certificateUrl String?
  description    String?

  competition Competition @relation(fields: [competitionId], references: [id], onDelete: Cascade)
  student     Student     @relation(fields: [studentId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@index([studentId])
  @@index([competitionId])
  @@map("achievements")
}

// ─────────────────────────────────────────────
// FINANCE (Decision #10)
// ─────────────────────────────────────────────

model Payment {
  id                String         @id @default(cuid())
  extracurricularId String
  studentId         String?        // null for general ekskul expenses not tied to a student
  amount            Decimal        @db.Decimal(12, 2)
  description       String
  type              PaymentType
  paymentDate        DateTime       @db.Date
  status            PaymentStatus  @default(PENDING)
  paymentMethod     PaymentMethod?
  recordedById      String

  extracurricular Extracurricular @relation(fields: [extracurricularId], references: [id], onDelete: Cascade)
  student         Student?        @relation(fields: [studentId], references: [id], onDelete: SetNull)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([extracurricularId, type])
  @@index([studentId, status])
  @@map("payments")
}

// ─────────────────────────────────────────────
// NOTIFICATIONS (Decision #7)
// ─────────────────────────────────────────────

model Notification {
  id           String            @id @default(cuid())
  userId       String
  type         NotificationType
  title        String
  message      String
  referenceUrl String?
  isRead       Boolean           @default(false)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@index([userId, isRead])
  @@map("notifications")
}
```

---

## 4. Key Indexes & Constraints Rationale

| Constraint | Purpose |
|---|---|
| `Student.nisn @unique` | Enforces canonical, non-duplicate student identity (Decision #4) |
| `Registration @@unique([studentId, extracurricularId])` | Prevents duplicate registration to the same ekskul (FR-2.4) — does **not** limit number of *different* ekskul (Decision #2) |
| `Membership @@unique([studentId, extracurricularId])` | One active membership per student per ekskul |
| `AttendanceSession @@unique([extracurricularId, sessionDate])` | One session per ekskul per day |
| `AttendanceRecord @@unique([sessionId, studentId])` | One attendance record per student per session |
| `ParentStudent @@unique([parentId, studentId])` | Prevents duplicate parent-child links |
| `@@index([role])` on User | Fast role-based queries for auth/RBAC |
| `@@index([roomId, dayOfWeek])` on Schedule | Supports room-conflict detection queries (Decision #8) |
| `@@index([extracurricularId, status])` on Registration | Fast pending-approval queue lookups (Decision #6) |

---

## 5. Conflict Detection Query Patterns (Decision #8)

**Student-level conflict** (pseudocode for Server Action):
```ts
// When registering a student to a new ekskul, fetch all active schedules
// for the student's other ACTIVE memberships and compare dayOfWeek + time overlap.
const studentSchedules = await prisma.schedule.findMany({
  where: {
    extracurricular: {
      memberships: { some: { studentId, status: "ACTIVE" } }
    }
  }
});
// Compare against new ekskul's schedule for overlapping dayOfWeek + time range.
```

**Room-level conflict**:
```ts
// When creating/editing a Schedule, check for existing schedules
// in the same room, same day, with overlapping time range.
const roomConflicts = await prisma.schedule.findMany({
  where: {
    roomId,
    dayOfWeek,
    id: { not: scheduleIdBeingEdited }, // exclude self on edit
  }
});
// Then filter in app code for time overlap: (startA < endB) && (startB < endA)
```

Both checks return **warnings**, surfaced in the UI (per FR-4.4) — they do not block save.

---

## 6. Supabase Setup & Migration Notes

### 6.1 Cara Mendapatkan Connection Strings dari Supabase

1. Buka **Supabase Dashboard** → pilih project → **Settings** → **Database**
2. Scroll ke bagian **Connection string**
3. Ambil dua string berikut:

| Variable | Sumber di Supabase Dashboard | Digunakan Untuk |
|---|---|---|
| `DATABASE_URL` | **Connection pooling** → Mode: **Transaction** → toggle "Display connection pooler" ON → copy URI | Runtime (Server Actions, Route Handlers, Vercel deployment) |
| `DIRECT_URL` | **Direct connection** → copy URI (port 5432) | `prisma migrate`, `prisma db push`, `prisma db seed` |

> ⚠️ **Penting:** `DATABASE_URL` menggunakan **pgBouncer** (port `6543`, mode Transaction) — ini yang dipakai di production/Vercel karena serverless functions tidak bisa maintain persistent DB connections. `DIRECT_URL` menggunakan koneksi langsung (port `5432`) — HANYA untuk migration, jangan digunakan di runtime.

### 6.2 Environment Variables

**`.env.local`** (development lokal — jangan di-commit):
```bash
# Supabase — Connection Pooler (pgBouncer, Transaction mode)
# Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Supabase — Direct Connection (untuk migrate & seed)
# Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"   # generate: openssl rand -base64 32
```

**`.env.example`** (di-commit ke repo — nilai dikosongkan):
```bash
DATABASE_URL=""
DIRECT_URL=""
NEXTAUTH_URL=""
NEXTAUTH_SECRET=""
CRON_SECRET=""
```

**Vercel Environment Variables** (Settings → Environment Variables):
```
DATABASE_URL    → Supabase pooler URL (sama dengan .env.local DATABASE_URL)
DIRECT_URL      → Supabase direct URL (sama dengan .env.local DIRECT_URL)
NEXTAUTH_URL    → https://your-production-domain.vercel.app
NEXTAUTH_SECRET → sama dengan lokal (atau generate baru)
CRON_SECRET     → random string untuk mengamankan cron endpoint
```

### 6.3 Konfigurasi `schema.prisma` untuk Supabase

Parameter penting yang harus ada di `DATABASE_URL` untuk pgBouncer:
- `?pgbouncer=true` — memberitahu Prisma bahwa koneksi melalui pgBouncer
- `&connection_limit=1` — penting untuk serverless/edge environment (Vercel)

```prisma
// schema.prisma — bagian datasource (sudah tercantum di §3 di atas)
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooler — runtime
  directUrl = env("DIRECT_URL")     // direct — migrations only
}
```

### 6.4 Perintah Migration

```bash
# Pertama kali — buat migration awal
npx prisma migrate dev --name init
# Prisma akan menggunakan DIRECT_URL untuk menjalankan migration ke Supabase

# Generate Prisma Client setelah schema berubah
npx prisma generate

# Push schema tanpa membuat migration file (untuk prototyping)
npx prisma db push

# Jalankan seed script
npx prisma db seed
# seed script harus ditambahkan di package.json:
# "prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }

# Lihat data via Prisma Studio (opsional, terhubung ke Supabase langsung)
npx prisma studio
```

### 6.5 Seed Script

`prisma/seed.ts` harus membuat data berikut untuk keperluan development:

```ts
// prisma/seed.ts (skeleton)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1 Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@ekskulku.sch.id",
      passwordHash: await bcrypt.hash("admin123", 12),
      role: "ADMIN",
      admin: { create: { fullName: "Anugrah Kurniawan" } },
    },
  });

  // 2 Coaches (Pembina)
  const coach1 = await prisma.user.create({
    data: {
      email: "ibu.cucu@ekskulku.sch.id",
      passwordHash: await bcrypt.hash("pembina123", 12),
      role: "PEMBINA",
      coach: { create: { fullName: "Ibu Cucu", phone: "081234567890", email: "ibu.cucu@ekskulku.sch.id" } },
    },
  });

  // 2 Rooms
  await prisma.room.createMany({
    data: [
      { name: "Lab 2", location: "Gedung B", capacity: 30 },
      { name: "Studio A", location: "Gedung C", capacity: 20 },
    ],
  });

  // 4 Extracurriculars (English Club, Pramuka, Mading, Tahfidz)
  // ... (ikuti pola di atas)

  // Sample Students + Parents
  // ... 

  console.log("✅ Seed complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

### 6.6 Catatan Supabase-Specific

| Topik | Detail |
|---|---|
| **IPv4 vs IPv6** | Supabase free plan menggunakan IPv6 by default. Jika Vercel deployment gagal konek, aktifkan **IPv4 add-on** di Supabase Dashboard (berbayar) atau gunakan Supabase connection pooler (sudah IPv4-compatible). |
| **Connection limit** | Supabase free plan: max **60 connections**. Dengan pgBouncer (Transaction mode), 1 Prisma client = 1 pooled connection — aman untuk production skala kecil. |
| **SSL** | Supabase enforce SSL by default. Connection string dari dashboard sudah include `sslmode=require`. Tidak perlu konfigurasi tambahan. |
| **Row Level Security (RLS)** | Supabase mendukung RLS, tapi **tidak digunakan** dalam Opsi B ini — RBAC ditangani di application layer (Prisma + Server Actions + `role_permission_matrix.md`). Pastikan RLS **dinonaktifkan** untuk semua tabel, atau Prisma queries akan selalu return 0 rows. |
| **Realtime** | Supabase Realtime **tidak digunakan** — notifikasi ditangani via in-app polling (`GET /api/notifications`) per Decision #7. |
| **Supabase Storage** | Tidak digunakan dalam MVP. Upload sertifikat (`Achievement.certificateUrl`) menyimpan URL eksternal (bisa ditambahkan Supabase Storage di fase post-MVP). |
| **Database Backups** | Supabase free plan: daily backups (7 days retention). Cukup untuk development. Production/paid plan: PITR (Point-in-Time Recovery). |

### 6.7 Vercel Deployment + Supabase Checklist

```
□ Supabase project dibuat (region: pilih yang paling dekat dengan Vercel region)
□ DATABASE_URL (pooler) ditambahkan ke Vercel env vars
□ DIRECT_URL (direct) ditambahkan ke Vercel env vars
□ npx prisma migrate deploy dijalankan (bukan migrate dev) untuk production migration
□ RLS dinonaktifkan di semua tabel Supabase (atau tidak pernah diaktifkan)
□ Seed data dijalankan sekali via DIRECT_URL setelah first deploy
□ IPv4 add-on diaktifkan jika ada connection error dari Vercel
```

> **`prisma migrate deploy` vs `prisma migrate dev`:**
> - `migrate dev` — untuk development lokal, bisa membuat migration baru secara interaktif
> - `migrate deploy` — untuk production/CI, hanya menjalankan migration yang sudah ada, tidak membuat yang baru. Tambahkan ini ke Vercel build command atau jalankan manual setelah deploy.
