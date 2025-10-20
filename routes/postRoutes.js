import express from "express";
import {
  getPendingPosts,
  approvePost,
  rejectPost,
  createPost,
  getApprovedPosts,
  updatePost,
  deletePost
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Crear post (público)
router.post("/create", createPost);

// Admin obtiene posts pendientes
router.get("/pending", verifyToken, getPendingPosts);

// Admin aprueba o rechaza
router.patch("/approve/:id", verifyToken, approvePost);
router.delete("/reject/:id", verifyToken, rejectPost);

// Obtener posts aprobados (público)
router.get("/approved", getApprovedPosts);

// Admin actualiza o elimina posts
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
