import express from 'express';
import { login, register, elevateUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register", register)

router.post("/login", login);

router.post("/elevateUser/:id", elevateUser);

export default router;