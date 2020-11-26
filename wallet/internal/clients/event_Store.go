package clients

import (
	"log"
	"os"
	"proto/event_store"

	"google.golang.org/grpc"
)

var (
	EventStore event_store.EventStoreClient

	evStoreClientAddr string
)

func init() {
	if evStoreClientAddr = os.Getenv("EVENTSTORE_CLIENT_ADDR"); evStoreClientAddr == "" {
		evStoreClientAddr = "[::1]:50051"
	}
}

func RegisterGRPCClients() []*grpc.ClientConn {
	dialOpts := []grpc.DialOption{grpc.WithInsecure()}
	EventStoreConn, err := grpc.Dial(evStoreClientAddr, dialOpts...)
	if err != nil {
		log.Fatalf("failed to connect to event store client")
	}

	EventStore = event_store.NewEventStoreClient(EventStoreConn)
	return []*grpc.ClientConn{EventStoreConn}
}
