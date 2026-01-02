import pool from "../config/db.js";

const alumnosModel = {

    getAllAlumnos: async () => {
        const res = await pool.query('SELECT * FROM alumnos')
        return res.rows;
    },

    createAlumno: async (userData) => {
        const { nombre } = userData;
        const result = await pool.query('INSERT INTO alumnos (nombre) VALUES ($1) RETURNING *',
            [nombre]
        )
        return result.rows[0];
    },

    deleteAlumno: async (userData) => {
        const { id } = userData;
        const result = await pool.query('DELETE FROM alumnos WHERE id = $1 RETURNING *', [id])
        return result.rows[0];
    },

    editAlumno: async (userData) => {
        const { id, newName } = userData;
        const result = await pool.query('UPDATE alumnos SET nombre = $1 WHERE id = $2 RETURNING *', [newName, id]);
        return result.rows[0];
    },

    updateSesion: async (userData) => {
        const { id } = userData;
        const result = await pool.query(
            'UPDATE alumnos SET ultima_sesion = NOW() WHERE id = $1',
            [id]
        );
        return result;
    },

getProgress: async (userData) => {
    const { id } = userData;
    const result = await pool.query(`
        SELECT 
            COALESCE((COUNT(sl.student_id) * 100.0 / COUNT(l.id)), 0) AS progreso
        FROM lecciones l
        LEFT JOIN student_lessons sl 
            ON l.id = sl.lesson_id AND sl.student_id = $1 AND sl.completed = true;

    `, [id]);

    return result.rows[0].progreso; // devuelve solo el número
}





}


export default alumnosModel;