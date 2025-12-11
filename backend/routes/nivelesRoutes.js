import express from 'express';
import { getNivelesCompletos } from '../controllers/nivelesController.js';
import nivelesController from '../controllers/nivelesController.js';

const router = express.Router();

router.get("/niveles/completos", getNivelesCompletos);
router.post("/create", nivelesController.createNiveles)
router.post("/update", nivelesController.updateNiveles)
router.post("/delete", nivelesController.deleteNiveles)

export default router;