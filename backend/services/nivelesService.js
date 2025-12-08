import pool from "../config/db.js";

export const getNivelesCompletosService = async () => {

    const result = await pool.query(`
        SELECT 
            n.id AS nivel_id, n.nombre AS nivel_nombre,
            e.id AS etapa_id, e.nombre AS etapa_nombre,
            l.id AS leccion_id, l.nombre AS leccion_nombre
        FROM niveles n
        LEFT JOIN etapas e ON e.nivel_id = n.id
        LEFT JOIN lecciones l ON l.etapa_id = e.id
        ORDER BY n.id, e.id, l.id;
    `);

    const rows = result.rows;

    const nivelesMap = {};

    rows.forEach(row => {
        if (!nivelesMap[row.nivel_id]) {
            nivelesMap[row.nivel_id] = {
                id: row.nivel_id,
                name: row.nivel_nombre,
                stages: []
            };
        }

        const nivel = nivelesMap[row.nivel_id];

        let etapa = nivel.stages.find(s => s.id === row.etapa_id);
        if (!etapa && row.etapa_id) {
            etapa = {
                id: row.etapa_id,
                name: row.etapa_nombre,
                lessons: []
            };
            nivel.stages.push(etapa);
        }

        if (row.leccion_id) {
            etapa.lessons.push({
                id: row.leccion_id,
                name: row.leccion_nombre
            });
        }
    });

    return Object.values(nivelesMap);
};
