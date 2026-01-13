import pool from "../config/db.js";

const nivelesModel = {

    createNivel: async(nivelData)=> {

        const {nombre, orden_nivel } = nivelData;
        const result = await pool.query('INSERT INTO niveles (nombre, orden_nivel) VALUES ($1, $2) RETURNING *', 
            [nombre, orden_nivel]
        )
        return result.rows[0];
    },

    updateNivel: async(nivelData) => {
        const {nombre, id, orden_nivel} = nivelData;
        const result = await pool.query('UPDATE niveles SET nombre = $1, orden_nivel =$3 WHERE id = $2 RETURNING *; ',
            [nombre, id, orden_nivel]
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