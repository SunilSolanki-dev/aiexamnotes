import express from "express";
import isAuth from "../middleware/isAuth.js";
import { genrateNotes } from "../controllers/genrate.controller.js";
import { getMyNotes, getSingleNote } from "../controllers/notes.controller.js";

const notesRouter = express.Router();

notesRouter.post('/generate-notes',isAuth,genrateNotes);
notesRouter.get('/getnotes',isAuth,getMyNotes);
notesRouter.get('/:id',isAuth,getSingleNote);

export default notesRouter;