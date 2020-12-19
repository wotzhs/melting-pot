#ifndef WORKERS_H
#define WORKERS_H

#include <iostream>
#include <nlohmann/json.hpp>
#include <string_view>
#include "services.hpp"
#include "clients/event-store.hpp"

using json = nlohmann::json;
using EventStore = clients::EventStore;

namespace workers {
	void HandleWalletCreated(const char *data) {
		auto eventData = json::parse(std::string(data));
		auto code = std::string_view(eventData.value("code", ""));
		std::optional<int> reward = Services::ValidatePromoCode(code);
		if (reward) {
			json promoData = {
				{"wallet_id", eventData["wallet_id"]},
				{"user_id", eventData["user_id"]},
				{"reward", *reward},
			};

			EventStore eventPublisher = EventStore("[::1]:50051");

			event_store::Event event;
			event.set_name("promotion_applied");
			event.set_aggregate_id(eventData["user_id"]);
			event.set_aggregate_type("user");
			event.set_data(promoData.dump());
			event_store::EventResponse reply;

			grpc::Status res = eventPublisher.Publish(event, &reply);

			if (res.ok()) {
				std::cout << "processed event id: " << reply.event_id() << std::endl;
			}
			else {
				std::cout << res.error_code() << " : " << res.error_message() << std::endl;
			}
		}
	};
}

#endif
