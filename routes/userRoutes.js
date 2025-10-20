import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser // ← esta línea es clave
} from "../controllers/userController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser); // ← esta línea causaba el error

export default router;
