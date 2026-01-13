import pool from "../config/db.js";

const leccionesModel = {

  // EXISTENTES 👇
  createLeccion: async ({ nombre, etapa_id }) => {
    const result = await pool.query(
      "INSERT INTO lecciones (nombre, etapa_id) VALUES ($1, $2) RETURNING *;",
      [nombre, etapa_id]
    );
    return result.rows[0];
  },

  updateLeccion: async ({ nombre, orden_leccion, id }) => {
  const result = await pool.query(
    `
    UPDATE lecciones
    SET nombre = $1,
        orden = $2
    WHERE id = $3
    RETURNING *;
    `,
    [nombre, orden_leccion, id]
  );

  return result.rows[0];
},


  deleteLeccion: async ({ id }) => {
    await pool.query("DELETE FROM lecciones WHERE id = $1", [id]);
    return "Eliminado correctamente";
  },

  // 🟢 NUEVAS 👇

  getLeccionById: async (id) => {
    const result = await pool.query(
      "SELECT * FROM lecciones WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  updateContenido: async ({ id, titulo_clase, contenido_leccion, ejercicios_leccion }) => {
  const result = await pool.query(
    `
    UPDATE lecciones
    SET 
      titulo_clase = $1,
      contenido_leccion = $2,
      ejercicios_leccion = $3
    WHERE id = $4
    RETURNING *
    `,
    [titulo_clase, contenido_leccion, ejercicios_leccion, id]
  );

  return result.rows[0];
},


  updateEjercicios: async ({ id, ejercicios_leccion }) => {
    const result = await pool.query(
      "UPDATE lecciones SET ejercicios_leccion = $1 WHERE id = $2 RETURNING *",
      [ejercicios_leccion, id]
    );
    return result.rows[0];
  },

  updateRutaPDF: async ({ id, ruta_pdf }) => {
    const result = await pool.query(
      "UPDATE lecciones SET ruta_pdf = $1 WHERE id = $2 RETURNING *",
      [ruta_pdf, id]
    );
    return result.rows[0];
  }
};

export default leccionesModel;
