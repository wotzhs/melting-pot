#ifndef HANDLERS_H
#define HANDLERS_H

#include <nlohmann/json.hpp>
#include <uWebSockets/App.h>
#include <string_view>
#include "services.hpp"

using json = nlohmann::json;

class Handlers {
public:
	static auto HandlePromoCodeValidation() {
		return [](auto *res, auto *req) {
			std::string_view code = req->getQuery("code");

			if (!code.size()) {
				res->end(json{
					{"status", false},
					{"reward", 0},
				}.dump());
			}

			std::pair<bool, int> status = Services::ValidatePromoCode(code);

			res->end(json{
				{"status", status.first},
				{"reward", status.second},
			}.dump());
		};
	}
};

#endif /* HANDLERS_H */
