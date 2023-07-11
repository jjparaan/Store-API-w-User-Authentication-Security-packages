import { CustomAPIErrors } from "./customAPI.js";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends CustomAPIErrors {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}
