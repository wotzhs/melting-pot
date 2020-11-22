#ifndef CLIENTS_H
#define CLIENTS_H

#define NATS_HAS_STREAMING true
#include <iostream>
#include <grpc++/create_channel.h>
#include <nats/nats.h>
#include <iostream>
#include "proto/event_store/event_store.grpc.pb.h"
#include "proto/event_store/event_store.pb.h"
#include "workers.hpp"

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

class Stan {
	natsStatus s;
	stanConnOptions    *connOpts   =   nullptr;
	stanSubOptions     *subOpts    =   nullptr;
	stanConnection     *sc         =   nullptr;
	stanSubscription   *sub        =   nullptr;
	bool               connLost    =   false;
public:
	Stan(natsOptions *opts, const char* cluster, const char* clientID) {
		s = stanConnOptions_Create(&connOpts);
		if (s == NATS_OK) {
			s = stanConnOptions_SetNATSOptions(connOpts, opts);
		}

		if (s == NATS_OK) {
			s = stanConnOptions_SetConnectionLostHandler(connOpts, connectionLostCallBack, &connOpts);
		}

		if (s == NATS_OK) {
			s = stanConnection_Connect(&sc, cluster, clientID, connOpts);
		}

		natsOptions_Destroy(opts);
		stanConnOptions_Destroy(connOpts);
	}

	~Stan() {
		stanSubscription_Close(sub);
		stanSubscription_Destroy(sub);
		stanConnection_Destroy(sc);
		nats_Close();
	}

	void Subscribe(const char* durableName, const char* subject) {
		if (s == NATS_OK) {
			s = stanSubOptions_Create(&subOpts);
		}

		if (s == NATS_OK) {
			s = stanSubOptions_SetDurableName(subOpts, durableName);
		}

		if (s == NATS_OK) {
			s = stanSubOptions_StartWithLastReceived(subOpts);
		}

		if (s == NATS_OK) {
			s = stanConnection_Subscribe(&sub, sc, subject, onMessage, NULL, subOpts);
		}

		stanSubOptions_Destroy(subOpts);
	}

private:
	static void connectionLostCallBack(stanConnection *sc, const char *errText, void *closure) {
		bool *connLost = (bool*) closure;
		std::cout << "connection lost: " << errText << std::endl;
		*connLost = true;
	}

	static void onMessage(stanConnection *sc, stanSubscription *sub, const char *channel, stanMsg *msg, void *closure) {
		printf("Received on [%s]: sequence: %" PRIu64 " data: %.*s timestamp: %" PRId64 " redelivered: %s\n",
			channel,
			stanMsg_GetSequence(msg),
			stanMsg_GetDataLength(msg),
			stanMsg_GetData(msg),
			stanMsg_GetTimestamp(msg),
			stanMsg_IsRedelivered(msg) ? "yes" : "no"
		);

		if (std::string(channel) == "wallet.created") {

		}

		stanMsg_Destroy(msg);
	}
}; // Stan

}; // clients

#endif /* CLIENTS_H */
