import React from "react";
import CandidaturesList from "../components/CandidaturesList";
import Statistiques from "../components/Statistiques";

const Home = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm py-6 px-4">
        <div className="container">
          <h1 className="text-2xl font-bold">Suivi des Candidatures</h1>
          <p className="text-neutral-600">
            Gérez facilement toutes vos candidatures de stage et d'alternance
          </p>
        </div>
      </header>

      <main className="container py-8">
        <div className="space-y-8">
          <div className="card">
            <CandidaturesList />
          </div>
          <div className="card">
            <Statistiques />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-neutral-200 py-6">
        <div className="container">
          <p className="text-neutral-500 text-center">
            © {new Date().getFullYear()} - Application de Suivi des Candidatures
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
