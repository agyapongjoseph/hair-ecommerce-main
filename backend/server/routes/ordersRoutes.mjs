// backend/server/routes/ordersRoutes.mjs
import { Router } from "express";
import { getAllOrders, getOrderByReference, getOrderByUserId, placeOrder, updateOrderStatus,getOrderById } from "../controllers/ordersController.mjs";

export const ordersRouter = Router();

ordersRouter.get("/all", getAllOrders);
ordersRouter.patch("/admin/:id/status", updateOrderStatus);
ordersRouter.get("/user/:userId", getOrderByUserId);
ordersRouter.post("/place-order", placeOrder);
ordersRouter.get("/ref/:clientReference", getOrderByReference);
ordersRouter.get("/:id", getOrderById);