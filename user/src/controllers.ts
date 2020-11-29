import { Request, Response } from "express";
import { Controller, Methods } from "./decorators";
import { UserService } from "./services";

@Controller("/users")
export class SignUpControlller {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @Methods.Get("/")
  async ListUsers(req: Request, res: Response) {
    const [resp, err] = await this.userService.ListUsers(req);
    if (err) {
      return res.status(err.code).send(err);
    }
    res.send(resp);
  }

  @Methods.Get("/:userId")
  async getUser(req: Request, res: Response) {
    const [resp, err] = await this.userService.GetUser(req);
    if (err) {
      return res.status(err.code).send(err);
    }
    res.send(resp);
  }

  @Methods.Post("/")
  async createUser(req: Request, res: Response) {
    const [resp, err] = await this.userService.CreateUser(req);
    if (err) {
      return res.status(err.code).send(err);
    }

    res.send(resp);
  }
}
