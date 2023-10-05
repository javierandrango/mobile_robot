#include <Arduino.h>
#include <variables.h>
#include <setup.h>
#include <functions.h>

void setup() {
  // put your setup code here, to run once:
  SetupMotors();

  for(int i=0; i<=160; i=i+20){
    speed_motors(i);
    delay(500);
  };
  speed_motors(0);

}

void loop() {
  // put your main code here, to run repeatedly:

}
