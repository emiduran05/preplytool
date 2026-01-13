
import leccionesModel from "../models/leccionesModel.js";

const LeccionesController = {


  createLecciones: async (req, res) => {
    try {
      const { nombre, etapa_id, orden_leccion, ruta_pdf } = req.body;

      if (!nombre) {
        return res.status(400).json({ error: "Falta el nombre" });
      }

      const newLeccion = await leccionesModel.createLeccion({
        nombre,
        etapa_id,
        orden_leccion,
        ruta_pdf
      });

      res.status(201).json(newLeccion);

    } catch (error) {
      console.error("ERROR AL CREAR LECCION:", error);
      res.status(500).json({ error: "Error interno" });
    }
  },

  updateLecciones: async (req, res) => {
    try {
      const { nombre, id, orden_leccion, ruta_pdf } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Falta el id" });
      }

      const updatedLeccion = await leccionesModel.updateLeccion({
        nombre,
        id,
        orden_leccion,
        ruta_pdf
      });

      res.status(200).json(updatedLeccion);

    } catch (error) {
      console.error("ERROR UPDATE:", error);
      res.status(500).json({ error: "Error interno" });
    }
  },

  deleteLeccion: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Falta el id" });
      }

      const deleteLeccion = await leccionesModel.deleteLeccion({ id });
      res.status(200).json(deleteLeccion);

    } catch (error) {
      console.error("ERROR AL BORRAR", error);
      res.status(500).json({ error: "Error interno" });
    }
  },

  saveContenido: async (req, res) => {
  try {
    const { id, titulo_clase, contenido_leccion, ejercicios_leccion } = req.body;

    const updated = await leccionesModel.updateContenido({
      id,
      titulo_clase,
      contenido_leccion,
      ejercicios_leccion
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("ERROR GUARDANDO CONTENIDO:", error);
    res.status(500).json({ error: "Error interno" });
  }
},

  getLeccionById: async (req, res) => {
    try {
      const { id } = req.params;

      const leccion = await leccionesModel.getLeccionById(id);

      if (!leccion) {
        return res.status(404).json(null);
      }

      res.status(200).json(leccion);

    } catch (error) {
      console.error("ERROR OBTENER LECCION:", error);
      res.status(500).json({ error: "Error interno" });
    }
  },
  // 🟢 OBTENER LECCIÓN


  // 🟢 CONTENIDO
updateContenido: async (req, res) => {
  try {
    const { id, titulo_clase, contenido_leccion, ejercicios_leccion } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Falta el id" });
    }

    const updated = await leccionesModel.updateContenido({
      id,
      titulo_clase,
      contenido_leccion,
      ejercicios_leccion
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("ERROR GUARDANDO CONTENIDO:", error);
    res.status(500).json({ error: "Error interno" });
  }
},


  // 🟢 EJERCICIOS
  updateEjercicios: async (req, res) => {
    try {
      const { id, ejercicios_leccion } = req.body;
      const updated = await leccionesModel.updateEjercicios({
        id,
        ejercicios_leccion
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Error al guardar ejercicios" });
    }
  },

  // 🟢 PDF / WORD
  updateRutaPDF: async (req, res) => {
    try {
      const { id, ruta_pdf } = req.body;
      const updated = await leccionesModel.updateRutaPDF({
        id,
        ruta_pdf
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Error al guardar documento" });
    }
  }
};

export default LeccionesController;
