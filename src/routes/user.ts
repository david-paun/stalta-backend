import express from 'express';
import { getAllUsers, getById } from '../controllers/user.controller.js';
//import { verifyAdmin, verifyToken, verifyUser } from '../utils/tokens/verifyToken.js';
import { verifyToken } from '../utils/auth/verifyToken.js';
import { verifyAdmin, verifyUser } from '../utils/auth/verifyClearance.js';

const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllUsers);

router.get('/:id', verifyToken, verifyUser, getById);

export default router;
