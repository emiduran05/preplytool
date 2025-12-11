import pool from "../config/db.js";

const leccionesModel = {

    createLeccion: async(nivelData)=> {

        const {nombre, etapa_id } = nivelData;
        const result = await pool.query('INSERT INTO lecciones (nombre, etapa_id) VALUES ($1, $2) RETURNING *;', 
            [nombre, etapa_id]
        )
        return result.rows[0];
    },

    updateLeccion: async(nivelData) => {
        const {nombre, id} = nivelData;
        const result = await pool.query('UPDATE lecciones SET nombre = $1 WHERE id = $2 RETURNING *; ',
            [nombre, id]
        )
        return result.rows[0];

    },

    deleteLeccion: async(nivelData) => {
        const {id} = nivelData;
        const result = await pool.query('DELETE FROM lecciones WHERE id = $1', 
            [id]
        );

        return "Eliminado correctamente";
    }
}


export default leccionesModel;