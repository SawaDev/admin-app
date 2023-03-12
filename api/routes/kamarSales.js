import express from 'express';
import { createSale, dailySales, getSales } from '../controllers/kamarSale.js';
import {  verifyToken } from '../utils/verifyToken.js';
const router = express.Router();

router.post("/", verifyToken, createSale);
router.get("/:id", getSales);
router.get("/:id/daily", dailySales)

export default router;