import { ChannelCredentials, makeClientConstructor } from "@grpc/grpc-js";
import * as EventStoreGrpcPb from "../proto/event_store/event_store_grpc_pb";
import { Event } from "../proto/event_store/event_store_pb";
import { connect, StanOptions, Stan as StanClient } from "node-nats-streaming";
import { workers } from "./workers";
import axios, { Method, AxiosRequestConfig } from "axios";

export namespace clients {
  export class Swagger {
    constructor(
      private baseUrl?: string,
      private methodPath?: Record<string, Record<string, string>>
    ) {}

    static getService(serviceName: string): Swagger {
      let baseUrl: string;
      let methodPath: Record<string, Record<string, string>>;

      switch (serviceName) {
        case "apiCard":
          baseUrl = "localhost:5003";
          methodPath = {
            createCard: { method: "POST", path: "/" },
            getCard: { method: "GET", path: "/" },
          };
          break;

        case "apiWallet":
          baseUrl = "localhost:5001";
          methodPath = {
            initializeWallet: { method: "POST", path: "/" },
            updateWalletBalance: { method: "PUT", path: "/" },
            getWallet: { method: "GET", path: "/" },
          };
          break;

        case "apiPromotion":
          baseUrl = "localhost:5004";
          methodPath = {
            validatePromoCode: { method: "GET", path: "/" },
          };
          break;
      }
      return new Swagger(baseUrl, methodPath);
    }

    async api(operationId: string, payload: object): Promise<object> {
      try {
        const method = this.methodPath[operationId].method as Method;
        const config: AxiosRequestConfig = {
          method,
          url: `http://${this.baseUrl}${this.methodPath[operationId].path}`,
        };

        if (method === "POST" || "PUT") {
          config.data = payload;
        }

        if (method === "GET") {
          config.params = payload;
        }

        const res = await axios(config);
        return res.data;
      } catch (e) {
        return e;
      }
    }
  }

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

  export class Stan {
    private sc: StanClient;
    private clusterName: string;
    private clientId: string;
    private opts: StanOptions;

    constructor(clusterName?: string, clientId?: string, opts?: StanOptions) {
      this.clusterName = clusterName || "melting-pot";
      this.clientId = clientId || "user";
      this.opts = opts || {};
    }

    connectAndSubscribes() {
      this.sc = connect(this.clusterName, this.clientId, this.opts);
      this.sc.on("connect", () => {
        this.subscribes();
      });
    }

    subscribes() {
      const stanWorker = new workers.Stan();

      const opts = this.sc.subscriptionOptions();
      opts.setDeliverAllAvailable();
      opts.setDurableName("durable-user");

      const userCreatedSub = this.sc.subscribe("user_created", opts);
      userCreatedSub.on("message", async (msg) => {
        stanWorker.handleUserCreated(msg);
      });

      const walletCreatedSub = this.sc.subscribe("wallet_created", opts);
      walletCreatedSub.on("message", async (msg) => {
        stanWorker.handleWalletCreated(msg);
      });

      const walletUpdatedSub = this.sc.subscribe("wallet_updated", opts);
      walletUpdatedSub.on("message", async (msg) => {
        stanWorker.handleWalletUpdated(msg);
      });

      const cardCreatedSub = this.sc.subscribe("card_created", opts);
      cardCreatedSub.on("message", async (msg) => {
        stanWorker.handleCardCreated(msg);
      });
    }
  }
}
