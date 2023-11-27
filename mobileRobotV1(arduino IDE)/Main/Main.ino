/*MOTOR DRIVER VARIABLES AND CONFIGURATION--------------------------------------------------------------------------------*/
// 27 - Standby pin
// 14 - AIN1 pin
// 12 - AIN2 pin
// 13 - PWMA pin
// 26 - BIN1 pin
// 25 - BIN2 pin
// 33 - PWMB pin
// To reverse the motor direction (forward/reverse), swap the motor controller pins AIN1 and AIN2 or BIN1 and BIN2.
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

int max_velocity;                        // the maximum linear velocity of the robot read as PWM
int max_pwm = 120;                       // max PWM output for motors
int ss_motor = 40;                       // speed increased in a single motor
/*--------------------------------------------------------------------------------------------------------------------------*/


/*BLUETOOTH VARIABLES AND CONFIGURATION-------------------------------------------------------------------------------------*/
#include "BluetoothSerial.h"
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
  #error Bluetooth is not enabled!
#endif

BluetoothSerial SerialBT;                 // bluetooth serial communication name: SerialBT 

String angle = "0";                       // joystick angle after button preseed (0-359 degress)
String strength = "0";                    // joystick strength after button pressed (0-100)
String button = "0";                      // pressed buttons (1-4)
String value = "0";                       // total string send from bluetooth app to esp32
char move_selector;                       // to select between different robot movements
/*--------------------------------------------------------------------------------------------------------------------------*/


/*VOID SETUP CONFIGURATION--------------------------------------------------------------------------------------------------*/
void setup() {
  Serial.begin(115200);                   // baud rate communication 
  Setup_motors();                         // motor driver/ESP32 gpios configuration
  SerialBT.begin("ROBOT");                // bluetooth device name

}
/*--------------------------------------------------------------------------------------------------------------------------*/


/*LOOP PROGRAM--------------------------------------------------------------------------------------------------------------*/
void loop() {
  bluetooth_app();
  /*
  // first time reading values from the bluetooth app
  Serial.print("angle:\t");
  Serial.print(angle.toInt());
  Serial.print("button:\t");
  Serial.println(button.toInt());
  */

  // from the values of the bluetooth app:
  // strength--> control of velocity in range 0-100
  // button  --> directional control values 1-4
  if (strength.toInt()==0){move_selector='s';}                            //stop the robot
  else if (button.toInt()==4 && strength.toInt()>0){move_selector = 'l';} //rotate to the left
  else if (button.toInt()==3 && strength.toInt()>0){move_selector = 'f';} //move forward
  else if (button.toInt()==2 && strength.toInt()>0){move_selector = 'r';} //rotate to the right
  else if (button.toInt()==1 && strength.toInt()>0){move_selector = 'b';} //move backward

  //maximun linear velocity of the motors in PWM
  max_velocity = map(strength.toInt(),0,100,0,max_pwm);
  
  switch(move_selector){ 
    /*****************************************************/
    case 's':
    //stop the robot
    speed_motors(0); 
    break;
    /*****************************************************/
      
    /*****************************************************/
    case 'l':
    //rotate the robot to the left
    speed_right_motor(max_velocity);
    speed_left_motor(-max_velocity); 
    break;
    /*****************************************************/
    
    /*****************************************************/
    case 'f':
    //move the robot forward and slow rotation
    if (angle.toInt()>=75 && angle.toInt() <=105){
      //forward
      speed_motors(max_velocity);  
    }
    else if (angle.toInt()>105 && angle.toInt() <=180){
      //slow rotation to the lefth
      speed_right_motor(max_velocity + ss_motor);
      speed_left_motor(max_velocity);
    }
    else if (angle.toInt()>0 && angle.toInt() <75){
      //slow rotation to the right
      speed_right_motor(max_velocity);
      speed_left_motor(max_velocity + ss_motor);
    }
    break;
    /*****************************************************/
    
    /*****************************************************/
    case 'r':
    //rotate the robot to the right
    speed_right_motor(-max_velocity);
    speed_left_motor(max_velocity);
    break;
    /*****************************************************/
    
    /*****************************************************/
    case 'b':
    //move the robot backward and slow rotation
    if (angle.toInt()>=255 && angle.toInt() <=285){
      //backward
      speed_motors(-max_velocity);  
    }
    else if (angle.toInt()>180 && angle.toInt() <255){
      //slow rotation to the lefth
      speed_right_motor(-max_velocity - ss_motor);
      speed_left_motor(-max_velocity);
    }
    else if (angle.toInt()>285 && angle.toInt() <=359){
      //slow rotation to the right
      speed_right_motor(-max_velocity);
      speed_left_motor(-max_velocity - ss_motor);
    }
    break;
    /*****************************************************/
  }
}
/*--------------------------------------------------------------------------------------------------------------------------*/

