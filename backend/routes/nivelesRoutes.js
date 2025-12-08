import express from 'express';
import { getNivelesCompletos } from '../controllers/nivelesController.js';

const router = express.Router();

router.get("/niveles/completos", getNivelesCompletos);

export default router;