import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export default class AuthController {
  login = async (request: Request, response: Response) => {
    const { credential, password } = request.body;
    const result = await authService.login(credential, password);
    response.status(result.statusCode).json(result);
  };
}
