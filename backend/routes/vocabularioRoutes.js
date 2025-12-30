import { Router } from "express";
import { vocabularioController } from "../controllers/vocabularioController.js";

const router = Router();

// GET y POST
router.route("/:lessonId")
    .get(vocabularioController)
    .post(vocabularioController);

// DELETE
router.delete("/:lessonId/:palabra", vocabularioController);

export default router;
