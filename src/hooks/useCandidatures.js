import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import candidatureApi from "../api/candidatureApi";

// Hook pour récupérer toutes les candidatures avec filtres optionnels
export const useGetCandidatures = (filters = {}) => {
  return useQuery({
    queryKey: ["candidatures", filters],
    queryFn: () => candidatureApi.getCandidatures(filters),
  });
};

// Hook pour récupérer une candidature par son ID
export const useGetCandidatureById = (id) => {
  return useQuery({
    queryKey: ["candidature", id],
    queryFn: () => candidatureApi.getCandidatureById(id),
    enabled: !!id, // Active la requête uniquement si l'ID existe
  });
};

// Hook pour créer une nouvelle candidature
export const useCreateCandidature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (candidatureData) =>
      candidatureApi.createCandidature(candidatureData),
    onSuccess: () => {
      // Invalide le cache des candidatures pour forcer une mise à jour
      queryClient.invalidateQueries({ queryKey: ["candidatures"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

// Hook pour mettre à jour une candidature
export const useUpdateCandidature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, candidatureData }) =>
      candidatureApi.updateCandidature(id, candidatureData),
    onSuccess: (data, variables) => {
      // Mise à jour du cache pour cette candidature spécifique
      queryClient.setQueryData(["candidature", variables.id], data);
      // Invalide le cache des listes de candidatures
      queryClient.invalidateQueries({ queryKey: ["candidatures"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

// Hook pour supprimer une candidature
export const useDeleteCandidature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => candidatureApi.deleteCandidature(id),
    onSuccess: () => {
      // Invalide le cache des candidatures pour forcer une mise à jour
      queryClient.invalidateQueries({ queryKey: ["candidatures"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

// Hook pour récupérer les statistiques
export const useGetStatistiques = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => candidatureApi.getStatistiques(),
  });
};
