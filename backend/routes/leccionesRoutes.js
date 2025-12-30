import express from "express";
import LeccionesController from "../controllers/leccionesController.js";


const router = express.Router();

router.post("/create", LeccionesController.createLecciones);
router.put("/update", LeccionesController.updateLecciones);
router.delete("/delete", LeccionesController.deleteLeccion);


router.get("/:id", LeccionesController.getLeccionById);
router.put("/contenido", LeccionesController.updateContenido);
router.put("/ejercicios", LeccionesController.updateEjercicios);
router.put("/documento", LeccionesController.updateRutaPDF);

export default router;
