import dotenv from "dotenv";
import express from "express";
import expressAsyncErrors from "express-async-errors";
import { connectDB } from "./db/connectDB.js";
import { userRouter } from "./routes/UserRoute.js";
import { programRouter } from "./routes/ProgramRoute.js";
import { pageNotFoundMiddleware } from "./middlewares/pageNotFound.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.js";
import { authenticationMiddleware } from "./middlewares/authentication.js";
//  security packages
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import rateLimiter from "express-rate-limit";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 100,
	})
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/programs", authenticationMiddleware, programRouter);

app.use(pageNotFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(PORT, () => {
			console.log(`Server running on port: ${PORT}...`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
