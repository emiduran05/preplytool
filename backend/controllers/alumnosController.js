import alumnosModel from "../models/alumnosModel.js";

const alumnosController = {
    getAllAlumnos: async (req, res) => {
        try {
            const alumnos = await alumnosModel.getAllAlumnos();

            const alumnosConTiempo = alumnos.map(alumno => {
                const ultimaSesion = new Date(alumno.ultima_sesion);
                const ahora = new Date();

                const diferenciaMs = ahora - ultimaSesion;

                const segundos = Math.floor(diferenciaMs / 1000);
                const minutos = Math.floor(segundos / 60);
                const horas = Math.floor(minutos / 60);
                const dias = Math.floor(horas / 24);

                return {
                    ...alumno,
                    tiempo_desde_ultima_sesion: {
                        dias,
                        horas: horas % 24,
                        minutos: minutos % 60,
                        segundos: segundos % 60
                    }
                };
            });

            res.status(200).json(alumnosConTiempo);
        } catch (err) {
            console.error("ERROR:", err);
            res.status(500).json({ error: "Error al obtener los alumnos" });
        }
    },

    createAlumno: async (req, res) => {
        try {
            const { nombre } = req.body;

            if (!nombre) {
                return res.status(400).json({ error: "Falta el nombre del alumno" });
            }

            const newAlumno = await alumnosModel.createAlumno({ nombre });
            res.status(201).json(newAlumno);

        } catch (error) {
            console.error("ERROR AL CREAR ALUMNO:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

   deleteAlumno: async (req, res) => {
    try {
        const { id } = req.params; 
        const deleted = await alumnosModel.deleteAlumno({ id });

        if (!deleted) {
            return res.status(404).json({ error: "Alumno no encontrado" });
        }

        res.json({ message: "Alumno eliminado correctamente", alumno: deleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el alumno" });
    }
    },

    updateAlumno: async(req, res) => {
        try {
            const {id, newName} = req.params;
            const updated = await alumnosModel.editAlumno({id, newName});

            if (!updated) {
                return res.status(404).json({ error: "Alumno no encontrado" });
            }

            res.json({ message: "Alumno updateado correctamente", alumno: updated });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar alumno" });
        }
    },

    UpdateSesion: async(req,res) => {
        try {
            const {id} = req.params;
            const updated = await alumnosModel.updateSesion({id});

             if (!updated) {
                return res.status(404).json({ error: "Alumno no encontrado" });
            }

            res.json({ message: "Alumno updateado correctamente", alumno: updated });

            
        } catch (error) {

            console.error(error);
            res.status(500).json({ error: "Error al actualizar alumno" });
            
        }
    },

    getProgress: async(req,res) => {
        try {
            const {id} = req.params;
            const progress = await alumnosModel.getProgress({id});
            if (!progress) {
                return res.status(404).json({ error: "Alumno no encontrado" });
            }

            res.json({ message: "Alumno updateado correctamente", alumno: progress });

            
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar alumno" });
            
        }
    }

};

export default alumnosController;
