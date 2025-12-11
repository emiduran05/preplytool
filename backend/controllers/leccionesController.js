import leccionesModel from "../models/leccionesModel.js";

const LeccionesController = {

    createLecciones: async (req, res) => {
        try {
            const { nombre, etapa_id } = req.body;

            if (!nombre) {
                return res.status(400).json({ error: "Falta el nombre del nivel" });
            }

            const newLeccion = await leccionesModel.createLeccion({ nombre, etapa_id });
            res.status(201).json(newLeccion);

        } catch (error) {
            console.error("ERROR AL CREAR LECCION:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    updateLecciones: async (req, res) => {
        try {
            const { nombre, id } = req.body;


            const updatedLeccion = await leccionesModel.updateLeccion({ nombre, id })

            res.status(200).json(updatedLeccion);
        } catch (error) {
            console.error("ERROR UPDATE:", error);
            res.status(500).json({ error: "Error interno" });
        }
    },

    deleteEtapas: async(req,res) => {
        try {
            const {id} = req.body;

            const deleteLeccion = await leccionesModel.deleteLeccion({id});

            res.status(200).json(deleteLeccion);
            
        } catch (error) {

            console.error("ERROR AL BORRAR ", error);
            res.status(500).json({error: "Error interno"});
            
        }
    }



}

export default LeccionesController;