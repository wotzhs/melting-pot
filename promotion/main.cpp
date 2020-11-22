#include <iostream>
#include "handlers.hpp"

const int port = 5004;

int main() {
	natsOptions *nOpts       = nullptr;
	const char  *clusterName = "melting-pot";
	const char  *clientID    = "promotion";

	std::unique_ptr<Stan> stan = std::unique_ptr<Stan>(new Stan(
		nOpts, 
		clusterName, 
		clientID
	));
	
	stan->Subscribe("durable-promo", "wallet.created");

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
