import { Router } from "express";
import { ordersRouter } from "./routes/ordersRoutes.mjs";
import { productRoutes } from "./routes/productsRoutes.mjs";
import { getAllCustomers } from "./controllers/customersController.mjs";

const allRoutes = Router();

allRoutes.use("/api/orders", ordersRouter)
allRoutes.use("/api/products", productRoutes)
allRoutes.use("/api/customers", getAllCustomers)
export default allRoutes;