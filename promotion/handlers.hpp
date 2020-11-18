#ifndef HANDLERS_H
#define HANDLERS_H

#include <uWebSockets/App.h>
#include <string_view>
#include <nlohmann/json.hpp>
#include "services.hpp"
#include "clients.hpp"

using json = nlohmann::json;
using EventStore = clients::EventStore;

class Handlers {
public:
	static auto HandlePromoCodeValidation() {
		return [](auto *res, auto *req) {
			std::string_view code = req->getQuery("code");

			if (!code.size()) {
				res->end(json{{"status", false}}.dump());
			}

			bool status = Services::ValidatePromoCode(code);
			if (status) {
				EventStore eventPublisher = clients::EventStore("[::1]:50051");
				event_store::Event event;
				event.set_name("promotion_applied");
				event.set_aggregate_id("");
				event.set_aggregate_type("");
				event.set_data("");
				event_store::EventResponse reply;
				grpc::Status res = eventPublisher.Publish(event, &reply);
				if (res.ok())  {
					std::cout << "processed event id: " << reply.event_id() << std::endl;
				}
				else {
					std::cout << res.error_code() << " : " << res.error_message() << std::endl;
				}
			}

			res->end(json{{"status", status}}.dump());
		};
	}
};

#endif /* HANDLERS_H */
