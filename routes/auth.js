import express from 'express';
import { login, register, elevateUser } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/auth/verifyToken.js';
import { verifyAdmin } from '../utils/auth/verifyClearance.js';

const router = express.Router();

router.post("/register", register)

router.post("/login", login);

router.post("/elevateUser/:id", verifyToken, verifyAdmin, elevateUser);

export default router;