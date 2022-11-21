import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPayment } from "@/controllers/payment-controller";

const paymentRouter = Router();

paymentRouter.all("/*", authenticateToken).get("/", getPayment);

export { paymentRouter };
