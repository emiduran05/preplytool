import express from 'express';
import alumnosController from '../controllers/alumnosController.js';
const router = express.Router();

router.get('/', alumnosController.getAllAlumnos);


export default router;