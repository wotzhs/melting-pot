#ifndef SERVICES_H
#define SERVICES_H

#include <string_view>

class Services {
public:
	static bool ValidatePromoCode(std::string_view s) {
		return s == "EARLYBIRD";
	}
};

#endif
