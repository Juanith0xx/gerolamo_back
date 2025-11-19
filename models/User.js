import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefono: { type: String, required: false },
  rol: { type: String, enum: ["veterinario", "admin"], default: "veterinario" },
  resetToken: { type: String },
}, { timestamps: true });

// Encriptar contraseña antes de guardar
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);
