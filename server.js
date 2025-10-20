import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

// 📦 Conectar a MongoDB
connectDB();

// 👤 Crear admin por defecto
const createDefaultAdmin = async () => {
  try {
    const adminEmail = "admin@gerolamo.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) return;

    const password = "admin123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUser = new User({
      nombre: "Admin Gerolamo",
      email: adminEmail,
      password: hashedPassword,
      rol: "admin",
    });

    await adminUser.save();
    console.log(`✅ Admin por defecto creado: ${adminEmail} (pass: ${password})`);
  } catch (error) {
    console.error("❌ Error creando admin por defecto:", error);
  }
};

const app = express();

// 🌐 Configuración CORS mejorada
app.use(
  cors({
    origin: ["http://localhost:5173"], // URL del frontend
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // 🔐 permite cookies/tokens si los usas
  })
);

// 📩 Middleware
app.use(express.json());

// 🛣️ Rutas
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// ✅ Ruta base (opcional)
app.get("/", (req, res) => {
  res.json({ message: "🚀 API de Gerolamo funcionando correctamente" });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  await createDefaultAdmin();
});
