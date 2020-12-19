#ifndef SERVICES_H
#define SERVICES_H

#include <unordered_map>
#include <string_view>

namespace Services {
	std::optional<int> ValidatePromoCode(std::string_view promoCode) {
		std::unordered_map<std::string_view, int> validPromoCodes = {
			{"EARLYBIRD", 25},
			{"NOTSOEARLYBIRD", 5},
		};

		auto promo = validPromoCodes.find(promoCode);
		if (promo != validPromoCodes.end()) {
			return std::optional<int>{promo->second};
		}

		return std::nullopt;
	}
};

#endif
