import pool from "../config/db.js";

export const getNivelesCompletosService = async (student_id) => {
    // Query principal que obtiene todas las lecciones y si el alumno las completó
    const result = await pool.query(`
        SELECT 
            n.id AS nivel_id, n.nombre AS nivel_nombre,
            e.id AS etapa_id, e.nombre AS etapa_nombre,
            l.id AS leccion_id, l.nombre AS leccion_nombre
        FROM niveles n
        LEFT JOIN etapas e ON e.nivel_id = n.id
        LEFT JOIN lecciones l ON l.etapa_id = e.id
        ORDER BY 
            LOWER(n.nombre) ASC,
            LOWER(e.nombre) ASC,
            LOWER(l.nombre) ASC;
    `);

    const rows = result.rows;
    const nivelesMap = {};

    // Mapear niveles, etapas y lecciones
    rows.forEach(row => {
        if (!nivelesMap[row.nivel_id]) {
            nivelesMap[row.nivel_id] = {
                id: row.nivel_id,
                name: row.nivel_nombre,
                stages: [],
                progreso: 0
            };
        }

        const nivel = nivelesMap[row.nivel_id];

        let etapa = nivel.stages.find(s => s.id === row.etapa_id);
        if (!etapa && row.etapa_id) {
            etapa = {
                id: row.etapa_id,
                name: row.etapa_nombre,
                lessons: [],
                progreso: 0
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

    // 🔹 Calcular progreso usando la query que devuelve el porcentaje
    for (const nivel of Object.values(nivelesMap)) {
        for (const etapa of nivel.stages) {
            const progresoEtapaResult = await pool.query(`
                SELECT 
                    CASE WHEN COUNT(l.id) = 0 THEN 0
                         ELSE (COUNT(sl.student_id) * 100.0 / COUNT(l.id))
                    END AS progreso
                FROM lecciones l
                LEFT JOIN student_lessons sl 
                    ON l.id = sl.lesson_id AND sl.student_id = $1
                WHERE l.etapa_id = $2;
            `, [student_id, etapa.id]);

            etapa.progreso = parseFloat(progresoEtapaResult.rows[0].progreso || 0);
        }

        // Progreso del nivel como promedio de sus etapas
        if (nivel.stages.length > 0) {
            const suma = nivel.stages.reduce((acc, s) => acc + s.progreso, 0);
            nivel.progreso = Math.round(suma / nivel.stages.length);
        }
    }

    // 🔥 Ordenar dentro del JSON final
    const nivelesOrdenados = Object.values(nivelesMap)
        .sort((a, b) => a.name.localeCompare(b.name));

    nivelesOrdenados.forEach(nivel => {
        nivel.stages.sort((a, b) => a.name.localeCompare(b.name));
        nivel.stages.forEach(etapa => {
            etapa.lessons.sort((a, b) => a.name.localeCompare(b.name));
        });
    });

    return nivelesOrdenados;
};
