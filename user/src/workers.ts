import { Message } from "node-nats-streaming";
import { model } from "mongoose";
import { Schema } from "./models";

export namespace workers {
  export class Stan {
    private userOverviewModel: any;
    constructor() {
      this.userOverviewModel = model("useroverview", Schema.UserOverview);
    }

    async handleUserCreated(message: Message) {
      console.log("received message subject:", message.getSubject());
      console.log("data:", message.getData());

      try {
        const eventData = JSON.parse(
          Buffer.from(message.getRawData()).toString()
        );
        await this.userOverviewModel.updateOne(
          { userId: eventData.id },
          { userId: eventData.id },
          { upsert: true }
        );
      } catch (e) {
        console.log(e);
      }
    }

    async handleWalletCreated(message: Message) {
      console.log("received message subject:", message.getSubject());
      console.log("data:", message.getData());

      try {
        const eventData = JSON.parse(
          Buffer.from(message.getRawData()).toString()
        );
        await this.userOverviewModel.updateOne(
          { userId: eventData.user_id },
          { walletId: eventData.wallet_id },
          { upsert: true }
        );
      } catch (e) {
        console.log(e);
      }
    }

    async handleWalletUpdated(message: Message) {
      console.log("received message subject:", message.getSubject());
      console.log("data:", message.getData());

      try {
        const eventData = JSON.parse(
          Buffer.from(message.getRawData()).toString()
        );
        await this.userOverviewModel.updateOne(
          { walletId: eventData.wallet_id },
          { walletBalance: eventData.balance },
          { upsert: true }
        );
      } catch (e) {
        console.log(e);
      }
    }

    async handleCardCreated(message: Message) {
      console.log("received message subject:", message.getSubject());
      console.log("data:", message.getData());

      try {
        const eventData = JSON.parse(
          Buffer.from(message.getRawData()).toString()
        );
        await this.userOverviewModel.updateOne(
          { userId: eventData.user_id },
          { cardNumber: eventData.number },
          { upsert: true }
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
}
