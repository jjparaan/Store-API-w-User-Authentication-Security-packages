import { CustomAPIErrors } from "./customAPI.js";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends CustomAPIErrors {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}
