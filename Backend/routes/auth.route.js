import { Login, Register, Logout } from "../controllers/auth.controller.js";
import express from "express";;
import  authMiddleware  from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/logout", authMiddleware, Logout);

export default authRouter;
