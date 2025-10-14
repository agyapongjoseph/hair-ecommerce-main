// backend/server/routes/ordersRoutes.mjs
import { Router } from "express";
import { getAllOrders, getOrderByReference, getOrderByUserId, placeOrder, updateOrderStatus } from "../controllers/ordersController.mjs";

export const ordersRouter = Router();

ordersRouter.get("/all", getAllOrders);
ordersRouter.patch("/:id", updateOrderStatus);
ordersRouter.get("/user/:userId", getOrderByUserId);
ordersRouter.post("/place-order", placeOrder);
ordersRouter.get("/ref/:clientReference", getOrderByReference);
