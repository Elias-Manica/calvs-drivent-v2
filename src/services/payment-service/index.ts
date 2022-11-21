import paymentRepository from "@/repositories/payment-repository.ts";
import eventRepository from "@/repositories/event-repository";
import { notFoundError, requestError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";

async function getFirstPayments(ticketId: number, userId: number) {
  if(!ticketId) {
    throw requestError(400, "BAD_REQUEST");
  }
 
  const verifyUser = await eventRepository.findSpecifyTicket(ticketId);

  const enrollment = await enrollmentRepository.getEnrollmentByUserId(verifyUser.enrollmentId);
  
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

  const verifyTicket = await eventRepository.findSpecifyTicket(body.ticketId);

  if(!verifyTicket) {
    throw notFoundError();
  }

  const enrollment = await enrollmentRepository.getEnrollmentByUserId(verifyTicket.enrollmentId);

  if(Number(enrollment.userId) !== Number(userId)) {
    throw unauthorizedError();
  }

  const payment = await paymentRepository.createPaymentPrisma(body.ticketId, body.cardData.issuer, body.cardData.number.substring(body.cardData.number.length - 4), verifyTicket.TicketType.price);
  
  await eventRepository.updateTicket(body.ticketId);

  return payment;
}

const paymentService = {
  getFirstPayments,
  createPayment
};

export default paymentService;
