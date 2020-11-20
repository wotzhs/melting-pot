SRCS=$(wildcard ./../proto/*/*.proto)
STUB=$(SRCS:.proto=.pb.go)

default: clean $(STUB)

$(STUB): %.pb.go: %.proto
	@protoc \
	-I../proto \
	-I/usr/local/include \
	--go_out=plugins=grpc:.. \
	$<

clean:
	rm -rf $(STUB)
