#include <Arduino.h>
#include <variables.h>
#include <setup.h>
#include <functions.h>

/*BLUETOOTH VARIABLES -------------------------------------------------------------------------------------*/
String angle;                       //joystick angle when preseed 0-359 degress
String strength;                    //joystick strength when pressed 0-100
String button;                      //pressed buttons (1-4)
/*----------------------------------------------------------------------------------------------------------*/

/*VOID SETUP -----------------------------------------------------------------------------------------------*/
void setup() {
  // put your setup code here, to run once:
  SetupMotors();
  BluetoothConnection();
  Serial.begin(115200);
  /******************************************************************************/
  //test motors the first time
  /*
  for(int i=0; i<=160; i=i+20){
    SpeedMotors(i);
    delay(500);
  };
  SpeedMotors(0);
  */
   /******************************************************************************/
}
/*----------------------------------------------------------------------------------------------------------*/


/*VOID LOOP-------------------------------------------------------------------------------------------------*/
void loop() {
  // put your main code here, to run repeatedly:
  std::array<String, 3> app_data = BluetoothAppReturn();
  angle= app_data[0];
  strength = app_data[1];
  button = app_data[2];
  /******************************************************************************/
  //test bluetooth the first time
  Serial.print("Angle:"); Serial.print(angle.toInt()); Serial.print('\t');
  Serial.print("Strength:"); Serial.print(strength.toInt()); Serial.print('\t');
  Serial.print("Button:"); Serial.print(button.toInt()); Serial.println('\t');
  delay(50);
  /******************************************************************************/
}
/*----------------------------------------------------------------------------------------------------------*/