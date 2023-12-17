# Description
Send data from client HTML to ESP32 server to activate internal led
# Prerequisites
1. The code and configuration is based on ESP32 DOIT ESP32 DEVKIT V1 board
2. The project structure, directories, packages and code were distributed using `Platformio IDE extension` configuration to work with `VScode`. An instalation tutorial ca be found [here](https://randomnerdtutorials.com/vs-code-platformio-ide-esp32-esp8266-arduino/)

# Usage

# Notes
[!NOTE]
A compilation error occurs in build process. The original library `LITTLEFS.h` was changed:

:multiply: removed:
```cpp
bool LITTLEFSImpl::exists(const char* path)
{
    File f = open(path, "r");
    return (f == true);
}
```
:check_mark: added:
```cpp
bool LITTLEFSImpl::exists(const char* path)
{
    File f = open(path, "r",false);
    return (f == true);
}
```
