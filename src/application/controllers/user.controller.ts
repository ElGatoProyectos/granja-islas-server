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

  async findUser(request: Request, response: Response) {}
}

export default UserController;
