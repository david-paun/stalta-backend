import express, { Request, Response, NextFunction, Router } from 'express';
import {createClearanceLevel, deleteClearanceLevel, getClearanceLevels, updateClearanceLevel} from "../controllers/clearanceLevel.controller.js";

const router = express.Router();

router.post("/create", createClearanceLevel);

router.put("/update/:id", updateClearanceLevel);

router.get("/read", getClearanceLevels);

router.delete("/delete/:id", deleteClearanceLevel);

export default router;