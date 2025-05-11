# Application de Suivi des Candidatures

Outil simplifié permettant aux étudiants de suivre leurs candidatures de stage et d'alternance.

## Fonctionnalités

- Ajout, modification et suppression de candidatures
- Affichage des candidatures avec filtres par entreprise et statut
- Suivi des relances
- Statistiques sur les candidatures

## Technologie utilisées

- **Frontend:** React.js, TailwindCSS, TanStack Query, TanStack Table
- **Backend:** Node.js, Express.js
- **Base de données:** MongoDB

## Prérequis

- Node.js (v14+)
- MongoDB (installé et en cours d'exécution sur le port par défaut)

## Installation

1. Cloner le dépôt
2. Installer les dépendances:

```bash
npm install
```

3. Configurer les variables d'environnement (créer un fichier `.env` à la racine du projet):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/suivi-candidatures
```

## Démarrage

1. Démarrer MongoDB sur votre machine

2. Lancer le serveur backend:

```bash
node server/server.js
```

3. Dans un autre terminal, lancer l'application frontend:

```bash
npm run dev
```

4. Ouvrir l'application dans votre navigateur à l'adresse [http://localhost:5173](http://localhost:5173)

## Structure du projet

- `/src` - Code source du frontend React
- `/server` - Code source du backend Node.js/Express

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
