import express from "express";
import {
  createCandidature,
  deleteCandidature,
  getCandidatureById,
  getCandidatures,
  getStatistiques,
  updateCandidature,
} from "../controllers/candidatureController.js";

const router = express.Router();

// Routes pour les candidatures
router.get("/", getCandidatures);
router.get("/stats", getStatistiques);
router.get("/:id", getCandidatureById);
router.post("/", createCandidature);
router.put("/:id", updateCandidature);
router.delete("/:id", deleteCandidature);

export default router;
