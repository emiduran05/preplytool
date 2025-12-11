import pool from "../config/db.js";

const nivelesModel = {

    createNivel: async(nivelData)=> {

        const {nombre } = nivelData;
        const result = await pool.query('INSERT INTO niveles (nombre) VALUES ($1) RETURNING *', 
            [nombre]
        )
        return result.rows[0];
    },

    updateNivel: async(nivelData) => {
        const {nombre, id} = nivelData;
        const result = await pool.query('UPDATE niveles SET nombre = $1 WHERE id = $2 RETURNING *; ',
            [nombre, id]
        )
        return result.rows[0];

    },

    deleteNivel: async(nivelData) => {
        const {id} = nivelData;
        const result = await pool.query('DELETE FROM niveles WHERE id = $1', 
            [id]
        );

        return "Eliminado correctamente";
    }
}


export default nivelesModel;