import { Login, Register } from "../controllers/auth.controller.js";
import express from "express";;

const authRouter = express.Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);

export default authRouter;
