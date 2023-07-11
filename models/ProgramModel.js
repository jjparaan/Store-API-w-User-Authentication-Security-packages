import mongoose, { Schema } from "mongoose";

const ProgramSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: {
				values: ["offSeason", "preSeason", "inSeason", "rehab"],
				message: "{VALUE} is not supported",
			},
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		availability: {
			type: Boolean,
			default: true,
		},
		addedBy: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export const Program = mongoose.model("Program", ProgramSchema);
