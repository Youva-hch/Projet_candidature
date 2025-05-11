import mongoose from "mongoose";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

// Configuration de la connexion à MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/candidatures", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
