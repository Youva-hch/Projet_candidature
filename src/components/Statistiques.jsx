import React from "react";
import { useGetStatistiques } from "../hooks/useCandidatures";

const Statistiques = () => {
  const { data: stats, isLoading, error } = useGetStatistiques();

  if (isLoading) {
    return (
      <div className="card text-warning text-center">
        Chargement des statistiques...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-danger text-center">
        Erreur lors du chargement des statistiques
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Calcul des pourcentages pour visualisation
  const totalCandidatures = stats.total || 0;
  const pourcentageEnAttente =
    totalCandidatures > 0
      ? Math.round((stats.enAttente / totalCandidatures) * 100)
      : 0;
  const pourcentageAcceptees =
    totalCandidatures > 0
      ? Math.round((stats.acceptees / totalCandidatures) * 100)
      : 0;
  const pourcentageRefusees =
    totalCandidatures > 0
      ? Math.round((stats.refusees / totalCandidatures) * 100)
      : 0;

  return (
    <div className="w-full">
      <h2 className="mb-4">Statistiques des candidatures</h2>

      <div className="flex gap-2 mb-4">
        <div className="card text-center">
          <div
            className="text-success"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            {totalCandidatures}
          </div>
          <div className="text-sm">Candidatures totales</div>
        </div>
        <div className="card text-center">
          <div
            className="text-primary"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            {stats.enAttente}
          </div>
          <div className="text-sm">En attente</div>
          <div className="text-xs text-primary mt-2">
            {pourcentageEnAttente}%
          </div>
        </div>
        <div className="card text-center">
          <div
            className="text-success"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            {stats.acceptees}
          </div>
          <div className="text-sm">Acceptées</div>
          <div className="text-xs text-success mt-2">
            {pourcentageAcceptees}%
          </div>
        </div>
        <div className="card text-center">
          <div
            className="text-danger"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            {stats.refusees}
          </div>
          <div className="text-sm">Refusées</div>
          <div className="text-xs text-danger mt-2">{pourcentageRefusees}%</div>
        </div>
        <div className="card text-center">
          <div
            className="text-warning"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            {stats.aRelancer}
          </div>
          <div className="text-sm">À relancer</div>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="mt-2">
          <div className="mb-2 flex justify-between text-sm">
            <span>Répartition des candidatures</span>
            <span>{totalCandidatures} candidatures au total</span>
          </div>

          <div
            style={{
              height: "16px",
              borderRadius: "8px",
              background: "#e5e7eb",
              overflow: "hidden",
              display: "flex",
            }}
          >
            {pourcentageEnAttente > 0 && (
              <div
                style={{
                  background: "#3b82f6",
                  height: "100%",
                  width: `${pourcentageEnAttente}%`,
                }}
                title={`En attente: ${stats.enAttente} (${pourcentageEnAttente}%)`}
              ></div>
            )}
            {pourcentageAcceptees > 0 && (
              <div
                style={{
                  background: "#22c55e",
                  height: "100%",
                  width: `${pourcentageAcceptees}%`,
                }}
                title={`Acceptées: ${stats.acceptees} (${pourcentageAcceptees}%)`}
              ></div>
            )}
            {pourcentageRefusees > 0 && (
              <div
                style={{
                  background: "#ef4444",
                  height: "100%",
                  width: `${pourcentageRefusees}%`,
                }}
                title={`Refusées: ${stats.refusees} (${pourcentageRefusees}%)`}
              ></div>
            )}
          </div>

          <div className="flex gap-2 mt-2 text-xs">
            <div className="flex items-center">
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  display: "inline-block",
                  background: "#3b82f6",
                  borderRadius: "50%",
                  marginRight: "4px",
                }}
              ></span>
              <span>En attente ({pourcentageEnAttente}%)</span>
            </div>
            <div className="flex items-center">
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  display: "inline-block",
                  background: "#22c55e",
                  borderRadius: "50%",
                  marginRight: "4px",
                }}
              ></span>
              <span>Acceptées ({pourcentageAcceptees}%)</span>
            </div>
            <div className="flex items-center">
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  display: "inline-block",
                  background: "#ef4444",
                  borderRadius: "50%",
                  marginRight: "4px",
                }}
              ></span>
              <span>Refusées ({pourcentageRefusees}%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistiques;
