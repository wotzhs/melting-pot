cmake_minimum_required(VERSION 3.17)

project(promotion)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(promotion main.cpp)
target_link_libraries(promotion z pthread :uSockets.a)
