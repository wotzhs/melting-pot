import { Message } from "node-nats-streaming";
import { model } from "mongoose";
import { Schema } from "./models";

export namespace workers {
  export class Stan {
    private userOverviewModel: any;
    constructor() {
      this.userOverviewModel = model("UserOverview", Schema.UserOverview);
    }

    handleWalletCreated(message: Message) {
      console.log("received message", message.getSubject(), message.getData());
    }

    handleWalletUpdated(message: Message) {
      console.log("received message", message.getSubject(), message.getData());
    }

    handleCardCreated(message: Message) {
      console.log("received message", message.getSubject(), message.getData());
    }
  }
}
