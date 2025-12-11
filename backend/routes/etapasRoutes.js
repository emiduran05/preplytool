import express from 'express';
import EtapasController from '../controllers/etapasController.js';


const router = express.Router();

router.post("/create", EtapasController.createEtapas)
router.post("/update", EtapasController.updateEtapas)
router.post("/delete", EtapasController.deleteEtapas)

export default router;