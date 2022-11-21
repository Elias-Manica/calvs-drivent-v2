import paymentRepository from "@/repositories/payment-repository.ts";
import eventRepository from "@/repositories/event-repository";
import { notFoundError, requestError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";

async function getFirstPayments(ticketId: number, userId: number) {
  if(!ticketId) {
    throw requestError(400, "BAD_REQUEST");
  }
 
  const verifyUser = await eventRepository.findSpecifyTicket(ticketId);
  console.log(verifyUser, " verify");

  const enrollment = await enrollmentRepository.getEnrollmentByUserId(verifyUser.enrollmentId);
  console.log(enrollment, " enrollment");

  console.log(userId, " userid");
  
  if(Number(enrollment.userId) !== Number(userId)) {
    console.log("entrei");
    throw unauthorizedError();
  }

  const payment = await paymentRepository.findFirst(ticketId);
  
  if(!payment) {
    throw notFoundError();
  }
  console.log(payment, " payment");
  
  return payment;
}

const paymentService = {
  getFirstPayments
};

export default paymentService;
