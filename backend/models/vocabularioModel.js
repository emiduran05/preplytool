import pool from "../config/db.js";

const VocabularioModel = {
    // Obtener palabras por lección
    async obtenerPorLeccion(lessonId) {
        const { rows } = await pool.query(
            "SELECT palabra FROM vocabulario_palabras WHERE leccion_id = $1",
            [lessonId]
        );
        return rows;
    },

    // Insertar palabras
    async insertar(lessonId, palabras) {
        const query = `
            INSERT INTO vocabulario_palabras (leccion_id, palabra)
            VALUES ($1, $2)
            RETURNING *;
        `;

        const results = [];

        for (const palabra of palabras) {
            const { rows } = await pool.query(query, [lessonId, palabra]);
            results.push(rows[0]);
        }

        return results;
    },

    // 🗑️ Eliminar palabra
    async eliminar(lessonId, palabra) {
        await pool.query(
            "DELETE FROM vocabulario_palabras WHERE leccion_id = $1 AND palabra = $2",
            [lessonId, palabra]
        );
    }
};

export default VocabularioModel;
