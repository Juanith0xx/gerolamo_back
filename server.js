import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// Conectar a MongoDB
connectDB();

// Crear admin por defecto
const createDefaultAdmin = async () => {
    try {
        const adminEmail = "admin@gerolamo.com"; // correo del admin
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) return; // ya existe, no hacer nada

        const password = "admin123"; // contraseña por defecto
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = new User({
            nombre: "Admin Gerolamo",
            email: adminEmail,
            password: hashedPassword,
            rol: "admin",
        });

        await adminUser.save();
        console.log("✅ Admin por defecto creado: ", adminEmail, "contraseña:", password);
    } catch (error) {
        console.log("❌ Error creando admin por defecto:", error);
    }
};

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

// Iniciar servidor después de crear admin
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    await createDefaultAdmin();
});
