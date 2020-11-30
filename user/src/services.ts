import { model } from "mongoose";
import { Schema } from "./models";
import { IApiError } from "./interfaces";
import { clients } from "./clients";
import { Event } from "../proto/event_store/event_store_pb";
import { ObjectId } from "mongodb";

export class UserService {
  private usersModel: any;
  private userOverviewModel: any;
  private eventstoreClient: clients.EventStore;
  constructor() {
    this.usersModel = model("users", Schema.User);
    this.userOverviewModel = model("useroverview", Schema.UserOverview);
    this.eventstoreClient = new clients.EventStore();
  }

  async CreateUser(req): Promise<[object | null, IApiError | null]> {
    try {
      const user = await this.usersModel.create({
        fullname: req.body.fullname,
      });

      const event = new Event();
      event.setName("user_created");
      event.setAggregateId(user._id.toString());
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
      const users = await this.userOverviewModel.find();
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

  async GetUser(req): Promise<[Record<string, any> | null, IApiError | null]> {
    try {
      const user = await this.userOverviewModel.findOne({
        userId: new ObjectId(req.params.userId),
      });
      return [user, null];
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
