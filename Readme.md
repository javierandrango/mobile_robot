# Mobile robot V1
![MasterHead](/images/pic1.png)
## Description
Simple mobile robot V1 (2 wheels - differential drive, no speed or odometry control yet)

## Visuals
1. Online 3d view:
    
    [https://a360.co/40Kuyd2](https://a360.co/40Kuyd2)

2. CAD files:

    [https://drive.google.com/drive/folders/1M69HTk2GCreNo5gZyHasRZGGF5HsqhyY?usp=sharing](https://drive.google.com/drive/folders/1M69HTk2GCreNo5gZyHasRZGGF5HsqhyY?usp=sharing)

## General Prerequisites
1. for the first time using ESP32-DEVKITV1, CP210x USB to UART Bridge Virtual COM Port (VCP) drivers are required for device operation. Download compatible driver from:

    [https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads)

2. Bluetooth controller app (Play Store):

    Arduino Bluetooth Controlled J - Uncia Robotics.\
    [https://play.google.com/store/apps/details?id=uncia.robotics.joystick&hl=es_PY&gl=US](https://play.google.com/store/apps/details?id=uncia.robotics.joystick&hl=es_PY&gl=US)

## Usage

The code and configuration is based on ESP32 `DOIT ESP32 DEVKIT V1` board

1. `mobileRobotv1(arduino IDE)`:
    - Install ESP32 board into Arduino IDE:
    - Go to: /Preferences/Additional boards manager URLs/ and add the espressif board list:
    ```
    https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
    ```
    - Go to: Tools/Board/Board Manager/ and Filter search by ESP32 to install boards
    - espressif/arduino-esp32 libraries:
    ```
    BluetoothSerial.h
    ```
2. Copy/download code
3. Select board `DOIT ESP32 DEVKIT V1` and `port`
4. Upload code
5. Pair ESP32 Bluetooth `ROBOT` in the phone and connect the app
## Support
```
lab_iarobotico593@outlook.com
```
## Project status
In development 

