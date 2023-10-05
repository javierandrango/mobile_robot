#ifndef VARIABLES_H
#define VARIABLES_H

/*MOTOR DRIVER VARIABLES AND CONFIGURATION--------------------------------------------------------------------------------*/
// 27 - Standby pin
// 14 - AIN1 pin
// 12 - AIN2 pin
// 13 - PWMA pin
// 26 - BIN1 pin
// 25 - BIN2 pin
// 33 - PWMB pin
// To reverse forward motor direction, switch the AIN1 and AIN2 or BIN1 and BIN2 pin numbers.
const int pwm_left_motor = 13;     
const int pwm_right_motor = 33;
const int standby = 27;
const int motor_left_AIN1 = 14;
const int motor_left_AIN2 = 12;
const int motor_right_BIN1 = 26;
const int motor_right_BIN2 = 25;

const int pwm_frecuency = 980;           // PWM frecuency for arduino uno 
const int pwm_left_channel = 0;          // 0-15 available channels (left motor channel) 
const int pwm_right_channel = 1;         // 0-15 available channels (right motor channel)
const int resolution = 8;                // 8-bit resolution means control values from 0 to 255

/*--------------------------------------------------------------------------------------------------------------------------*/

#endif