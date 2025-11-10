import express from "express";
import { listar, obter, criar } from "../controllers/produtosController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", listar);
router.get("/:id", obter);
router.post("/", authMiddleware, criar);

export default router;
