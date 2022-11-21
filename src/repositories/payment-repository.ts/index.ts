import { prisma } from "@/config";

async function findFirst(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    }
  });
}

async function findWithEnrollmentId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
    include: {
      Ticket: true
    }
  });
}

const paymentRepository = {
  findFirst, findWithEnrollmentId
};

export default paymentRepository;
