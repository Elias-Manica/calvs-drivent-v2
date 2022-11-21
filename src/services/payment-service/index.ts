import paymentRepository from "@/repositories/payment-repository.ts";
import { notFoundError, requestError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/tickets-repository";

async function getFirstPayments(ticketId: number, userId: number) {
  if(!ticketId) {
    throw requestError(400, "BAD_REQUEST");
  }
 
  const verifyUser = await ticketRepository.findSpecifyTicket(ticketId);

  const enrollment = await enrollmentRepository.getEnrollmentByEnrollmentId(verifyUser.enrollmentId);
  
  if(Number(enrollment.userId) !== Number(userId)) {
    throw unauthorizedError();
  }

  const payment = await paymentRepository.findFirst(ticketId);
  
  if(!payment) {
    throw notFoundError();
  }
  
  return payment;
}

export type bodyPayment = {
  ticketId: number,
	cardData: {
		issuer: string,
    number: string,
    name: string,
    expirationDate: Date,
    cvv: number
	}
};

async function createPayment(body: bodyPayment, userId: number) {
  if(!body.cardData) {
    throw requestError(400, "BAD_REQUEST");
  }
  
  if(!body.ticketId) {
    throw requestError(400, "BAD_REQUEST");
  }

  const verifyTicket = await ticketRepository.findSpecifyTicket(body.ticketId);

  if(!verifyTicket) {
    throw notFoundError();
  }

  const enrollment = await enrollmentRepository.getEnrollmentByEnrollmentId(verifyTicket.enrollmentId);

  if(Number(enrollment.userId) !== Number(userId)) {
    throw unauthorizedError();
  }

  const payment = await paymentRepository.createPaymentPrisma(body.ticketId, body.cardData.issuer, body.cardData.number.substring(body.cardData.number.length - 4), verifyTicket.TicketType.price);
  
  await ticketRepository.updateTicket(body.ticketId);

  return payment;
}

const paymentService = {
  getFirstPayments,
  createPayment
};

export default paymentService;
