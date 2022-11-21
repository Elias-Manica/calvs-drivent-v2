import { notFoundError, requestError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";

async function getTypesTickets() {
  const types = await ticketRepository.findTypes();
  return types;
}

async function getTickets() {
  const ticket = await ticketRepository.findTickets();
  if(!ticket) {
    throw notFoundError();
  }
  return ticket;
}

async function createTicket(ticketTypeId: number, userId: number) {
  if(!ticketTypeId) {
    throw requestError(400, "BAD_REQUEST");
  }
  const enrollmentId = await enrollmentRepository.getEnrollmentByUser(userId);

  const response = await ticketRepository.postTicket(ticketTypeId, enrollmentId.id, TicketStatus.RESERVED);

  const returnResponse = await ticketRepository.findSpecifyTicket(response.id);
  
  return returnResponse;
}

const ticketService = {
  getTypesTickets,
  getTickets,
  createTicket
};

export default ticketService;
