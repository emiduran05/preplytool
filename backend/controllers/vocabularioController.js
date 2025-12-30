import VocabularioModel from "../models/vocabularioModel.js";

export const vocabularioController = async (req, res) => {
    const { lessonId, palabra } = req.params;

    try {
        // 🔹 GET → obtener vocabulario
        if (req.method === "GET") {
            const palabras = await VocabularioModel.obtenerPorLeccion(lessonId);
            return res.json(palabras);
        }

        // 🔹 POST → guardar vocabulario
        if (req.method === "POST") {
            const { vocabulary } = req.body;

            if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
                return res.status(400).json({ message: "Vocabulario inválido" });
            }

            const result = await VocabularioModel.insertar(lessonId, vocabulary);
            return res.status(201).json(result);
        }

        // 🔹 DELETE → eliminar palabra
        if (req.method === "DELETE") {
            await VocabularioModel.eliminar(lessonId, palabra);
            return res.json({ message: "Palabra eliminada" });
        }

        res.status(405).json({ message: "Método no permitido" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
};
