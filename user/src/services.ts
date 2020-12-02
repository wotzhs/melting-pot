import { model } from "mongoose";
import { Schema } from "./models";
import { IApiError, ISwaggerClient } from "./interfaces";
import { clients } from "./clients";
import { Event } from "../proto/event_store/event_store_pb";
import { ObjectId } from "mongodb";

export class UserService {
  private usersModel: any;
  private cardService: ISwaggerClient;
  private walletService: ISwaggerClient;
  private promotionService: ISwaggerClient;

  constructor() {
    this.usersModel = model("users", Schema.User);
    this.cardService = clients.Swagger.getService("apiCard");
    this.walletService = clients.Swagger.getService("apiWallet");
    this.promotionService = clients.Swagger.getService("apiPromotion");
  }

  async CreateUser(req): Promise<[object | null, IApiError | null]> {
    try {
      const user = await this.usersModel.create({
        fullname: req.body.fullname,
      });

      await this.cardService.api("createCard", {
        user_id: user._id.toString(),
      });

      const wallet: any = await this.walletService.api("initializeWallet", {
        user_id: user._id.toString(),
      });

      const promo: any = await this.promotionService.api("validatePromoCode", {
        code: req.body.code,
      });

      if (promo.status) {
        await this.walletService.api("updateWalletBalance", {
          wallet_id: wallet.id,
          reward: promo.reward,
        });
      }

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
      const res = [];

      for (const user of users) {
        const card: any = await this.cardService.api("getCard", {
          user_id: user._id.toString(),
        });

        const wallet: any = await this.walletService.api("getWallet", {
          user_id: user._id.toString(),
        });

        res.push({
          userId: user._id.toString(),
          fullname: user.fullname,
          walletId: wallet[0]?.id,
          walletBalance: wallet[0]?.balance,
          cardNumber: card[0]?.number,
        });
      }

      return [res, null];
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
      const user = await this.usersModel.findOne({
        _id: new ObjectId(req.params.userId),
      });

      const card: any = await this.cardService.api("getCard", {
        user_id: user._id.toString(),
      });

      const wallet: any = await this.walletService.api("getWallet", {
        user_id: user._id.toString(),
      });

      return [
        {
          userId: user._id.toString(),
          fullname: user.fullname,
          walletId: wallet[0].id,
          walletBalance: wallet[0].balance,
          cardNumber: card[0].number,
        },
        null,
      ];
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
