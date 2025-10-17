import User from "../models/User.js";

// Obtener todos los usuarios (solo admin)
export const getUsers = async (req, res) => {
    try {
        if (req.user.rol !== "admin") {
            return res.status(403).json({ msg: "Acceso denegado: solo admin" });
        }

        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error getUsers:", error);
        res.status(500).json({ msg: "Error del servidor", error: error.message });
    }
};

// Obtener usuario por ID (admin o el mismo usuario)
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.rol !== "admin" && req.user.id !== id) {
            return res.status(403).json({ msg: "Acceso denegado" });
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("❌ Error getUserById:", error);
        res.status(500).json({ msg: "Error del servidor", error: error.message });
    }
};

// Actualizar usuario (admin o el mismo usuario)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.rol !== "admin" && req.user.id !== id) {
            return res.status(403).json({ msg: "Acceso denegado" });
        }

        const updates = req.body;
        delete updates.password; // evitar cambios de contraseña por esta vía

        const updatedUser = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
            projection: { password: 0 }
        });

        if (!updatedUser) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.status(200).json({ msg: "Usuario actualizado", user: updatedUser });
    } catch (error) {
        console.error("❌ Error updateUser:", error);
        res.status(500).json({ msg: "Error del servidor", error: error.message });
    }
};

// Eliminar usuario (solo admin)
export const deleteUser = async (req, res) => {
    try {
        if (req.user.rol !== "admin") {
            return res.status(403).json({ msg: "Acceso denegado: solo admin" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error deleteUser:", error);
        res.status(500).json({ msg: "Error del servidor", error: error.message });
    }
};
