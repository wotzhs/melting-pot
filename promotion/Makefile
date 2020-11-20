.PHONY: default

SRCS=${wildcard ./../proto/*/*.proto}
GENERATED_PROTO_OUTDIR=proto

PROTO_LIBS=${wildcard proto/**/*.cc}
PROTO_OBJECT=${PROTO_LIBS:.cc=.o}

CPPFLAGS=`pkg-config --cflags protobuf grpc`
CXXFLAGS=-std=c++17
LDFLAGS=`pkg-config --libs protobuf grpc++`

COMPILED_OBJECTS=${wildcard *.o}
BIN_NAME=promotion

build: clean stub ${PROTO_OBJECT} main

stub: ${SRCS}
	@mkdir ${GENERATED_PROTO_OUTDIR}
	@protoc \
	-I../proto \
	-I/usr/local/include \
	--plugin=protoc-gen-grpc=`which grpc_cpp_plugin` \
	--grpc_out=${GENERATED_PROTO_OUTDIR} \
	--cpp_out=${GENERATED_PROTO_OUTDIR} \
	$<

${PROTO_OBJECT}: ${PROTO_LIBS}
	@${CXX} ${CXXFLAGS} ${CPPFLAGS} \
	 -I./${GENERATED_PROTO_OUTDIR} \
	 -c -o ${notdir $@} \
	 ${basename $@}.cc

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

clean:
	rm -rf ${GENERATED_PROTO_OUTDIR} ${COMPILED_OBJECTS} ${BIN_NAME}
