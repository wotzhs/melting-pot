import { Message } from "node-nats-streaming";
import { clients } from "./clients";

export namespace workers {
  export class Stan {
    constructor(private eventStoreClient: clients.EventStore) {}
    handleWalletCreated(message: Message) {}

    handleWalletUpdated(message: Message) {}

    handleCardCreated(message: Message) {}
  }
}
