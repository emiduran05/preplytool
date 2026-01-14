import express from 'express';
import cors from 'cors';
import alumnosRoutes from "./routes/alumnosRoutes.js";
import nivelesRoutes from "./routes/nivelesRoutes.js";
import etapasRoutes from "./routes/etapasRoutes.js";
import leccionesRoutes from "./routes/leccionesRoutes.js"
import vocabularioRoutes from "./routes/vocabularioRoutes.js";
import studentLessonsRoutes from "./routes/studentLessons.routes.js";

const app = express();

// Configuración de CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://preplytool.vercel.app",
    "http://38.242.240.22:5173",
    "http://38.242.203.202",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Middleware para aceptar JSON grande
app.use(express.json({ limit: '10mb' })); // hasta 10 MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // formularios grandes

// Rutas de la API
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/services/nivel', nivelesRoutes);
app.use('/api/services/etapa', etapasRoutes);
app.use('/api/services/leccion', leccionesRoutes);
app.use("/api/vocabulario", vocabularioRoutes);
app.use("/api/student-lessons", studentLessonsRoutes);

// Ruta de prueba para verificar tamaño del payload
app.post('/api/test', (req, res) => {
  console.log("Tamaño del request:", JSON.stringify(req.body).length, "bytes");
  res.json({ message: 'Payload recibido correctamente' });
});

// Servidor
const MAINPORT = process.env.MAINPORT || 3000;
app.listen(MAINPORT, () => {
  console.log(`Servidor corriendo en http://localhost:${MAINPORT}`);
});
