import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import process from "process";
import connectDB from "./config/db.js";
import candidatureRoutes from "./routes/candidatureRoutes.js";

// Configuration des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS plus spécifique
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ], // Ajouter tous les ports sur lesquels votre frontend peut tourner
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Force le mode développement si non défini
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
  console.log("Mode forcé à development");
}

console.log(`Mode d'environnement: ${process.env.NODE_ENV}`);

// Middleware CORS
app.use(cors(corsOptions));
console.log("Middleware CORS configuré");

// Pour les requêtes préliminaires (preflight) OPTIONS
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("Requête OPTIONS reçue");
    res.header("Access-Control-Allow-Origin", corsOptions.origin);
    res.header("Access-Control-Allow-Methods", corsOptions.methods.join(","));
    res.header(
      "Access-Control-Allow-Headers",
      corsOptions.allowedHeaders.join(",")
    );
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à la base de données
connectDB();

// Middleware pour journaliser les requêtes (aide au débogage)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Route de test simple
app.get("/test", (req, res) => {
  console.log("Route /test appelée");
  res.json({ message: "Le serveur fonctionne correctement" });
});

// Routes API - restaurer le préfixe /api qui est attendu par le frontend
app.use("/api/candidatures", candidatureRoutes);
console.log("Route /api/candidatures configurée");

// Ajouter aussi la route sans préfixe /api pour la compatibilité
app.use("/candidatures", candidatureRoutes);
console.log("Route /candidatures configurée");

// Route de base
app.get("/", (req, res) => {
  console.log("Route / appelée");
  res.send("API pour le suivi des candidatures");
});

// En cas de route non trouvée
app.use("*", (req, res) => {
  console.log(`Route non trouvée: ${req.originalUrl}`);
  res.status(404).json({ message: "Route non trouvée" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
  console.log(`API accessible à http://localhost:${PORT}`);
});
