#include <Arduino.h>

void setup() {
  // put your setup code here, to run once:
  pinMode(BUILTIN_LED,OUTPUT);
  Serial.begin(115200);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(BUILTIN_LED,HIGH);
  Serial.println("led on");
  delay(2000);
  digitalWrite(BUILTIN_LED,LOW);
  Serial.println("led off");
  delay(2000);
}
