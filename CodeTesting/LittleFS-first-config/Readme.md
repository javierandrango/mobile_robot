# Description
LittleFS is a lightweight filesystem created for microcontrollers that lets you access the flash memory like you would do in a standard file system on your computer. You can read, write, close, and delete files and folders.


# Prerequisites
1. The code and configuration is based on ESP32 DOIT ESP32 DEVKIT V1 board
2. The project structure, directories, packages, and code were distributed using `Platformio IDE extension` configuration to work with `VScode`. An installation tutorial can be found [here](https://randomnerdtutorials.com/vs-code-platformio-ide-esp32-esp8266-arduino/)

# Usage
1. open file in directory and change code in explained in `Notes` section:
```
.pio > libdeps > esp32doit-devkit-v1 > LittleFS_esp32 > LITTLEFS.cpp
```
2. Upload files to the filesystem : 
```
PlatformIO > Platform > Build Filesystem
PlatformIO > Platform > Upload Filesystem
```
3. Upload code to esp32:
```
PlatformIO > General > Upload and Monitor
```
4. Once the test was completed, Press `CTRL + C` to exit monitor

# Notes
> [!NOTE]
> A compilation error occurs in the build process. The original library `LITTLEFS.cpp` was changed:

✖️ removed:
```cpp
bool LITTLEFSImpl::exists(const char* path)
{
    File f = open(path, "r");
    return (f == true);
}
```
✔️ changed:
```cpp
bool LITTLEFSImpl::exists(const char* path)
{
    File f = open(path, "r",false);
    return (f == true);
}
```
# Results:
![Alt text](/images/littlefs1.png)
![Alt text](/images/littlefs2.png)
![Alt text](/images/littlefs3.png)