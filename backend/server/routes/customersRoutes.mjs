import { Router } from "express";
import { getAllCustomers } from "../controllers/customersController.mjs";

export const customersRoutes = Router();

customersRoutes.get("/all", getAllCustomers);