import { prisma } from "@/config";

async function findFirst() {
  return prisma.event.findFirst();
}

async function findTypes() {
  return prisma.ticketType.findMany();
}

const eventRepository = {
  findFirst, findTypes
};

export default eventRepository;
