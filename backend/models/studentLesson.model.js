import pool from "../config/db.js";

export const StudentLesson = {
  async getByStudent(studentId) {
    const { rows } = await pool.query(
      `SELECT * FROM student_lessons WHERE student_id = $1`,
      [studentId]
    );
    return rows;
  },

  async upsertProgress(studentId, lessonId, completed) {
    const { rows } = await pool.query(
      `
      INSERT INTO student_lessons (student_id, lesson_id, completed)
      VALUES ($1, $2, $3)
      ON CONFLICT (student_id, lesson_id)
      DO UPDATE SET completed = EXCLUDED.completed
      RETURNING *;
      `,
      [studentId, lessonId, completed]
    );

    return rows[0];
  },

 async updateNotes(studentId, lessonId, notes) {
  const { rows } = await pool.query(
    `
    INSERT INTO student_lessons (student_id, lesson_id, notes)
      VALUES ($1, $2, $3)
      ON CONFLICT (student_id, lesson_id)
      DO UPDATE SET notes = EXCLUDED.notes
      RETURNING *;
    `,
    [studentId, lessonId, notes]
  );

  return rows;
}

};
