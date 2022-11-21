import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

async function getEnrollmentByEnrollmentId(enrrollmentId: number) {
  return prisma.enrollment.findFirst({
    where: {
      id: enrrollmentId
    },
  });
}

async function getEnrollmentByUser(userId: number) {
  return prisma.enrollment.findFirst({
    where: {
      userId: userId
    },
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, "userId">;

const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
  getEnrollmentByEnrollmentId,
  getEnrollmentByUser
};

export default enrollmentRepository;
