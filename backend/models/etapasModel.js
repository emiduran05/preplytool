import pool from "../config/db.js";

const etapasModel = {

    createEtapa: async(nivelData)=> {

        const {nombre, nivel_id } = nivelData;
        const result = await pool.query('INSERT INTO etapas (nombre, nivel_id) VALUES ($1, $2) RETURNING *;', 
            [nombre, nivel_id]
        )
        return result.rows[0];
    },

    updateEtapa: async(nivelData) => {
        const {nombre, id} = nivelData;
        const result = await pool.query('UPDATE etapas SET nombre = $1 WHERE id = $2 RETURNING *; ',
            [nombre, id]
        )
        return result.rows[0];

    },

    deleteEtapa: async(nivelData) => {
        const {id} = nivelData;
        const result = await pool.query('DELETE FROM etapas WHERE id = $1', 
            [id]
        );

        return "Eliminado correctamente";
    }
}


export default etapasModel;