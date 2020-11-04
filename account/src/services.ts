import { model } from "mongoose";
import { Schema } from "./models";
import { IApiError } from "./interfaces";

export class AccountService {
  private accountsModel: any;
  constructor() {
    this.accountsModel = model("accounts", Schema.Account);
  }

  async CreateAccount(req): Promise<[object | null, IApiError | null]> {
    try {
      const account = await this.accountsModel.create({
        fullname: req.body.fullname,
      });
      return [{ _id: account._id }, null];
    } catch (err) {
      return [
        null,
        {
          code: 500,
          type: "Internal",
          message: err.message,
        },
      ];
    }
  }

  async ListAccounts(req): Promise<[object[] | null, IApiError | null]> {
    try {
      const accounts = await this.accountsModel.find();
      return [accounts, null];
    } catch (err) {
      return [
        null,
        {
          code: 500,
          type: "Internal",
          message: err.message,
        },
      ];
    }
  }
}
