import { getNivelesCompletosService } from "../services/nivelesService.js";
import nivelesModel from "../models/nivelesModel.js";

export const getNivelesCompletos = async (req, res) => {
    try {
        const data = await getNivelesCompletosService();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener niveles completos" });
    }
};


const nivelesController = {

    createNiveles: async (req, res) => {
        try {
            const { nombre, orden_nivel } = req.body;

            if (!nombre) {
                return res.status(400).json({ error: "Falta el nombre del nivel" });
            }

            const newNivel = await nivelesModel.createNivel({ nombre, orden_nivel });
            res.status(201).json(newNivel);

        } catch (error) {
            console.error("ERROR AL CREAR NIVEL:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    updateNiveles: async (req, res) => {
        try {
            const { nombre, id, orden_nivel } = req.body;


            const updatedNivel = await nivelesModel.updateNivel({ nombre, id, orden_nivel })

            res.status(200).json(updatedNivel);
        } catch (error) {
            console.error("ERROR UPDATE:", error);
            res.status(500).json({ error: "Error interno" });
        }
    },

    deleteNiveles: async(req,res) => {
        try {
            const {id} = req.body;

            const deleteNivel = await nivelesModel.deleteNivel({id});

            res.status(200).json(deleteNivel);
            
        } catch (error) {

            console.error("ERROR AL BORRAR ", error);
            res.status(500).json({error: "Error interno"});
            
        }
    }



}

export default nivelesController;