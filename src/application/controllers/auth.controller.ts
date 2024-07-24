import { Request, Response } from "express";
import AuthService from "../services/auth.service";

export default class AuthController {
  private authService: AuthService = new AuthService();

  login = async (request: Request, response: Response) => {
    const { credential, password } = request.body;
    const result = await this.authService.login(credential, password);
    response.status(result.statusCode).json(result);
  };
}
