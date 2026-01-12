import express from "express";
import LeccionesController from "../controllers/leccionesController.js";

const router = express.Router();

// ESPECÍFICAS
router.post("/create", LeccionesController.createLecciones);
router.put("/update", LeccionesController.updateLecciones);
router.delete("/delete", LeccionesController.deleteLeccion);

router.put("/contenido", LeccionesController.updateContenido);
router.put("/ejercicios", LeccionesController.updateEjercicios);
router.put("/documento", LeccionesController.updateRutaPDF);

// DINÁMICA AL FINAL
router.get("/:id", LeccionesController.getLeccionById);

export default router;
