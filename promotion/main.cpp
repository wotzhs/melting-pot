#include <iostream>
#include "handlers.hpp"

const int port = 5004;

int main() {
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
