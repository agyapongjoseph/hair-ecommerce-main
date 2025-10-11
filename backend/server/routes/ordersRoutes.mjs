import { Router } from "express";
import { getAllOrders, updateOrderStatus } from "../controllers/ordersController.mjs";

export const ordersRouter = Router();

ordersRouter.get("/all", getAllOrders);
ordersRouter.patch("/:id", updateOrderStatus);