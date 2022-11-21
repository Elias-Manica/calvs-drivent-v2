import { notFoundError, requestError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event, TicketStatus } from "@prisma/client";
import dayjs from "dayjs";

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const event = await eventRepository.findFirst();
  if (!event) throw notFoundError();

  return exclude(event, "createdAt", "updatedAt");
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

async function getTypesTickets() {
  const types = await eventRepository.findTypes();
  return types;
}

async function getTickets() {
  const ticket = await eventRepository.findTickets();
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

  const response = await eventRepository.postTicket(ticketTypeId, enrollmentId.id, TicketStatus.RESERVED);

  const returnResponse = await eventRepository.findSpecifyTicket(response.id);
  
  return returnResponse;
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
  getTypesTickets,
  getTickets,
  createTicket
};

export default eventsService;
