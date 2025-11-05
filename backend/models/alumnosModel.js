import pool from "../config/db.js";

const alumnosModel = {

    getAllAlumnos: async() => {
        const res = await pool.query('SELECT * FROM alumnos')
        return res.rows;
    },

   
}


export default alumnosModel;