#ifndef SERVICES_H
#define SERVICES_H

#include <unordered_map>
#include <string_view>

class Services {
public:
	static std::pair<bool, int> ValidatePromoCode(std::string_view promoCode) {
		std::unordered_map<std::string_view, int> validPromoCodes = {
			{"EARLYBIRD", 25},
			{"NOTSOEARLYBIRD", 5},
		};

		bool promoApplied = validPromoCodes.count(promoCode) > 0;
		int reward = promoApplied ? validPromoCodes[promoCode] : 0;

		return std::make_pair(promoApplied, reward);
	}
};

#endif
