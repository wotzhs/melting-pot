import { ChannelCredentials, makeClientConstructor } from "@grpc/grpc-js";
import * as EventStoreGrpcPb from "../proto/event_store/event_store_grpc_pb";
import { Event } from "../proto/event_store/event_store_pb";

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
