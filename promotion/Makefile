.PHONY: default

SRCS=${wildcard ./../proto/**/*.proto}
GENERATED_PROTO_OUTDIR=proto

PROTO_LIBS=${wildcard proto/**/*.cc}
PROTO_OBJECT=${PROTO_LIBS:.cc=.o}

CPPFLAGS=`pkg-config --cflags protobuf grpc`
CXXFLAGS=-std=c++17
LDFLAGS=`pkg-config --libs protobuf grpc++`

COMPILED_OBJECTS=${wildcard *.o}
BIN_NAME=promotion

stub: ${SRCS}
	@rm -rf ${GENERATED_PROTO_OUTDIR}
	@mkdir ${GENERATED_PROTO_OUTDIR}
	@protoc \
	-I../proto \
	-I/usr/local/include \
	--plugin=protoc-gen-grpc=`which grpc_cpp_plugin` \
	--grpc_out=${GENERATED_PROTO_OUTDIR} \
	--cpp_out=${GENERATED_PROTO_OUTDIR} \
	$<

build: clean ${PROTO_OBJECT} main
	@echo "completed building, now run make link"

${PROTO_OBJECT}: %.o : %.cc
	${CXX} ${CXXFLAGS} ${CPPFLAGS} \
	 -I./${GENERATED_PROTO_OUTDIR} \
	 -c -o ${notdir $@} \
	 $<

main:
	@${CXX} ${CXXFLAGS} ${CPPFLAGS} -I./${GENERATED_PROTO_OUTDIR} -c -o main.o main.cpp

link: ${COMPILED_OBJECTS}
	@${CXX} ${CXXFLAGS} \
	$^ \
	-l:uSockets.a \
	-lz \
	-I/usr/local/include/uWebSockets \
	${LDFLAGS} \
	-o ${BIN_NAME}
	@echo "completed linking, now run ./promotion to start the service"

clean:
	rm -rf ${COMPILED_OBJECTS} ${BIN_NAME}
