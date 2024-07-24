import { Request, Response } from "express";
import UserService from "../services/user.service";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  findUsers = async (request: Request, response: Response) => {
    const result = await this.userService.findUsersNoAdmin();

    response.status(response.statusCode).json(result);
  };

  findUserById = async (request: Request, response: Response) => {
    const id = request.params.id;
    const result = await this.userService.findUserById(Number(id));

    response.status(response.statusCode).json(result);
  };

  create = async (request: Request, response: Response) => {
    const id = request.params.id;
    const result = await this.userService.findUserById(Number(id));

    response.status(response.statusCode).json(result);
  };

  edit = async (request: Request, response: Response) => {
    const data = request.body;
    const id = request.params.id;
    const result = await this.userService.updateUserOrAdmin(data, Number(id));

    response.status(response.statusCode).json(result);
  };
}

export default UserController;
