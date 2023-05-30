// IMPORTS
import express from "express";
import { getAllNotes, createNewNote, updateNote, deleteNote } from "../controllers/noteController.js";
// CONFIGURATION
const router = express.Router();

// ROUTES
router.route("/")
    .get(getAllNotes)
    .post(createNewNote)
    .patch(updateNote)
    .delete(deleteNote);

export default router;