import express from 'express';
import cors from 'cors';
import alumnosRoutes from "./routes/alumnosRoutes.js";
import nivelesRoutes from "./routes/nivelesRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // permite el frontend de Vite
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/services', nivelesRoutes)

const MAINPORT = process.env.MAINPORT || 3000;
app.listen(MAINPORT, () => {
  console.log(`Servidor corriendo en http://localhost:${MAINPORT}`);
});
