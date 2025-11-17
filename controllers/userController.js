// backend/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetch from "node-fetch"; // Para validar Turnstile

const JWT_SECRET = process.env.JWT_SECRET || "mi_secreto";

// =======================
// REGISTRO DE USUARIO
// =======================
export const registerUser = async (req, res) => {
  try {
    const { nombre, email, password, telefono, captchaToken } = req.body;

    // Validación del captcha Turnstile
    const turnstileSecret = process.env.TURNSTILE_SECRET || "TU_SECRET_KEY";
    const verifyCaptcha = await fetch(
      `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${turnstileSecret}&response=${captchaToken}`,
      }
    ).then((r) => r.json());

    if (!verifyCaptcha.success) {
      return res.status(400).json({ msg: "Captcha inválido" });
    }

    // Validación del teléfono
    const regexTelefono = /^\+569\d{8}$/;
    if (!regexTelefono.test(telefono)) {
      return res.status(400).json({
        msg: "Formato de teléfono inválido. Debe ser +569XXXXXXXX",
      });
    }

    // Validación de email único
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    const user = new User({ nombre, email, password, telefono });
    await user.save();

    res.status(201).json({ msg: "Usuario creado correctamente" });
  } catch (error) {
    console.error("❌ Error registerUser:", error);
    res.status(500).json({ msg: "Error del servidor", error: error.message });
  }
};

// =======================
// LOGIN DE USUARIO
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    // Validación del captcha Turnstile
    const turnstileSecret = process.env.TURNSTILE_SECRET || "TU_SECRET_KEY";
    const verifyCaptcha = await fetch(
      `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${turnstileSecret}&response=${captchaToken}`,
      }
    ).then((r) => r.json());

    if (!verifyCaptcha.success) {
      return res.status(400).json({ msg: "Captcha inválido" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id, rol: user.rol }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ 
      token, 
      user: { 
        id: user._id, 
        nombre: user.nombre, 
        email: user.email, 
        rol: user.rol, 
        telefono: user.telefono,
        createdAt: user.createdAt
      } 
    });
  } catch (error) {
    console.error("❌ Error loginUser:", error);
    res.status(500).json({ msg: "Error del servidor", error: error.message });
  }
};

// =======================
// OBTENER TODOS LOS USUARIOS (solo admin)
// =======================
export const getUsers = async (req, res) => {
  try {
    if (!req.user || req.user.rol !== "admin") {
      return res.status(403).json({ msg: "Acceso denegado: solo admin" });
    }

    const users = await User.find().select("nombre email telefono rol createdAt");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error getUsers:", error);
    res.status(500).json({ msg: "Error del servidor", error: error.message });
  }
};

// =======================
// OBTENER USUARIO POR ID (admin o mismo usuario)
// =======================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.rol !== "admin" && req.user.id !== id) {
      return res.status(403).json({ msg: "Acceso denegado" });
    }

    const user = await User.findById(id).select("nombre email telefono rol createdAt");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error getUserById:", error);
    res.status(500).json({ msg: "Error del servidor", error: error.message });
  }
};

// =======================
// ACTUALIZAR USUARIO (admin o mismo usuario)
// =======================
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.rol !== "admin" && req.user.id !== id) {
      return res.status(403).json({ msg: "Acceso denegado" });
    }

    const updates = req.body;
    delete updates.password; // evitar cambios de contraseña por esta vía

    // Validación del teléfono si se envía
    if (updates.telefono) {
      const regexTelefono = /^\+569\d{8}$/;
      if (!regexTelefono.test(updates.telefono)) {
        return res.status(400).json({
          msg: "Formato de teléfono inválido. Debe ser +569XXXXXXXX",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      projection: { password: 0 },
    });

    if (!updatedUser) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.status(200).json({ msg: "Usuario actualizado", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updateUser:", error);
    res.status(500).json({ msg: "Error del servidor", error: error.message });
  }
};

// =======================
// ELIMINAR USUARIO (solo admin)
// =======================
export const deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.rol !== "admin") {
      return res.status(403).json({ msg: "Acceso denegado: solo admin" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error deleteUser:", error);
    res.status(500).json({ msg: "Error del servidor", error: error.message });
  }
};
