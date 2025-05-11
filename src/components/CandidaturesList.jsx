import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import {
  useDeleteCandidature,
  useGetCandidatures,
} from "../hooks/useCandidatures";
import CandidatureForm from "./CandidatureForm";

const CandidaturesList = () => {
  // États locaux
  const [filters, setFilters] = useState({
    entreprise: "",
    statut: "",
  });
  const [sorting, setSorting] = useState([]);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Récupérer les données avec React Query
  const {
    data: candidatures = [],
    isLoading,
    error,
  } = useGetCandidatures(filters);
  const deleteMutation = useDeleteCandidature();

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  // Définition des colonnes
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("entreprise", {
      header: "Entreprise",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("poste", {
      header: "Poste",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("dateEnvoi", {
      header: "Date d'envoi",
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("statut", {
      header: "Statut",
      cell: (info) => {
        const statut = info.getValue();
        let className = "";

        switch (statut) {
          case "Acceptée":
            className = "statut-acceptee";
            break;
          case "Refusée":
            className = "statut-refusee";
            break;
          default:
            className = "statut-attente";
        }

        return <span className={className}>{statut}</span>;
      },
    }),
    columnHelper.accessor("dateRelance", {
      header: "Date de relance",
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("aRelancer", {
      header: "À relancer",
      cell: (info) => (info.getValue() ? "⚠️" : ""),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (props) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(props.row.original)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDelete(props.row.original._id)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      ),
    }),
  ];

  // Configuration de la table
  const table = useReactTable({
    data: candidatures,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Gestionnaires d'événements
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (candidature) => {
    setSelectedCandidature(candidature);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedCandidature(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Liste des candidatures
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        >
          Ajouter une candidature
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label
            htmlFor="filter-entreprise"
            className="text-sm font-medium text-gray-700"
          >
            Entreprise:
          </label>
          <input
            type="text"
            id="filter-entreprise"
            name="entreprise"
            value={filters.entreprise}
            onChange={handleFilterChange}
            placeholder="Filtrer par entreprise..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label
            htmlFor="filter-statut"
            className="text-sm font-medium text-gray-700"
          >
            Statut:
          </label>
          <select
            id="filter-statut"
            name="statut"
            value={filters.statut}
            onChange={handleFilterChange}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Tous</option>
            <option value="En attente">En attente</option>
            <option value="Acceptée">Acceptée</option>
            <option value="Refusée">Refusée</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-gray-500">
          Chargement des candidatures...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-600">
          Erreur lors du chargement des candidatures
        </div>
      ) : candidatures.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          Aucune candidature trouvée
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="ml-1">
                          {{
                            asc: "🔼",
                            desc: "🔽",
                          }[header.column.getIsSorted()] ?? null}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              onClick={closeForm}
              className="absolute -right-2 -top-2 bg-gray-200 rounded-full p-1 shadow-md hover:bg-gray-300"
            >
              &times;
            </button>
            <CandidatureForm
              candidature={selectedCandidature}
              onClose={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidaturesList;
