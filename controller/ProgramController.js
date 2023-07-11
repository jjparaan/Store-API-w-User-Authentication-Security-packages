import { Program } from "../models/ProgramModel.js";
import { StatusCodes } from "http-status-codes";
import { UnauthorizedError } from "../errors/unauthorized.js";
import { BadRequestError } from "../errors/badRequest.js";
import { NotFoundError } from "../errors/notFound.js";

export const getPrograms = async (req, res) => {
	const programs = await Program.find({});
	res.status(StatusCodes.OK).json({ count: programs.length, programs });
};

export const addProgram = async (req, res) => {
	req.body.addedBy = req.user.name;
	const program = await Program.create(req.body);
	if (!program) {
		throw new BadRequestError("Please provide required input fields");
	}
	if (req.user.role !== "admin") {
		throw new UnauthorizedError(
			"You're not allowed to perform this action. Please contact your administrator"
		);
	}
	res.status(StatusCodes.CREATED).json({ program });
};

export const searchProgram = async (req, res) => {
	const { name, type, availability, numericFilters, sort, fields } = req.query;
	const queryObject = {};
	if (name) {
		queryObject.name = { $regex: name, $options: "i" };
	}
	if (type) {
		queryObject.type = { $regex: type, $options: "i" };
	}
	if (availability) {
		queryObject.availability = availability === "true" ? true : false;
	}
	if (numericFilters) {
		const operatorMap = {
			">": "$gt",
			">=": "$gte",
			"=": "$eq",
			"<": "$lt",
			"<=": "$lte",
		};
		const regEx = /\b(<|>|>=|=|<|<=)\b/g;
		let filters = numericFilters.replace(
			regEx,
			(match) => `-${operatorMap[match]}-`
		);
		const options = ["price"];
		filters = filters.split(",").forEach((item) => {
			const [field, operator, value] = item.split("-");
			if (options.includes(field)) {
				queryObject[field] = { [operator]: Number(value) };
			}
		});
	}
	let result = Program.find(queryObject);

	// sort based on query || name
	if (sort) {
		const sortList = sort.split(",").join(" ");
		result = result.sort(sortList);
	} else {
		result = result.sort(name);
	}

	// select based on props
	if (fields) {
		const fieldsList = fields.split(",").join(" ");
		result = result.select(fieldsList);
	}

	// pagination
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	result = result.skip(skip).limit(limit);

	const programs = await result;
	res.status(StatusCodes.OK).json({ count: programs.length, programs });
};

export const getProgram = async (req, res) => {
	const { id: programId } = req.params;
	const program = await Program.findOne({ _id: programId });
	if (!program) {
		throw new NotFoundError("We couldn't find the program you're looking for");
	}

	res.status(StatusCodes.OK).json({ program });
};

export const updateProgram = async (req, res) => {
	const { id: programId } = req.params;
	const { name, type, price } = req.body;
	if (name === "" || type === "" || price === "") {
		throw new BadRequestError("Name, Type, and Price fields cannot be empty");
	}

	const program = await Program.findOneAndUpdate({ _id: programId }, req.body, {
		new: true,
		runValidators: true,
	});
	if (!program) {
		throw new NotFoundError(
			"We couldn't update the program you're looking for"
		);
	}
	if (req.user.role !== "admin") {
		throw new UnauthorizedError(
			"You're not allowed to perform this action. Please contact your administrator"
		);
	}
	res.status(StatusCodes.OK).json({ program });
};

export const deleteProgram = async (req, res) => {
	const { id: programId } = req.params;
	const program = await Program.findOneAndDelete({ _id: programId });
	if (!program) {
		throw new NotFoundError(
			"The program that you're trying to delete is already non-existent"
		);
	}
	if (req.user.role !== "admin") {
		throw new UnauthorizedError(
			"You're not allowed to perform this action. Please contact your administrator"
		);
	}
	res
		.status(StatusCodes.OK)
		.json({ msg: `Program: ${programId} have been successfully deleted` });
};
