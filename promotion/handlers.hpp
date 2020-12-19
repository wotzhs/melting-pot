#ifndef HANDLERS_H
#define HANDLERS_H

#include <nlohmann/json.hpp>
#include <uWebSockets/App.h>
#include <string_view>
#include "services.hpp"

using json = nlohmann::json;

namespace Handlers {
	auto HandlePromoCodeValidation() {
		return [](auto *res, auto *req) {
			std::string_view code = req->getQuery("code");

			if (!code.size()) {
				res->end(json{
					{"status", false},
					{"reward", 0},
				}.dump());
			}

			int reward = Services::ValidatePromoCode(code).value_or(0);

			res->end(json{
				{"status", reward != 0},
				{"reward", reward},
			}.dump());
		};
	}
};

#endif /* HANDLERS_H */
