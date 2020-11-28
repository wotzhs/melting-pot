import { model } from "mongoose";
import { Schema } from "./models";
import { IApiError } from "./interfaces";
import { EventStore } from "./clients";
import { Event } from "../proto/event_store/event_store_pb";

export class UserService {
  private usersModel: any;
  private eventstoreClient: EventStore;
  constructor() {
    this.usersModel = model("users", Schema.User);
    this.eventstoreClient = new EventStore();
  }

  async CreateUser(req): Promise<[object | null, IApiError | null]> {
    try {
      const user = await this.usersModel.create({
        fullname: req.body.fullname,
      });

      const event = new Event();
      event.setName("user_created");
      event.setAggregateId(user._id);
      event.setAggregateType("user");
      event.setData(
        JSON.stringify({
          ...user.toJSON(),
          code: req.body.code,
        })
      );

      const resp = await this.eventstoreClient.publish(event);
      console.log("procesed event:", resp);

      return [{ _id: user._id }, null];
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

  async ListUsers(req): Promise<[object[] | null, IApiError | null]> {
    try {
      const users = await this.usersModel.find();
      return [users, null];
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