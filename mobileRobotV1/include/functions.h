#ifndef FUNCTIONS_H
#define FUNCTIONS_H
//motors
void SpeedRightMotor(int right);
void SpeedLeftMotor(int left);
void SpeedMotors(int speed);
//bluetooth
void BluetoothConnection();
std::array<String,3> BluetoothAppReturn();
#endif