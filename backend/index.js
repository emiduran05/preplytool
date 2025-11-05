import express from 'express';
import cors from 'cors';
import alumnosRoutes from "./routes/alumnosRoutes.js"


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/alumnos', alumnosRoutes);


const MAINPORT = process.env.MAINPORT || 3000;

app.listen(MAINPORT, () => {
  console.log(`El Servidor está escuchando en el puerto: ${MAINPORT}`);
});


