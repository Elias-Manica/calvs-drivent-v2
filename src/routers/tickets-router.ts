import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketsTypes, getTicketsFunction, postTicketsFunction } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter.all("/*", authenticateToken).get("/types", getTicketsTypes).get("/", getTicketsFunction).post("/", postTicketsFunction);

export { ticketsRouter };
