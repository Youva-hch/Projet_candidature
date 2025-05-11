import axios from "axios";

// Configuration simplifiée d'Axios avec proxy Vite
const axiosInstance = axios.create({
  baseURL: "/api", // Le préfixe /api sera conservé et rediriger par Vite vers le serveur
  headers: {
    "Content-Type": "application/json",
  },
  // witCredentials: true peut causer des problèmes CORS si le serveur n'est pas configuré pour
  withCredentials: false,
});

// Déterminer si on est en mode développement
const isDevelopment = import.meta.env.DEV;

// Intercepteur pour gérer de manière générique les erreurs
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      console.warn(
        "Problème de connexion au serveur - vérifiez que le serveur backend est démarré"
      );
    }
    return Promise.reject(error);
  }
);

const candidatureApi = {
  // Récupérer toutes les candidatures avec filtres optionnels
  getCandidatures: async (filters = {}) => {
    try {
      const response = await axiosInstance.get(`/candidatures`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des candidatures:", error);
      // En mode développement, retourner des données fictives pour tester l'interface
      if (isDevelopment) {
        console.log("Utilisation de données fictives pour le développement");
        return [
          {
            _id: "mock1",
            entreprise: "Entreprise Test",
            poste: "Développeur Frontend",
            statut: "en attente",
            date: new Date().toISOString(),
            notes: "Candidature test",
          },
        ];
      }
      return []; // Retourner un tableau vide en cas d'erreur pour éviter les crashes
    }
  },

  // Récupérer une candidature par son ID
  getCandidatureById: async (id) => {
    try {
      const response = await axiosInstance.get(`/candidatures/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de la candidature ${id}:`,
        error
      );
      return null; // Retourner null en cas d'erreur
    }
  },

  // Créer une nouvelle candidature
  createCandidature: async (candidatureData) => {
    try {
      const response = await axiosInstance.post(
        `/candidatures`,
        candidatureData
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la candidature:", error);
      // En développement, simuler une création réussie
      if (isDevelopment) {
        console.log("Simulation d'une création réussie en mode développement");
        return {
          _id: "mock-" + Date.now(),
          ...candidatureData,
          createdAt: new Date().toISOString(),
        };
      }
      throw error;
    }
  },

  // Mettre à jour une candidature existante
  updateCandidature: async (id, candidatureData) => {
    try {
      const response = await axiosInstance.put(
        `/candidatures/${id}`,
        candidatureData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de la candidature ${id}:`,
        error
      );
      throw error;
    }
  },

  // Supprimer une candidature
  deleteCandidature: async (id) => {
    try {
      const response = await axiosInstance.delete(`/candidatures/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de la candidature ${id}:`,
        error
      );
      throw error;
    }
  },

  // Récupérer les statistiques des candidatures
  getStatistiques: async () => {
    try {
      const response = await axiosInstance.get(`/candidatures/stats`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      // En développement, retourner des statistiques fictives
      if (isDevelopment) {
        console.log(
          "Utilisation de statistiques fictives pour le développement"
        );
        return {
          total: 5,
          enAttente: 2,
          acceptees: 1,
          refusees: 1,
          aRelancer: 1,
        };
      }
      return {
        total: 0,
        enAttente: 0,
        acceptees: 0,
        refusees: 0,
        aRelancer: 0,
      }; // Retourner des statistiques vides
    }
  },
};

export default candidatureApi;
