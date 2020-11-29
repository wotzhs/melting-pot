.PHONY: default

SRCS=$(wildcard ./../proto/*/*.proto)
STUB=$(SRCS:.proto=.d.ts)
GENERATED_PROTO_OUTDIR=proto

default: clean $(STUB)

$(STUB): $(SRCS) 
	@mkdir ${GENERATED_PROTO_OUTDIR}
	@protoc \
		-I../proto \
		-I/usr/local/include \
		--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
		--plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin\
		--js_out=import_style=commonjs,binary:${GENERATED_PROTO_OUTDIR} \
		--grpc_out=generate_package_definition:${GENERATED_PROTO_OUTDIR} \
		--ts_out=generate_package_definition:${GENERATED_PROTO_OUTDIR} \
		$<
clean:
	rm -rf ${GENERATED_PROTO_OUTDIR}
