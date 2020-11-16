.PHONY: default

SRCS=$(wildcard ../proto/*/*.proto)
STUB=$(SRCS:.proto=.rs)
GENERATED_PROTO_OUTDIR=src

default: clean $(STUB)

$(STUB): $(SRCS)
	@protoc \
	-I../proto \
	-I/usr/local/include \
	--plugin=protoc-gen-grpc=`which grpc_rust_plugin` \
	--rust_out=${GENERATED_PROTO_OUTDIR} \
	--grpc_out=${GENERATED_PROTO_OUTDIR} \
	$<

clean:
	rm -rf $(STUB)
