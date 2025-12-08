import express from 'express';
import alumnosController from '../controllers/alumnosController.js';
const router = express.Router();

router.get('/', alumnosController.getAllAlumnos);
router.post('/add', alumnosController.createAlumno);
router.delete('/delete/:id', alumnosController.deleteAlumno)
router.put('/update/:id/:newName', alumnosController.updateAlumno)

export default router;