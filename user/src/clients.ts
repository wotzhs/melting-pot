import { ChannelCredentials, makeClientConstructor } from "@grpc/grpc-js";
import * as EventStoreGrpcPb from "../proto/event_store/event_store_grpc_pb";

const EventStoreConsructor = makeClientConstructor(
  EventStoreGrpcPb["event_store.EventStore"],
  "EventStoreService"
);

export default class Clients {
  static readonly EventStore = new EventStoreConsructor(
    "[::1]:50051",
    ChannelCredentials.createInsecure()
  );
}
