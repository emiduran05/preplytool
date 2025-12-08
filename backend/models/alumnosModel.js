import pool from "../config/db.js";

const alumnosModel = {

    getAllAlumnos: async() => {
        const res = await pool.query('SELECT * FROM alumnos')
        return res.rows;
    },

    createAlumno: async(userData) =>{
        const {nombre } = userData;
        const result = await pool.query('INSERT INTO alumnos (nombre) VALUES ($1) RETURNING *', 
            [nombre]
        )
        return result.rows[0];
    },

    deleteAlumno: async(userData) =>{
        const {id} = userData;
        const result = await pool.query('DELETE FROM alumnos WHERE id = $1 RETURNING *', [id])
        return result.rows[0];
    },

    editAlumno: async(userData) => {
        const {id, newName} = userData;
        const result = await pool.query('UPDATE alumnos SET nombre = $1 WHERE id = $2 RETURNING *', [newName, id]);
        return result.rows[0];
    }

   
}


export default alumnosModel;