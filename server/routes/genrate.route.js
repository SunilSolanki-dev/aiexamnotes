import express from "express";
import isAuth from "../middleware/isAuth.js";
import { genrateNotes } from "../controllers/genrate.controller.js";

const notesRouter = express.Router();

notesRouter.post('/generate-notes',isAuth,genrateNotes);

export default notesRouter;