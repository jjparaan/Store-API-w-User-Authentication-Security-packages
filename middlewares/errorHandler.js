// import { CustomAPIErrors } from "../errors/customAPI.js";
import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Oops! Something went wrong. Try again later.",
	};

	// if (err instanceof CustomAPIErrors) {
	// 	return res.status(err.statusCode).json({ msg: err.message });
	// }

	if (err.name === "CastError") {
		customError.msg = `No item found with the id of: ${err.value}`;
		customError.statusCode = StatusCodes.NOT_FOUND;
	}

	if (err.name === "ValidationError") {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(" ");
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}

	if (err.code && err.code === 11000) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`;
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}

	return res.status(customError.statusCode).json({ msg: customError.msg });
	// return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};
