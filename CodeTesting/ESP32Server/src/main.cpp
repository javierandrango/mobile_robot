#include <Arduino.h>
// variable declaration
//-------------------------------------------------------------------
int interval_time = 1000;// miliseconds
unsigned long current_time = 0;
unsigned long previous_time = 0;
bool led_state = LOW;
//-------------------------------------------------------------------


// put function declarations here:
//-------------------------------------------------------------------
void blinkLed(int);
//-------------------------------------------------------------------



// put your setup code here, to run once:
//-------------------------------------------------------------------
void setup() {
  
  pinMode(LED_BUILTIN,OUTPUT);
}
//-------------------------------------------------------------------



// put your main code here, to run repeatedly:
//-------------------------------------------------------------------
void loop() {
  blinkLed(interval_time);
}
//-------------------------------------------------------------------



// put function definitions here:
//-------------------------------------------------------------------
void blinkLed(int time_ms){
  /**
   * n: number of times the led will blink
   * time_ms: time perior between blinks
  */
  current_time = millis();
  if (current_time - previous_time>=time_ms){
    //change state
    if (led_state == LOW){
      led_state = HIGH;
    }
    else{
      led_state = LOW;
    }
    //update time
    previous_time = current_time;
  }
  digitalWrite(BUILTIN_LED, led_state);


}
//-------------------------------------------------------------------