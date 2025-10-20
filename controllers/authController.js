import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Registro de usuario
export const register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Usuario ya registrado" });

    const userRole = rol || "veterinario";

    const newUser = new User({ nombre, email, password, rol: userRole });
    await newUser.save();

    return res.status(201).json({
      msg: "Usuario registrado correctamente",
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error en register:", error);
    return res
      .status(500)
      .json({ msg: "Error del servidor", error: error.message });
  }
};

// ✅ Login de usuario
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar usuario
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Usuario no encontrado" });

    // Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Contraseña incorrecta" });

    // Validar existencia de JWT_SECRET
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definido en el entorno");
    }

    // Generar token
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Devolver estructura esperada por el frontend
    return res.status(200).json({
      msg: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res
      .status(500)
      .json({ msg: "Error del servidor", error: error.message });
  }
};
