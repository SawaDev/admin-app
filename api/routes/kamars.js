import express from 'express';
import { createKamar, updateKamar, deleteKamar, getKamar, getKamars, getWarehouse, getIncome, getPie, getMonthlyStats, test } from '../controllers/kamar.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';
const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createKamar);

//UPDATE
router.put("/:id", verifyAdmin, updateKamar);

//DELETE
router.delete("/:id", verifyAdmin, deleteKamar);

//GET
router.get("/find/:id", getKamar);

//GET ALL
router.get("/", getKamars);

//GET STATS ABOUT WAREHOUSE
router.get("/warehouse", getWarehouse);

//LAST MONTH INCOME
router.get("/income", getIncome);

//PIE CHART 
router.get("/piedata", getPie);

//GET MONTHLY STATS
router.get("/monthlyStats", getMonthlyStats);

router.get("/test", test)

export default router;