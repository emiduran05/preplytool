import express from 'express';
import LeccionesController from '../controllers/leccionesController.js';

const router = express.Router();

router.post("/create", LeccionesController.createLecciones)
router.post("/update", LeccionesController.updateLecciones)
router.post("/delete", LeccionesController.deleteEtapas)

export default router;