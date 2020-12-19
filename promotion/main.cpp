#include <iostream>
#include <nats/nats.h>
#include "handlers.hpp"
#include "clients/stan.hpp"

const int port = 5004;

int main() {
	natsOptions *nOpts       = nullptr;
	const char  *clusterName = "melting-pot";
	const char  *clientID    = "promotion";

	std::unique_ptr<clients::Stan> stan = std::make_unique<clients::Stan>(
		nOpts, 
		clusterName, 
		clientID
	);
	
	stan->Subscribe("durable-promo", "wallet_created");

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
