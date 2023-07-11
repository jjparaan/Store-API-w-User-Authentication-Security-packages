import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		empStatus: {
			type: String,
			enum: {
				values: ["inactive", "active"],
				message: "{VALUE} is not supported",
			},
			required: true,
		},
		role: {
			type: String,
			enum: {
				values: ["admin", "staff"],
				message: "{VALUE} is not supported",
			},
			required: true,
		},
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{
			userId: this._id,
			name: this.name,
			empStatus: this.empStatus,
			role: this.role,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_LIFETIME,
		}
	);
};

UserSchema.methods.comparePassword = async function (inputPassword) {
	const isPasswordMatch = await bcrypt.compare(inputPassword, this.password);
	return isPasswordMatch;
};

export const User = mongoose.model("User", UserSchema);
