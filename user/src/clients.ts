import { ChannelCredentials, makeClientConstructor } from "@grpc/grpc-js";
import * as EventStoreGrpcPb from "../proto/event_store/event_store_grpc_pb";
import { Event } from "../proto/event_store/event_store_pb";
import {
  connect,
  Message,
  StanOptions,
  Stan,
  SubscriptionOptions,
} from "node-nats-streaming";

export class EventStore {
  private client;
  constructor() {
    const EventStoreConsructor = makeClientConstructor(
      EventStoreGrpcPb["event_store.EventStore"],
      "EventStoreService"
    );
    this.client = new EventStoreConsructor(
      "[::1]:50051",
      ChannelCredentials.createInsecure()
    );
  }

  async publish(event: Event): Promise<object> {
    try {
      return await new Promise((resolve, reject) => {
        this.client.publish(event, (err, resp) => {
          if (err) {
            return reject(err);
          }
          resolve(resp.toObject());
        });
      });
    } catch (e) {
      console.log("failed to publish event", event);
      console.log("error", e);
      throw e;
    }
  }
}

export class StanClient {
  private sc: Stan;
  constructor() {
    const clusterName = "melting-pot";
    const clientId = "user";
    const opts: StanOptions = {};
    this.sc = connect(clusterName, clientId, opts);
    this.sc.on("connect", this.subscribes);
  }

  subscribes() {
    const stanWorker = new StanWorker();

    const opts = this.sc.subscriptionOptions();
    opts.setDurableName("durable-card");

    const walletCreatedSub = this.sc.subscribe("wallet_created", opts);
    walletCreatedSub.on("message", stanWorker.handleWalletCreated);

    const walletUpdatedSub = this.sc.subscribe("wallet_updated", opts);
    walletUpdatedSub.on("message", stanWorker.handleWalletUpdated);

    const cardCreatedSub = this.sc.subscribe("card_created", opts);
    cardCreatedSub.on("message", stanWorker.handleCardCreated);
  }
}
