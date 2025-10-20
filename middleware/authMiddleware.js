import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

// Middleware para verificar token
export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "Acceso denegado" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // id y rol del usuario
        next();
    } catch (error) {
        res.status(400).json({ msg: "Token inválido" });
    }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ msg: "Acceso denegado: solo admin" });
  }
  next();
};
