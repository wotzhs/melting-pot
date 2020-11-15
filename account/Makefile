.PHONY: default

SRCS=$(wildcard ./../proto/*/*.proto)
STUB=$(SRCS:.proto=*.d.ts)

default: clean $(STUB)

$(STUB): $(SRCS) 
	@protoc \
		-I../proto \
		-I/usr/local/include \
		--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
		--ts_out=../proto \
		$<
clean:
	rm -rf ${STUB}
