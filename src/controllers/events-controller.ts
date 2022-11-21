import { AuthenticatedRequest } from "@/middlewares";
import eventsService from "@/services/events-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getDefaultEvent(_req: Request, res: Response) {
  try {
    const event = await eventsService.getFirstEvent();
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getTicketsTypes(req: Request, res: Response) {
  try {
    const ticket = await eventsService.getTypesTickets();
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getTicketsFunction(req: Request, res: Response) {
  try {
    const ticket = await eventsService.getTickets();
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function postTicketsFunction(req: AuthenticatedRequest, res: Response) {
  const ticketTypeId: number = req.body.ticketTypeId;
  const userId: number = req.userId;
  
  try {
    const ticket = await eventsService.createTicket(ticketTypeId, userId);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    if(error.name === "RequestError") {
      return res.status(httpStatus.BAD_REQUEST).send({});
    }
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
