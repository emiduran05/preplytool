import express from 'express';
import cors from 'cors';
import alumnosRoutes from "./routes/alumnosRoutes.js";
import nivelesRoutes from "./routes/nivelesRoutes.js";
import etapasRoutes from "./routes/etapasRoutes.js";
import leccionesRoutes from "./routes/leccionesRoutes.js"
import vocabularioRoutes from "./routes/vocabularioRoutes.js";
import studentLessonsRoutes from "./routes/studentLessons.routes.js";


const app = express();

app.use(cors({
  origin: "http://localhost:5173", // permite el frontend de Vite
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/services/nivel', nivelesRoutes)
app.use('/api/services/etapa', etapasRoutes)
app.use('/api/services/leccion', leccionesRoutes)
app.use("/api/vocabulario", vocabularioRoutes);
app.use("/api/student-lessons", studentLessonsRoutes);


const MAINPORT = process.env.MAINPORT || 3000;
app.listen(MAINPORT, () => {
  console.log(`Servidor corriendo en http://localhost:${MAINPORT}`);
});
