import process from "process";
import Candidature from "../models/Candidature.js";

// Données simulées pour le mode dégradé (si MongoDB n'est pas disponible)
let candidaturesSimulees = [
  {
    _id: "1",
    entreprise: "Google",
    poste: "Développeur Frontend React",
    lienOffre: "https://google.com/careers",
    dateEnvoi: new Date("2023-05-01"),
    statut: "En attente",
    dateRelance: null,
    derniereMAJ: new Date("2023-05-01"),
    createdAt: new Date("2023-05-01"),
    updatedAt: new Date("2023-05-01"),
  },
  {
    _id: "2",
    entreprise: "Microsoft",
    poste: "Développeur Fullstack",
    lienOffre: "https://microsoft.com/careers",
    dateEnvoi: new Date("2023-05-05"),
    statut: "Acceptée",
    dateRelance: new Date("2023-05-10"),
    derniereMAJ: new Date("2023-05-15"),
    createdAt: new Date("2023-05-05"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    _id: "3",
    entreprise: "Amazon",
    poste: "Ingénieur DevOps",
    lienOffre: "https://amazon.com/careers",
    dateEnvoi: new Date("2023-04-15"),
    statut: "Refusée",
    dateRelance: new Date("2023-04-25"),
    derniereMAJ: new Date("2023-05-02"),
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-05-02"),
  },
];

// Variable pour suivre si MongoDB est disponible
let isMongoDBConnected = true;

// Fonction pour vérifier si une candidature doit être relancée (pour le mode dégradé)
const estARelancer = (candidature) => {
  if (candidature.statut !== "En attente") return false;

  const derniereMiseAJour = candidature.derniereMAJ || candidature.dateEnvoi;
  const aujourdhui = new Date();
  const differenceJours = Math.floor(
    (aujourdhui - derniereMiseAJour) / (1000 * 60 * 60 * 24)
  );

  return differenceJours >= 7;
};

// Récupérer toutes les candidatures
export const getCandidatures = async (req, res) => {
  console.log("GET /candidatures appelé");

  try {
    // En développement, simuler les données mêmes si MongoDB est disponible
    // Cela permet de tester l'interface sans configurer de base de données
    if (process.env.NODE_ENV !== "production") {
      console.log("Mode développement : utilisation des données simulées");

      // Filtrage des données simulées
      let filteredCandidatures = [...candidaturesSimulees];

      if (req.query.entreprise) {
        const regex = new RegExp(req.query.entreprise, "i");
        filteredCandidatures = filteredCandidatures.filter((c) =>
          c.entreprise.match(regex)
        );
      }

      if (req.query.statut) {
        filteredCandidatures = filteredCandidatures.filter(
          (c) => c.statut === req.query.statut
        );
      }

      const candidaturesAvecRelance = filteredCandidatures.map(
        (candidature) => ({
          ...candidature,
          aRelancer: estARelancer(candidature),
        })
      );

      return res.json(candidaturesAvecRelance);
    }

    // Si on est en production, utiliser MongoDB
    if (!isMongoDBConnected) throw new Error("MongoDB non disponible");

    // Gestion des filtres par entreprise et statut
    const filters = {};

    if (req.query.entreprise) {
      filters.entreprise = { $regex: req.query.entreprise, $options: "i" };
    }

    if (req.query.statut) {
      filters.statut = req.query.statut;
    }

    const candidatures = await Candidature.find(filters);

    // Ajouter un indicateur pour les candidatures à relancer
    const candidaturesAvecRelance = candidatures.map((candidature) => {
      const doc = candidature.toObject();
      doc.aRelancer = candidature.estARelancer();
      return doc;
    });

    res.json(candidaturesAvecRelance);
  } catch (error) {
    console.error("Fallback vers données simulées:", error.message);
    isMongoDBConnected = false;

    // Mode dégradé: utiliser les données simulées
    let filteredCandidatures = [...candidaturesSimulees];

    if (req.query.entreprise) {
      const regex = new RegExp(req.query.entreprise, "i");
      filteredCandidatures = filteredCandidatures.filter((c) =>
        c.entreprise.match(regex)
      );
    }

    if (req.query.statut) {
      filteredCandidatures = filteredCandidatures.filter(
        (c) => c.statut === req.query.statut
      );
    }

    const candidaturesAvecRelance = filteredCandidatures.map((candidature) => ({
      ...candidature,
      aRelancer: estARelancer(candidature),
    }));

    res.json(candidaturesAvecRelance);
  }
};

// Récupérer une candidature par ID
export const getCandidatureById = async (req, res) => {
  try {
    if (!isMongoDBConnected) throw new Error("MongoDB non disponible");

    const candidature = await Candidature.findById(req.params.id);

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    const candidatureObj = candidature.toObject();
    candidatureObj.aRelancer = candidature.estARelancer();

    res.json(candidatureObj);
  } catch (error) {
    console.error("Fallback vers données simulées:", error.message);
    isMongoDBConnected = false;

    // Mode dégradé: utiliser les données simulées
    const candidature = candidaturesSimulees.find(
      (c) => c._id === req.params.id
    );

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    const candidatureAvecRelance = {
      ...candidature,
      aRelancer: estARelancer(candidature),
    };

    res.json(candidatureAvecRelance);
  }
};

// Créer une nouvelle candidature
export const createCandidature = async (req, res) => {
  try {
    if (!isMongoDBConnected) throw new Error("MongoDB non disponible");

    const nouvelleCandidature = new Candidature(req.body);
    const candidatureSaved = await nouvelleCandidature.save();
    res.status(201).json(candidatureSaved);
  } catch (error) {
    console.error("Fallback vers données simulées:", error.message);
    isMongoDBConnected = false;

    // Mode dégradé: utiliser les données simulées
    const nouvelleCandidature = {
      _id: (candidaturesSimulees.length + 1).toString(),
      ...req.body,
      dateEnvoi: new Date(req.body.dateEnvoi || Date.now()),
      dateRelance: req.body.dateRelance ? new Date(req.body.dateRelance) : null,
      statut: req.body.statut || "En attente",
      derniereMAJ: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    candidaturesSimulees.push(nouvelleCandidature);
    res.status(201).json(nouvelleCandidature);
  }
};

// Mettre à jour une candidature
export const updateCandidature = async (req, res) => {
  try {
    if (!isMongoDBConnected) throw new Error("MongoDB non disponible");

    // Mettre à jour la date de dernière modification
    req.body.derniereMAJ = new Date();

    const candidatureUpdated = await Candidature.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Retourner le document mis à jour
    );

    if (!candidatureUpdated) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.json(candidatureUpdated);
  } catch (error) {
    console.error("Fallback vers données simulées:", error.message);
    isMongoDBConnected = false;

    // Mode dégradé: utiliser les données simulées
    const index = candidaturesSimulees.findIndex(
      (c) => c._id === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    const updatedCandidature = {
      ...candidaturesSimulees[index],
      ...req.body,
      dateEnvoi: req.body.dateEnvoi
        ? new Date(req.body.dateEnvoi)
        : candidaturesSimulees[index].dateEnvoi,
      dateRelance: req.body.dateRelance
        ? new Date(req.body.dateRelance)
        : candidaturesSimulees[index].dateRelance,
      derniereMAJ: new Date(),
      updatedAt: new Date(),
    };

    candidaturesSimulees[index] = updatedCandidature;

    res.json(updatedCandidature);
  }
};

// Supprimer une candidature
export const deleteCandidature = async (req, res) => {
  try {
    if (!isMongoDBConnected) throw new Error("MongoDB non disponible");

    const candidatureDeleted = await Candidature.findByIdAndDelete(
      req.params.id
    );

    if (!candidatureDeleted) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.json({ message: "Candidature supprimée avec succès" });
  } catch (error) {
    console.error("Fallback vers données simulées:", error.message);
    isMongoDBConnected = false;

    // Mode dégradé: utiliser les données simulées
    const index = candidaturesSimulees.findIndex(
      (c) => c._id === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    candidaturesSimulees.splice(index, 1);

    res.json({ message: "Candidature supprimée avec succès" });
  }
};

// Récupérer les statistiques des candidatures
export const getStatistiques = async (req, res) => {
  console.log("GET /candidatures/stats appelé");

  try {
    // En développement, retourner des statistiques fictives
    if (process.env.NODE_ENV !== "production") {
      console.log("Mode développement : utilisation des statistiques simulées");
      return res.json({
        total: candidaturesSimulees.length,
        enAttente: candidaturesSimulees.filter((c) => c.statut === "En attente")
          .length,
        acceptees: candidaturesSimulees.filter((c) => c.statut === "Acceptée")
          .length,
        refusees: candidaturesSimulees.filter((c) => c.statut === "Refusée")
          .length,
        aRelancer: candidaturesSimulees.filter((c) => estARelancer(c)).length,
      });
    }

    // En production, utiliser MongoDB
    if (!isMongoDBConnected) throw new Error("MongoDB non disponible");

    // Suppose que getStats est une méthode statique sur le modèle Candidature
    const stats = await Candidature.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Fallback vers statistiques simulées:", error.message);
    isMongoDBConnected = false;

    // Mode dégradé: utiliser des statistiques calculées à partir des données simulées
    const stats = {
      total: candidaturesSimulees.length,
      enAttente: candidaturesSimulees.filter((c) => c.statut === "En attente")
        .length,
      acceptees: candidaturesSimulees.filter((c) => c.statut === "Acceptée")
        .length,
      refusees: candidaturesSimulees.filter((c) => c.statut === "Refusée")
        .length,
      aRelancer: candidaturesSimulees.filter((c) => estARelancer(c)).length,
    };

    res.json(stats);
  }
};
