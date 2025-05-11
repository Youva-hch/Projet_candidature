import React, { useEffect, useState } from "react";
import {
  useCreateCandidature,
  useUpdateCandidature,
} from "../hooks/useCandidatures";

const CandidatureForm = ({ candidature, onClose }) => {
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    entreprise: "",
    poste: "",
    lienOffre: "",
    dateEnvoi: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
    statut: "En attente",
    dateRelance: "",
  });

  // Custom hooks pour les mutations
  const createMutation = useCreateCandidature();
  const updateMutation = useUpdateCandidature();

  // État de chargement et d'erreur
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  // Si une candidature existe, pré-remplir le formulaire
  useEffect(() => {
    if (candidature) {
      setFormData({
        entreprise: candidature.entreprise || "",
        poste: candidature.poste || "",
        lienOffre: candidature.lienOffre || "",
        dateEnvoi: candidature.dateEnvoi
          ? new Date(candidature.dateEnvoi).toISOString().split("T")[0]
          : "",
        statut: candidature.statut || "En attente",
        dateRelance: candidature.dateRelance
          ? new Date(candidature.dateRelance).toISOString().split("T")[0]
          : "",
      });
    }
  }, [candidature]);

  // Gestion des changements des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (candidature?._id) {
      // Mise à jour d'une candidature existante
      updateMutation.mutate(
        {
          id: candidature._id,
          candidatureData: formData,
        },
        {
          onSuccess: () => {
            onClose && onClose();
          },
        }
      );
    } else {
      // Création d'une nouvelle candidature
      createMutation.mutate(formData, {
        onSuccess: () => {
          // Réinitialiser le formulaire après la création
          setFormData({
            entreprise: "",
            poste: "",
            lienOffre: "",
            dateEnvoi: new Date().toISOString().split("T")[0],
            statut: "En attente",
            dateRelance: "",
          });
          onClose && onClose();
        },
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {candidature ? "Modifier la candidature" : "Ajouter une candidature"}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
          {typeof error === "string" ? error : "Une erreur est survenue"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="entreprise"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Entreprise *
            </label>
            <input
              type="text"
              id="entreprise"
              name="entreprise"
              value={formData.entreprise}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="poste"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Poste *
            </label>
            <input
              type="text"
              id="poste"
              name="poste"
              value={formData.poste}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="lienOffre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lien de l'offre
          </label>
          <input
            type="url"
            id="lienOffre"
            name="lienOffre"
            value={formData.lienOffre}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dateEnvoi"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date d'envoi *
            </label>
            <input
              type="date"
              id="dateEnvoi"
              name="dateEnvoi"
              value={formData.dateEnvoi}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="statut"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Statut *
            </label>
            <select
              id="statut"
              name="statut"
              value={formData.statut}
              onChange={(e) =>
                setFormData({ ...formData, statut: e.target.value })
              }
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="En attente">En attente</option>
              <option value="Acceptée">Acceptée</option>
              <option value="Refusée">Refusée</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="dateRelance"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date de relance
          </label>
          <input
            type="date"
            id="dateRelance"
            name="dateRelance"
            value={formData.dateRelance}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-70"
          >
            {isLoading
              ? "Chargement..."
              : candidature
              ? "Mettre à jour"
              : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidatureForm;
