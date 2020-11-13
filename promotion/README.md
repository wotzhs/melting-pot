# Promotion

This service manages the promotion rules.

## Getting started

This service is currently kept at the very basic level, available routes are as follow:

```
GET /?code=&lt;promo code&gt;  -- returns {"status": bool}
```

### Running the service

This service requires g++ compiler that supports c++17 compilation, which may not be commonly available in most of the distro/operating system out there.

To ease the compilation, docker is used for compilation and subsequently running the compiled binary.

Further a docker-compose is added for easier command execution.

Thus, from the service root directory, simply enter the following command to get the app running:

```shell
docker-compose up -d
```
