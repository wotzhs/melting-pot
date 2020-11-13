mkdir -p /usr/local/include/nlohmann

wget -O uSockets.zip https://github.com/uNetworking/uSockets/archive/master.zip
wget -O uWebSockets.zip https://github.com/uNetworking/uWebSockets/archive/master.zip
wget -O /usr/local/include/nlohmann/json.hpp  https://github.com/nlohmann/json/releases/download/v3.9.1/json.hpp

unzip uSockets.zip
unzip uWebSockets.zip

cd uSockets-master && make
cp ../uSockets-master/src/*.h /usr/local/include
cp ../uSockets-master/uSockets.a /usr/local/lib

cd ../uWebSockets-master && make install
rm -rf uSockets.zip uSockets-master uWebSockets.zip uWebSockets-master
