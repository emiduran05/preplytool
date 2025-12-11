import etapasModel from "../models/etapasModel.js";

const EtapasController = {

    createEtapas: async (req, res) => {
        try {
            const { nombre, nivel_id } = req.body;

            if (!nombre) {
                return res.status(400).json({ error: "Falta el nombre del nivel" });
            }

            const newEtapa = await etapasModel.createEtapa({ nombre, nivel_id });
            res.status(201).json(newEtapa);

        } catch (error) {
            console.error("ERROR AL CREAR NIVEL:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    updateEtapas: async (req, res) => {
        try {
            const { nombre, id } = req.body;


            const updatedEtapa = await etapasModel.updateEtapa({ nombre, id })

            res.status(200).json(updatedEtapa);
        } catch (error) {
            console.error("ERROR UPDATE:", error);
            res.status(500).json({ error: "Error interno" });
        }
    },

    deleteEtapas: async(req,res) => {
        try {
            const {id} = req.body;

            const deleteEtapa = await etapasModel.deleteEtapa({id});

            res.status(200).json(deleteEtapa);
            
        } catch (error) {

            console.error("ERROR AL BORRAR ", error);
            res.status(500).json({error: "Error interno"});
            
        }
    }



}

export default EtapasController;