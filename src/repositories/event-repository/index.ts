import { prisma } from "@/config";
import { Ticket, TicketStatus } from "@prisma/client";

async function findFirst() {
  return prisma.event.findFirst();
}

async function findTypes() {
  return prisma.ticketType.findMany();
}

async function findSpecifyTicket(idTicket: number) {
  return prisma.ticket.findFirst({
    where: {
      id: idTicket 
    },
    include: {
      TicketType: true
    }
  });
}

async function findTickets() {
  return prisma.ticket.findFirst({
    include: {
      TicketType: true
    },
  });
}

export type TicketType = Omit<Ticket, "id" |  "createdAt" | "updatedAt"  >;

async function postTicket(ticketTypeId: number, enrollmentId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status,
    }
  });
}

async function updateTicket(idTicket: number) {
  return prisma.ticket.update({
    where: {
      id: idTicket
    },
    data: {
      status: TicketStatus.PAID
    }
  });
}

const eventRepository = {
  findFirst, findTypes, findTickets, postTicket, findSpecifyTicket, updateTicket
};

export default eventRepository;
