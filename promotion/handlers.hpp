#ifndef HANDLERS_H
#define HANDLERS_H

#include <iostream>
#include <uWebSockets/App.h>

class Handlers {
public:
	static auto HandlePromoCodeValidation() {
		return [](auto *res, auto req) {
			res->end("Hello world");
		};
	}
};

#endif
