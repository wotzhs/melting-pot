# Melting Pot

This is a project for the demonstration of event-driven architecture + event sourcing + CQRS vs request driven architecture.

The name Melting Pot is chosen to represent the different languages and technologies used in making this project.

## Overview

```
				   nats	                =------=                    nats
				    +--------------->   | card |  <------------------+
				    |   	        =------=                     |
				    |  	                   |                         |
				    | 		           | grpc                    |
                                    v                      v                         v
=---------------=     <---      =------=    --->    =-------------=    <---    =-----------=
| other sources |   GET, POST   | user |    grpc    | event-store |    grpc    | promotion |
=---------------=     --->      =------=            =-------------=            =-----------=
                                    ^                      ^                         ^
				    | 			   | grpc                    |
				    |  			   |                         |
				    |                 =--------=                     |
				    +-------------->  | wallet |  <------------------+
				  nats		      =--------=                    nats
```
