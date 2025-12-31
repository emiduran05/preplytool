import express from "express";
import {
  getStudentLessons,
  updateLessonStatus,
  updateLessonNotes
} from "../controllers/studentLesson.controller.js";

const router = express.Router();

router.get("/:studentId", getStudentLessons);
router.post("/update", updateLessonStatus);
router.post("/notes", updateLessonNotes);

export default router;
