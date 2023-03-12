import express from 'express';
import { getCustomer, getCustomers } from '../controllers/customer.js';

const router = express.Router();

router.get("/", getCustomers);
router.get("/find/:id", getCustomer)

export default router;