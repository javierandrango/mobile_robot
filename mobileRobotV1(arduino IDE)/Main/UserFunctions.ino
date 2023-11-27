/*MOTORS FUNCTIONS---------------------------------------------------------------------------------------------------------*/
void speed_right_motor(int right){
  /*
  * Right motor output speed configuration
  */                         
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


void speed_left_motor(int left){
  /*
  * Left motor output speed configuration
  */ 
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


void speed_motors(int robot_speed){
  /*
  * Right and Left motor output speed configuration.
  * One output speed on both motors
  */                      

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
void bluetooth_app(){
  /*
  * Received one string from the bluettoth app and splited into
  * usefull values 
  */
  if (SerialBT.available()>0) {
    value = SerialBT.readStringUntil('#');
    if (value.length()==7){
      angle = value.substring(0,3);
      strength = value.substring(3,6);
      button = value.substring(6,8);
      SerialBT.flush();
      value = "";
    }
      
  }
}
/*---------------------------------------------------------------------------------------------------------------------------*/
