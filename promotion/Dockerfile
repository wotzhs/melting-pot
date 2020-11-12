FROM frolvlad/alpine-gxx:latest AS builder

COPY . .

RUN ./install-dependencies.sh

RUN mkdir build && cd build && cmake .. && make

FROM frolvlad/alpine-gxx:latest

COPY --from=builder /build/promotion .

ENTRYPOINT ./promotion
