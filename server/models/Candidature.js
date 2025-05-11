import mongoose from "mongoose";

// Définition du schéma pour les candidatures
const candidatureSchema = new mongoose.Schema(
  {
    entreprise: {
      type: String,
      required: true,
      trim: true,
    },
    poste: {
      type: String,
      required: true,
      trim: true,
    },
    lienOffre: {
      type: String,
      trim: true,
    },
    dateEnvoi: {
      type: Date,
      default: Date.now,
    },
    statut: {
      type: String,
      enum: ["En attente", "Acceptée", "Refusée"],
      default: "En attente",
    },
    dateRelance: {
      type: Date,
      default: null,
    },
    derniereMAJ: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

// Méthode pour vérifier si une relance est nécessaire (pas de mise à jour depuis 7 jours)
candidatureSchema.methods.estARelancer = function () {
  if (this.statut !== "En attente") return false;

  const derniereMiseAJour = this.derniereMAJ || this.dateEnvoi;
  const aujourdhui = new Date();
  const differenceJours = Math.floor(
    (aujourdhui - derniereMiseAJour) / (1000 * 60 * 60 * 24)
  );

  return differenceJours >= 7;
};

// Méthode statique pour récupérer les statistiques
candidatureSchema.statics.getStats = async function () {
  // Nombre total de candidatures
  const total = await this.countDocuments();

  // Nombre par statut
  const enAttente = await this.countDocuments({
    statut: "En attente",
  });
  const acceptees = await this.countDocuments({ statut: "Acceptée" });
  const refusees = await this.countDocuments({ statut: "Refusée" });

  // Candidatures à relancer (non mises à jour depuis 7 jours)
  const dateLimiteRelance = new Date();
  dateLimiteRelance.setDate(dateLimiteRelance.getDate() - 7);

  const aRelancer = await this.countDocuments({
    statut: "En attente",
    derniereMAJ: { $lt: dateLimiteRelance },
  });

  return {
    total,
    enAttente,
    acceptees,
    refusees,
    aRelancer,
  };
};

// Créer le modèle à partir du schéma
const Candidature = mongoose.model("Candidature", candidatureSchema);

export default Candidature;
