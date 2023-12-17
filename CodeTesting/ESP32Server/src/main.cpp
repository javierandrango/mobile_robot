#include <Arduino.h>
#include <FS.h>
#include <LittleFS.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>

/*variable declaration*/
/*-------------------------------------------------------------------*/

//Build-in led
int interval_time = 1000;// miliseconds
unsigned long current_time = 0;
unsigned long previous_time = 0;
bool led_state = LOW;

//Web server credentials
const char* ssid = "CELERITY_ANDRANGO";
const char* password = "091992javier";
AsyncWebServer server(80);
const char* PARAM_MESSAGE = "message";

//LittleFs filesystem
#define FORMAT_LITTLEFS_IF_FAILED true

/*-------------------------------------------------------------------*/


/*put function declarations here:*/
/*-------------------------------------------------------------------*/
//blink led
//void blinkLed(int);

//HTML request
void notFound(AsyncWebServerRequest *request);

/*-------------------------------------------------------------------*/



/*put your setup code here, to run once:*/
/*-------------------------------------------------------------------*/
void setup() {
  //Serial communication
  Serial.begin(115200);

  //Build-in led
  //pinMode(LED_BUILTIN,OUTPUT);

  
  //Web server as Station mode:
  //we can  request information from the internet 
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid,password);
  if (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.printf("WiFi Failed!\n");
    return;
  }
  else{
    Serial.print("WiFi connected succesfully!");
  }
  
  // Mount SPIFFS file system
  if(!LITTLEFS.begin(FORMAT_LITTLEFS_IF_FAILED)){
      Serial.println("LITTLEFS Mount Failed");
      return;
  }

  
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  

  
  // server request: main page
  server.serveStatic("/static/css/style.css", LITTLEFS, "/static/css/style.css");
  server.serveStatic("/static/js/main.js", LITTLEFS, "/static/js/main.js");
  server.on("/", HTTP_ANY, [](AsyncWebServerRequest *request){
        request->send(LITTLEFS,"/index.html","text/html", false);
  });
  

  // Send a GET request to <IP>/get?message=<message>
    server.on("/get", HTTP_GET, [] (AsyncWebServerRequest *request) {
        String message;
        if (request->hasParam(PARAM_MESSAGE)) {
            message = request->getParam(PARAM_MESSAGE)->value();
        } else {
            message = "No message sent";
        }
        request->send(200, "text/plain", "Hello, GET: " + message);
    });
  
  //server request: page not found
  server.onNotFound(notFound);
  server.begin();
  
}
/*-------------------------------------------------------------------*/



/*put your main code here, to run repeatedly:*/
/*-------------------------------------------------------------------*/
void loop() {
  //blinkLed(interval_time);
}
/*-------------------------------------------------------------------*/



/*put function definitions here:*/
/*-------------------------------------------------------------------*/
// blik led 
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

// html not found 
void notFound(AsyncWebServerRequest *request) {
    request->send(404, "text/plain", "Not found");
}

/*-------------------------------------------------------------------*/