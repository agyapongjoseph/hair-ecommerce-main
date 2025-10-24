import { Router } from "express";
import { uploadProducts } from "../controllers/adminUploadProductsController.mjs";

export const adminRoutes = Router();

adminRoutes.post("/upload-products", uploadProducts);
