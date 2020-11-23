#ifndef CLIENTS_H
#define CLIENTS_H

#include <iostream>
#include <grpc++/create_channel.h>
#include "../proto/event_store/event_store.grpc.pb.h"
#include "../proto/event_store/event_store.pb.h"

using namespace grpc;

namespace clients {

class EventStore {
	std::unique_ptr<event_store::EventStore::Stub> stub_;
public:
	EventStore(std::string addr) {
		std::shared_ptr<Channel> ch = CreateChannel(addr, InsecureChannelCredentials());
		stub_ = event_store::EventStore::NewStub(ch);
	};

	Status Publish(event_store::Event &event, event_store::EventResponse *resp) {
		ClientContext ctx;
		return stub_->Publish(&ctx, event, resp);
	}
}; // EvcentStore


}; // clients

#endif /* CLIENTS_H */
