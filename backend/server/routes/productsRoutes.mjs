import { Router } from "express";
import { getAllProducts } from "../controllers/productsController.mjs";

export const productRoutes = Router();

productRoutes.get("/all", getAllProducts);