# role_permission_matrix.md — EkskulKu

## Document Info

| Field | Detail |
|---|---|
| **Purpose** | Single source of truth for RBAC enforcement across Server Actions, Route Handlers, and UI rendering |
| **Roles** | `ADMIN`, `PEMBINA`, `SISWA`, `ORANG_TUA` |
| **Last Updated** | 2026-06-21 |

> **Convention:** "Own scope" for Pembina = extracurriculars where `Extracurricular.coachId == currentUser.coach.id`.
> "Own scope" for Orang Tua = students linked via `ParentStudent` where `parentId == currentUser.parent.id`.
> "Own scope" for Siswa = their own `Student` record only.

---

## 1. Module: Authentication

| Action | Admin | Pembina | Siswa | Orang Tua |
|---|---|---|---|---|
| Login | ✅ | ✅ | ✅ | ✅ |
| Reset own password | ✅ | ✅ | ✅ | ✅ |
| Create new user accounts | ✅ | ❌ | ❌ | ❌ |
| Deactivate any user account | ✅ | ❌ | ❌ | ❌ |

---

## 2. Module: Extracurricular Management

| Action | Admin | Pembina | Siswa | Orang Tua |
|---|---|---|---|---|
| View list of all ekskul | ✅ | ✅ | ✅ | ✅ |
| Create new ekskul | ✅ | ❌ | ❌ | ❌ |
| Edit ekskul (own scope) | ✅ | ✅ (own only) | ❌ | ❌ |
| Edit any ekskul | ✅ | ❌ | ❌ | ❌ |
| Deactivate ekskul | ✅ | ❌ | ❌ | ❌ |
| Assign coach to ekskul | ✅ | ❌ | ❌ | ❌ |

---

## 3. Module: Registration & Membership

| Action | Admin | Pembina | Siswa | Orang Tua |
|---|---|---|---|---|
| Submit registration (self) | ❌ | ❌ | ✅ | ❌ |
| View own registration status | ❌ | ❌ | ✅ | ✅ (linked child only) |
| View all pending registrations | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Approve/reject registration | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| View member list | ✅ | ✅ (own ekskul only) | ❌ (own profile only) | ❌ (linked child only) |
| Edit member data | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Remove member | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Search/filter members | ✅ | ✅ (own ekskul only) | ❌ | ❌ |

---

## 4. Module: Schedule

| Action | Admin | Pembina | Siswa | Orang Tua |
|---|---|---|---|---|
| View schedule | ✅ | ✅ | ✅ (own ekskul only) | ✅ (linked child's ekskul only) |
| Create schedule entry | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Edit schedule entry | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Delete schedule entry | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Trigger conflict check (student + room) | ✅ | ✅ | — (system-run) | — |
| Manage rooms (CRUD) | ✅ | ❌ | ❌ | ❌ |

---

## 5. Module: Attendance

| Action | Admin | Pembina | Siswa | Orang Tua |
|---|---|---|---|---|
| Create attendance session | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Record attendance status | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Edit submitted attendance | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| View attendance recap (own) | ❌ | ✅ (own ekskul only) | ✅ (own only) | ✅ (linked child only) |
| View attendance recap (all ekskul) | ✅ | ❌ | ❌ | ❌ |
| Export attendance report | ✅ | ✅ (own ekskul only) | ❌ | ❌ |

---

## 6. Module: Announcements

| Action | Admin | Pembina | Siswa | Orang Tua |
|---|---|---|---|---|
| Create announcement (own ekskul) | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Create global announcement | ✅ | ❌ | ❌ | ❌ |
| Publish/archive announcement | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| View announcements (relevant) | ✅ (all) | ✅ (own ekskul + global) | ✅ (own ekskul + global) | ✅ (linked child's ekskul + global) |
| Edit/delete announcement | ✅ | ✅ (own, own ekskul only) | ❌ | ❌ |

---

## 7. Module: Achievements & Competitions

| Action | Admin | Pembina | Siswa | Orang Tua |
|---|---|---|---|---|
| Create competition entry | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Record achievement/result | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Upload certificate | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| View achievements (own) | ❌ | ✅ (own ekskul only) | ✅ (own only) | ✅ (linked child only) |
| View achievements (all) | ✅ | ❌ | ❌ | ❌ |
| Generate achievement report | ✅ | ✅ (own ekskul only) | ❌ | ❌ |

---

## 8. Module: Finance / Payment

| Action | Admin | Pembina | Siswa | Orang Tua |
|---|---|---|---|---|
| Record income (dues) | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Record expense | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Edit/delete payment record | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| View own payment status | ❌ | ❌ | ✅ (own only) | ✅ (linked child only) |
| View ekskul cash balance | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| View all ekskul cash balances | ✅ | ❌ | ❌ | ❌ |
| Generate financial report | ✅ | ✅ (own ekskul only) | ❌ | ❌ |

---

## 9. Module: Notifications

| Action | Admin | Pembina | Siswa | Orang Tua |
|---|---|---|---|---|
| Receive in-app notifications | ✅ | ✅ | ✅ | ✅ |
| Mark notification as read | ✅ | ✅ | ✅ | ✅ |
| View own notification list | ✅ | ✅ | ✅ | ✅ |

---

## 10. Module: Reporting

| Action | Admin | Pembina | Siswa | Orang Tua |
|---|---|---|---|---|
| Generate Member report | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Generate Attendance report | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Generate Achievement report | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Generate Financial report | ✅ | ✅ (own ekskul only) | ❌ | ❌ |
| Export to PDF | ✅ | ✅ (own scope) | ❌ | ❌ |
| Export to Excel | ✅ | ✅ (own scope) | ❌ | ❌ |

---

## 11. Enforcement Pattern (Implementation Guidance)

Every Server Action / Route Handler must:

1. **Authenticate** — verify session via NextAuth (`auth()` helper)
2. **Authorize by role** — check `session.user.role` against the allowed roles for the action
3. **Authorize by scope** — for Pembina/Siswa/Orang Tua, verify the target resource belongs to their scope (e.g., `extracurricular.coachId === session.user.coach.id`)
4. **Reject with 403** — never silently filter; throw/return an explicit authorization error (FR-11.3)

Recommended helper pattern:

```ts
// lib/auth/guards.ts
export async function requireRole(allowed: Role[]) {
  const session = await auth();
  if (!session || !allowed.includes(session.user.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function requireCoachOwnership(extracurricularId: string, session: Session) {
  if (session.user.role === "ADMIN") return; // admin bypasses ownership check
  const ekskul = await prisma.extracurricular.findUnique({ where: { id: extracurricularId } });
  if (ekskul?.coachId !== session.user.coach?.id) {
    throw new Error("FORBIDDEN");
  }
}
```

This pattern is referenced throughout `api_contract.md`.
