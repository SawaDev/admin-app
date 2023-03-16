import express from 'express';
import { createSale, dailySales, getSales, newCollection } from '../controllers/kamarSale.js';
import { verifyToken } from '../utils/verifyToken.js';
const router = express.Router();

router.post("/", verifyToken, createSale);
router.post("/newCollection", verifyToken, newCollection);
router.get("/:id", getSales);
router.get("/:id/daily", dailySales)

export default router;