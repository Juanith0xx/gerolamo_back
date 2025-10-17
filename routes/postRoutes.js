import express from "express";
import { getPendingPosts, approvePost, rejectPost } from "../controllers/postController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Obtener posts pendientes
router.get("/pending", verifyToken, verifyAdmin, getPendingPosts);

// Aprobar post
router.patch("/approve/:id", verifyToken, verifyAdmin, approvePost);

// Rechazar post
router.delete("/reject/:id", verifyToken, verifyAdmin, rejectPost);

export default router;
