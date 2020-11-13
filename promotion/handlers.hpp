#ifndef HANDLERS_H
#define HANDLERS_H

#include <uWebSockets/App.h>
#include <string_view>
#include <nlohmann/json.hpp>
#include "services.hpp"

using json = nlohmann::json;

class Handlers {
public:
	static auto HandlePromoCodeValidation() {
		return [](auto *res, auto *req) {
			std::string_view code = req->getQuery("code");

			if (!code.size()) {
				res->end(json{{"status", false}}.dump());
			}

			bool status = Services::ValidatePromoCode(code);

			res->end(json{{"status", status}}.dump());
		};
	}
};

#endif
