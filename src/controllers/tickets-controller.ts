import { AuthenticatedRequest } from "@/middlewares";
import ticketService from "@/services/tickets-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getTicketsTypes(req: Request, res: Response) {
  try {
    const ticket = await ticketService.getTypesTickets();
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getTicketsFunction(req: Request, res: Response) {
  try {
    const ticket = await ticketService.getTickets();
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function postTicketsFunction(req: AuthenticatedRequest, res: Response) {
  const ticketTypeId: number = req.body.ticketTypeId;
  const userId: number = req.userId;
  
  try {
    const ticket = await ticketService.createTicket(ticketTypeId, userId);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    if(error.name === "RequestError") {
      return res.status(httpStatus.BAD_REQUEST).send({});
    }
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
