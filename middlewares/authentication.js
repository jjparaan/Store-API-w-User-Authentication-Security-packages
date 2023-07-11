import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorized.js";

export const authenticationMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthorizedError(
			"Oops! Unauthorized user can't access this route"
		);
	}

	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = {
			userId: payload.userId,
			name: payload.name,
			empStatus: payload.empStatus,
			role: payload.role,
		};
		next();
	} catch (error) {
		throw new UnauthorizedError(
			"Authentication failed. Please contact your administrator"
		);
	}
};
