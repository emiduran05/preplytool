import { StudentLesson } from "../models/studentLesson.model.js";

export const getStudentLessons = async (req, res) => {
  try {
    const { studentId } = req.params;
    const data = await StudentLesson.getByStudent(studentId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching student lessons" });
  }
};

export const updateLessonStatus = async (req, res) => {
  try {
    // 🔍 DEBUG
    console.log("BODY RECIBIDO:", req.body);

    const { student_id, lesson_id, completed } = req.body;

    // ✅ Validaciones fuertes
    if (
      student_id === undefined ||
      lesson_id === undefined ||
      completed === undefined
    ) {
      return res.status(400).json({
        error: "Datos incompletos",
        received: req.body
      });
    }

    // ⚠️ Forzar tipos correctos
    const parsedStudentId = Number(student_id);
    const parsedLessonId = Number(lesson_id);
    const parsedCompleted = Boolean(completed);

    if (isNaN(parsedStudentId) || isNaN(parsedLessonId)) {
      return res.status(400).json({
        error: "IDs inválidos",
        received: {
          student_id,
          lesson_id
        }
      });
    }

    // ✅ Guardar en BD
    const result = await StudentLesson.upsertProgress(
      parsedStudentId,
      parsedLessonId,
      parsedCompleted
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error en updateLessonStatus:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
      details: error.message
    });
  }
};

export const updateLessonNotes = async (req, res) => {
  try {
    const { student_id, lesson_id, notes } = req.body;

    const result = await StudentLesson.updateNotes(
      student_id,
      lesson_id,
      notes
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error updating notes" });
  }
};
