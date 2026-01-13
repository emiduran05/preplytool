import pool from "../config/db.js";

const etapasModel = {

    createEtapa: async(nivelData)=> {

        const {nombre, nivel_id, orden_etapa } = nivelData;
        const result = await pool.query('INSERT INTO etapas (nombre, nivel_id, orden_etapa) VALUES ($1, $2, $3) RETURNING *;', 
            [nombre, nivel_id, orden_etapa]
        )
        return result.rows[0];
    },

    updateEtapa: async(nivelData) => {
        const {nombre, id, orden_etapa} = nivelData;
        const result = await pool.query('UPDATE etapas SET nombre = $1, orden_etapa = $2 WHERE id = $2 RETURNING *; ',
            [nombre, id, orden_etapa]
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