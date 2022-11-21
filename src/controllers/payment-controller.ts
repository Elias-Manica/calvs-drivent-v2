import { AuthenticatedRequest } from "@/middlewares";
import paymentService from "@/services/payment-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId);
  const userId: number = req.userId;

  try {
    const event = await paymentService.getFirstPayments(ticketId, userId);
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    if(error.name === "RequestError") {
      return res.status(httpStatus.BAD_REQUEST).send({});
    }
    if(error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send({});
    }
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

