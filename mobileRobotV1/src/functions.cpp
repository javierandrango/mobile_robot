#include <Arduino.h>
#include <variables.h>
#include <functions.h>

#include "BluetoothSerial.h"
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
  #error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif
BluetoothSerial SerialBT;


/*MOTORS FUNCTIONS---------------------------------------------------------------------------------------------------------*/
void SpeedRightMotor(int right)                         
{
  if(right >= 0)                                    
  {
    digitalWrite(motor_right_BIN1,LOW);                  
    digitalWrite(motor_right_BIN2,HIGH);
    ledcWrite(pwm_right_channel, right);
  }
  
  if(right < 0)                                     
  {                            
    digitalWrite(motor_right_BIN1,HIGH);                  
    digitalWrite(motor_right_BIN2,LOW);
    ledcWrite(pwm_right_channel, abs(right));
  }
}


void SpeedLeftMotor(int left)                         
{
  if(left >= 0)                                    
  {
    digitalWrite(motor_left_AIN1,LOW);                  
    digitalWrite(motor_left_AIN2,HIGH);
    ledcWrite(pwm_left_channel, left);
  }
  
  if(left < 0)                                     
  {                            
    digitalWrite(motor_left_AIN1,HIGH);                  
    digitalWrite(motor_left_AIN2,LOW);
    ledcWrite(pwm_left_channel, abs(left));
  }
}


void SpeedMotors(int robot_speed)                         
{
  if(robot_speed >= 0)                                    
  {
    digitalWrite(motor_left_AIN1,LOW);                  
    digitalWrite(motor_left_AIN2,HIGH);
    digitalWrite(motor_right_BIN1,LOW);                  
    digitalWrite(motor_right_BIN2,HIGH);
    ledcWrite(pwm_right_channel, robot_speed);
    ledcWrite(pwm_left_channel, robot_speed);
  }
  
  if(robot_speed < 0)                                     
  {                            
    digitalWrite(motor_left_AIN1,HIGH);                  
    digitalWrite(motor_left_AIN2,LOW);
    digitalWrite(motor_right_BIN1,HIGH);                  
    digitalWrite(motor_right_BIN2,LOW);
    ledcWrite(pwm_right_channel, abs(robot_speed));
    ledcWrite(pwm_left_channel, abs(robot_speed));
  }
}
/*---------------------------------------------------------------------------------------------------------------------------*/


/*BLUETOOTH FUNCTIONS--------------------------------------------------------------------------------------------------------*/
void BluetoothConnection(){
  SerialBT.begin("DIFFERENTIAL DRIVE ROBOT");
}

std::array<String,3> BluetoothAppReturn(){
  std::array<String, 3> strings;
  if (SerialBT.available()>0) {
    String value = SerialBT.readStringUntil('#');//total array
    if (value.length()==7){
      strings[0] = value.substring(0,3); // angle
      strings[1] = value.substring(3,6); // strength
      strings[2] = value.substring(6,8); // button
      SerialBT.flush();
      value = "";
    }  
  }
  return strings;
}
/*---------------------------------------------------------------------------------------------------------------------------*/