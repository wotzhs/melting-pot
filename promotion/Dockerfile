# App build
FROM frolvlad/alpine-gxx:latest AS builder

RUN apk add make zlib-dev cmake

COPY . .

RUN ./install-dependencies.sh && \
	mkdir build && \
	cd build && \
	cmake .. && \
	make

# App Execution
FROM frolvlad/alpine-gxx:latest

COPY --from=builder /build/promotion .

ENTRYPOINT ./promotion
