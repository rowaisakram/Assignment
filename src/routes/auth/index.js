import { Router } from "express";
import authController from "../../controller/auth/index.js";

const authRouter = Router();
authRouter.post("/auth/logup", authController.signup);
authRouter.post("/auth/login", authController.signin);

export default authRouter;
