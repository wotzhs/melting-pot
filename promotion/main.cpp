#include <iostream>
#include "handlers.hpp"
#include "workers.hpp"

const int port = 5004;

int main() {
	natsOptions *nOpts = nullptr;
	std::unique_ptr<Stan> s = std::unique_ptr<Stan>(new Stan(nOpts, "test", "promotion"));
	s->Subscribe("durable-promo", "wallet.created");
	uWS::App()
		.get("/*", Handlers::HandlePromoCodeValidation())
		.listen(port, [](auto *token) {
			if (token) {
				std::cout << "Listening on port: " << port << "\n";
			}
		})
		.run();

	std::cout << "Failed to listen on port" << port << "\n";
}
