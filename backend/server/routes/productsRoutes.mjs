// backend/server/routes/productsRoutes.mjs
import { Router } from "express";
import { getAllProducts } from "../controllers/productsController.mjs";
import { uploadProducts } from "../controllers/adminUploadProductsController.mjs";

export const productRoutes = Router();

productRoutes.get("/all", getAllProducts);
productRoutes.post("/upload", uploadProducts); // ✅ add this line
