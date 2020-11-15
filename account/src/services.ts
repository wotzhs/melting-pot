import { model } from "mongoose";
import { Schema } from "./models";
import { IApiError } from "./interfaces";
import Clients from "./clients";
import { Event } from "../proto/event_store/event_store_pb";

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

      const event = new Event();
      event.setName("account_created");
      event.setAggregateId(account._id);
      event.setAggregateType("user");
      event.setData(JSON.stringify(account));

      return await new Promise((resolve, reject) => {
        Clients.EventStore.publish(event, (err, resp) => {
          if (err) {
            reject(err);
          }
          console.log("procesed event:", resp.toObject());
          resolve([{ _id: account._id }, null]);
        });
      });
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
