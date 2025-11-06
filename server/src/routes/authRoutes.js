import express from "express";
import { register, login, listUsers, refresh, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/", listUsers);

export default router;
