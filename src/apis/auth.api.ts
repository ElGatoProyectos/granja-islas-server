import express from "express";
import { validateMiddleware } from "../middlewares/validate-body.middleware";
import { authController } from "../controllers/auth.controller";

const authRouter = express.Router();

const prefix = "/auth";

authRouter.post(
  `${prefix}/login`,
  validateMiddleware.validateAuth,
  authController.login
);

export default authRouter;
