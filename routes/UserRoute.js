import express from "express";
import { register, login } from "../controller/UserController.js";

export const userRouter = express.Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
