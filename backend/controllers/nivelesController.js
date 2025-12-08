import { getNivelesCompletosService } from "../services/nivelesService.js";

export const getNivelesCompletos = async (req, res) => {
    try {
        const data = await getNivelesCompletosService();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener niveles completos" });
    }
};
