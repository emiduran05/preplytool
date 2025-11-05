import alumnosModel from "../models/alumnosModel.js";

const alumnosController = {
    getAllAlumnos: async(req,res) => {
        try {
            const alumnos = await alumnosModel.getAllAlumnos();
            res.status(201).json(alumnos);
            
        } catch (err) {
            res.status(500).json("ERROR", err)
        }
    },
}

export default alumnosController;