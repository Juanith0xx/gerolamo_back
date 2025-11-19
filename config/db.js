import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Usar URI de Atlas desde las variables de entorno
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión a MongoDB Atlas: ${error.message}`);
    process.exit(1); // detener la app si falla la conexión
  }
};

export default connectDB;
