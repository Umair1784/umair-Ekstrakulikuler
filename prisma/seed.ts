import { PrismaClient, Role, Gender, ExtracurricularStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // 1 Admin
  await prisma.user.upsert({
    where: { email: "admin@ekskulku.com" },
    update: {},
    create: {
      email: "admin@ekskulku.com",
      passwordHash,
      role: Role.ADMIN,
      admin: {
        create: {
          fullName: "System Administrator",
        },
      },
    },
  });

  // 3 Pembina
  const pembina1User = await prisma.user.upsert({
    where: { email: "pembina1@ekskulku.com" },
    update: {},
    create: {
      email: "pembina1@ekskulku.com",
      passwordHash,
      role: Role.PEMBINA,
      coach: {
        create: {
          fullName: "Budi Santoso",
          phone: "081234567890",
          email: "pembina1@ekskulku.com",
        },
      },
    },
  });

  const pembina2User = await prisma.user.upsert({
    where: { email: "pembina2@ekskulku.com" },
    update: {},
    create: {
      email: "pembina2@ekskulku.com",
      passwordHash,
      role: Role.PEMBINA,
      coach: {
        create: {
          fullName: "Siti Rahma",
          phone: "081234567891",
          email: "pembina2@ekskulku.com",
        },
      },
    },
  });

  const pembina3User = await prisma.user.upsert({
    where: { email: "pembina3@ekskulku.com" },
    update: {},
    create: {
      email: "pembina3@ekskulku.com",
      passwordHash,
      role: Role.PEMBINA,
      coach: {
        create: {
          fullName: "Andi Wijaya",
          phone: "081234567892",
          email: "pembina3@ekskulku.com",
        },
      },
    },
  });

  // Students and Parents
  const parent1User = await prisma.user.upsert({
    where: { email: "ortu1@ekskulku.com" },
    update: {},
    create: {
      email: "ortu1@ekskulku.com",
      passwordHash,
      role: Role.ORANG_TUA,
      parent: {
        create: {
          fullName: "Orang Tua Ali",
          phone: "08111222333",
          address: "Jl. Merdeka No. 1",
        },
      },
    },
  });

  const student1User = await prisma.user.upsert({
    where: { email: "siswa1@ekskulku.com" },
    update: {},
    create: {
      email: "siswa1@ekskulku.com",
      passwordHash,
      role: Role.SISWA,
      student: {
        create: {
          nisn: "1001001001",
          fullName: "Ali Pangestu",
          className: "X-A",
          gender: Gender.LAKI_LAKI,
          address: "Jl. Merdeka No. 1",
          studentPhone: "08555666777",
          parentPhone: "08111222333",
        },
      },
    },
  });

  // Link parent and student
  const parent1 = await prisma.parent.findUnique({ where: { userId: parent1User.id } });
  const student1 = await prisma.student.findUnique({ where: { userId: student1User.id } });

  if (parent1 && student1) {
    await prisma.parentStudent.upsert({
      where: {
        parentId_studentId: {
          parentId: parent1.id,
          studentId: student1.id,
        },
      },
      update: {},
      create: {
        parentId: parent1.id,
        studentId: student1.id,
      },
    });
  }

  // Coaches
  const coach1 = await prisma.coach.findUnique({ where: { userId: pembina1User.id } });
  const coach2 = await prisma.coach.findUnique({ where: { userId: pembina2User.id } });
  const coach3 = await prisma.coach.findUnique({ where: { userId: pembina3User.id } });

  // Extracurriculars
  if (coach1) {
    await prisma.extracurricular.upsert({
      where: { id: "clx123pramuka" }, // Using a fixed ID might be tricky with cuid, it's better to upsert by something unique, but there's no unique field on name in the schema.
      // Wait, there's no unique constraint on extracurricular name! Let's just findFirst or create.
      // But we can't upsert without a unique field. So I'll findFirst, if not exist, create.
      update: {},
      create: {
        id: "clx123pramuka", // hardcode id for upsert to work in subsequent runs
        name: "Pramuka",
        description: "Kegiatan Kepramukaan wajib",
        coachId: coach1.id,
        status: ExtracurricularStatus.ACTIVE,
      },
    });
    await prisma.extracurricular.upsert({
      where: { id: "clx123paskibra" },
      update: {},
      create: {
        id: "clx123paskibra",
        name: "Paskibra",
        description: "Pasukan Pengibar Bendera",
        coachId: coach1.id,
        status: ExtracurricularStatus.ACTIVE,
      },
    });
  }

  if (coach2) {
    await prisma.extracurricular.upsert({
      where: { id: "clx123pmr" },
      update: {},
      create: {
        id: "clx123pmr",
        name: "PMR",
        description: "Palang Merah Remaja",
        coachId: coach2.id,
        status: ExtracurricularStatus.ACTIVE,
      },
    });
  }

  if (coach3) {
    await prisma.extracurricular.upsert({
      where: { id: "clx123futsal" },
      update: {},
      create: {
        id: "clx123futsal",
        name: "Futsal",
        description: "Klub Futsal Sekolah",
        coachId: coach3.id,
        status: ExtracurricularStatus.ACTIVE,
      },
    });
  }

  // Rooms
  await prisma.room.upsert({
    where: { id: "clx123aula" }, // similarly, fake an id
    update: {},
    create: {
      id: "clx123aula",
      name: "Aula",
      location: "Gedung Utama Lt 2",
      capacity: 200,
    },
  });

  await prisma.room.upsert({
    where: { id: "clx123lapangan" },
    update: {},
    create: {
      id: "clx123lapangan",
      name: "Lapangan",
      location: "Area Outdoor",
      capacity: 500,
    },
  });

  console.log("Seed data created or updated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
