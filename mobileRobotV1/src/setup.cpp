#include <Arduino.h>
#include <variables.h>
#include <setup.h>
/*SETUP MOTORS CONFIGURATION------------------------------------------------------------------------------------------------*/
void SetupMotors(){
  pinMode(pwm_left_motor,OUTPUT);                                // declare GPIOS as output for write values
  pinMode(pwm_right_motor,OUTPUT);
  pinMode(standby,OUTPUT);
  pinMode(motor_left_AIN1,OUTPUT);
  pinMode(motor_left_AIN2,OUTPUT);
  pinMode(motor_right_BIN1,OUTPUT);
  pinMode(motor_right_BIN2,OUTPUT);
  
  digitalWrite(standby,HIGH);                                     //turn on motor driver
  ledcSetup(pwm_left_channel, pwm_frecuency, resolution);         //configure pwm funtionalities for left motor  
  ledcSetup(pwm_right_channel, pwm_frecuency, resolution);        //configure pwm funtionalities for right motor
  ledcAttachPin(pwm_left_motor, pwm_left_channel);                //attach the channel to the gpio used for pwm left motor 
  ledcAttachPin(pwm_right_motor, pwm_right_channel);              //attach the channel to the gpio used for pwm right motor 
}
/*---------------------------------------------------------------------------------------------------------------------------*/
