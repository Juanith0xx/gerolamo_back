import dotenv from "dotenv";
dotenv.config(); // Asegura que las variables de entorno estén disponibles

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registro
export const register = async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "Usuario ya registrado" });

        const userRole = rol || "veterinario";

        const newUser = new User({ nombre, email, password, rol: userRole });
        await newUser.save();

        res.status(201).json({ 
            msg: "Usuario registrado correctamente", 
            user: { id: newUser._id, nombre, email, rol: userRole } 
        });
    } catch (error) {
        console.error("❌ Error register:", error);
        res.status(500).json({ msg: "Error del servidor", error: error.message });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

        // Validación defensiva
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET no está definido en el entorno");
        }

        const token = jwt.sign(
            { id: user._id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ 
            token, 
            user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol } 
        });
    } catch (error) {
        console.error("❌ Error login:", error);
        res.status(500).json({ msg: "Error del servidor", error: error.message });
    }
};
