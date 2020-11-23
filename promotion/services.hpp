#ifndef SERVICES_H
#define SERVICES_H

#include <unordered_map>
#include <string_view>

class Services {
public:
	static std::pair<bool, int> ValidatePromoCode(std::string_view s) {
		std::unordered_map<std::string_view, int> mp = {
			{"EARLYBIRD", 25},
			{"NOTSOEARLYBIRD", 5},
		};

		bool promoApplied = mp.count(s) > 0;
		int reward = promoApplied ? mp[s] : 0;

		return std::make_pair(promoApplied, reward);
	}
};

#endif
