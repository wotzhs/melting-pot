.PHONY: default

SRCS=$(wildcard ./../proto/*/*.proto)
GENERATED_PROTO_OUTDIR=proto

default: clean stub

stub: $(SRCS)
	@mkdir ${GENERATED_PROTO_OUTDIR}
	@protoc \
	-I../proto \
	-I/usr/local/include \
	--plugin=protoc-gen-grpc=`which grpc_cpp_plugin` \
	--grpc_out=${GENERATED_PROTO_OUTDIR} \
	--cpp_out=${GENERATED_PROTO_OUTDIR} \
	$<

clean:
	rm -rf ${GENERATED_PROTO_OUTDIR}
