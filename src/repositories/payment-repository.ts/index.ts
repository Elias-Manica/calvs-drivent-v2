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

async function createPaymentPrisma(ticketId: number, cardIssur: string, cardLastDigits: string, value: number) {
  return prisma.payment.create({
    data: {
      ticketId: ticketId,
      cardIssuer: cardIssur,
      cardLastDigits: cardLastDigits,
      value: value
    },
  });
}

const paymentRepository = {
  findFirst, findWithEnrollmentId, createPaymentPrisma
};

export default paymentRepository;
