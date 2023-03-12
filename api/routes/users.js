import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.js";
import {  verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", verifyToken, updateUser);

//DELETE
router.delete("/:id", verifyToken, deleteUser);

//GET
router.get("/find/:id", getUser);

//GET ALL
router.get("/", getUsers);

export default router;
