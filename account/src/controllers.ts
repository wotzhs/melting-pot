import { Request, Response } from "express";
import { Controller, Methods } from "./decorators";
import { AccountService } from "./services";

@Controller("/accounts")
export class SignUpControlller {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  @Methods.Get("/")
  async ListAccounts(req: Request, res: Response) {
    const [resp, err] = await this.accountService.ListAccounts(req);
    if (err) {
      return res.status(err.code).send(err);
    }
    res.send(resp);
  }

  @Methods.Post("/")
  async createAccount(req: Request, res: Response) {
    const [resp, err] = await this.accountService.CreateAccount(req);
    if (err) {
      return res.status(err.code).send(err);
    }

    res.send(resp);
  }
}
