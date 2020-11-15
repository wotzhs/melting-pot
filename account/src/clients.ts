import grpc from "grpc";
import { EventStoreClient } from "../proto/event_store/event_store_grpc_pb";

export default class Clients {
  static readonly EventStore = new EventStoreClient(
    "[::1]:50051",
    grpc.credentials.createInsecure()
  );
}
