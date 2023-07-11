import express from "express";
import {
	getPrograms,
	addProgram,
	searchProgram,
	getProgram,
	updateProgram,
	deleteProgram,
} from "../controller/ProgramController.js";

export const programRouter = express.Router();

programRouter.route("/").get(getPrograms).post(addProgram);
programRouter.route("/search").get(searchProgram);
programRouter
	.route("/:id")
	.get(getProgram)
	.patch(updateProgram)
	.delete(deleteProgram);
