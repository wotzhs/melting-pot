import { model } from "mongoose";
import { Schema } from "./models";
export class AccountService {
  private memberModel: any;
  constructor() {
    this.memberModel = model("accounts", Schema.Account);
  }

  async CreateAccount(req) {
    try {
      const member = await this.memberModel.create({
        fullname: req.body.fullname,
      });
      return [{ _id: member._id }, null];
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
