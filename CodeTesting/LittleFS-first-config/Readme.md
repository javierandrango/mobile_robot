# Description 
Upload Files to Filesystem (LittleFS)
# Prerequisites
1. The code and configuration is based on ESP32 DOIT ESP32 DEVKIT V1 board
2. The project structure, directories, packages and code were distributed using `Platformio IDE extension` configuration to work with `VScode`. An instalation tutorial ca be found [here](https://randomnerdtutorials.com/vs-code-platformio-ide-esp32-esp8266-arduino/)
3. This example was developed following isues found by other users : 
    - forum discussion: https://community.platformio.org/t/esp32-little-fs-implementation/28803
    - github code example: https://github.com/espressif/arduino-esp32/blob/2.0.4/libraries/LittleFS/examples/LITTLEFS_PlatformIO/src/main.cpp
    - folder and .txt file : https://github.com/espressif/arduino-esp32/tree/2.0.4/libraries/LittleFS/examples/LITTLEFS_PlatformIO/data
    - complilation error: https://github.com/lorol/LITTLEFS/issues/43
        ```
        File f = open(path, "r", false);
        ```
