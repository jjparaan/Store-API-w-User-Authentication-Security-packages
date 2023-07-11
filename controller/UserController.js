import { User } from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/badRequest.js";
import { UnauthorizedError } from "../errors/unauthorized.js";

export const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	const token = await user.createJWT();
	res.status(StatusCodes.CREATED).json({
		user: {
			name: user.name,
			empStatusS: user.empStatus,
			role: user.role,
		},
		token,
	});
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestError("Please provide an email and a password");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new UnauthorizedError("User does not exist");
	}

	const userPassword = await user.comparePassword(password);
	if (!userPassword) {
		throw new UnauthorizedError("Invalid credentials");
	}

	const token = await user.createJWT();
	res.status(StatusCodes.CREATED).json({
		user: {
			name: user.name,
			empStatusS: user.empStatus,
			role: user.role,
		},
		token,
	});
};
