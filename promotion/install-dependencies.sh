apk add make zlib-dev cmake

wget -O uSockets.zip https://github.com/uNetworking/uSockets/archive/master.zip
wget -O uWebSockets.zip https://github.com/uNetworking/uWebSockets/archive/master.zip

mkdir -p /usr/local/include

unzip uSockets.zip
unzip uWebSockets.zip

cd uSockets-master && make
cp ../uSockets-master/src/*.h /usr/local/include
cp ../uSockets-master/uSockets.a /usr/local/lib

cd ../uWebSockets-master && make install
rm -rf uSockets.zip uSockets-master uWebSockets.zip uWebSockets-master
