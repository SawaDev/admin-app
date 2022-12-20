import express from 'express';
import { createSale, dailySales, getSales } from '../controllers/kamarSale.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';
const router = express.Router();

router.post("/", verifyAdmin, createSale);
router.get("/:id", getSales);
router.get("/:id/daily", dailySales)

export default router;