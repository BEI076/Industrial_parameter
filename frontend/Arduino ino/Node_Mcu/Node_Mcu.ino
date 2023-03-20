/*
  Rui Santos
  Complete project details at our blog.
    - ESP32: https://RandomNerdTutorials.com/esp32-firebase-realtime-database/
    - ESP8266: https://RandomNerdTutorials.com/esp8266-nodemcu-firebase-realtime-database/
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  Based in the RTDB Basic Example by Firebase-ESP-Client library by mobizt
  https://github.com/mobizt/Firebase-ESP-Client/blob/main/examples/RTDB/Basic/Basic.ino
*/
#include <ArduinoJson.h>
#include <Arduino.h>
#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include <SoftwareSerial.h>


//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "TP-Link_FA56"
#define WIFI_PASSWORD "94404609"

// Insert Firebase project API Key
#define API_KEY "AIzaSyB7LhQE_gxnSPsDgMGmR-e28jKcLoB2Bb8"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://esp8266project-8e2a3-default-rtdb.asia-southeast1.firebasedatabase.app/"

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;

// Creating instance of software serial
SoftwareSerial mySerial(D3, D2);  // RX, TX

// for buzzer
int alarm = D0;

// for exhaust fan
int exhaustFan = D1;

// for colling fan
int coolingFan = D4;

//buzzer
bool buzzer = false;
//exhust
bool exhaust = false;
//cooling
bool cooling = false;

void setup() {
  Serial.begin(115200);
  mySerial.begin(9600);
  connectWifi();

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("ok");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback;  //see addons/TokenHelper.h

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // initialize buzzer, exhust fan, colling fan status
  FirebaseJson json;
  json.setDoubleDigits(3);
  json.add("buzzer", buzzer);
  json.add("exhaust", exhaust);
  json.add("cooling", cooling);
  Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, "/status", &json) ? "ok" : fbdo.errorReason().c_str());
  Serial.printf("Get json... %s\n", Firebase.RTDB.getJSON(&fbdo, "/status") ? fbdo.to<FirebaseJson>().raw() : fbdo.errorReason().c_str());
  FirebaseJson jVal;
  Serial.printf("Get json ref... %s\n", Firebase.RTDB.getJSON(&fbdo, "/status", &jVal) ? jVal.raw() : fbdo.errorReason().c_str());
}

void loop() {
  // receive data fron mega
  // Serial.println("node");
  if (mySerial.available()) {
    // // Read the incoming data from NodeMCU
    String jsonString = mySerial.readStringUntil('\n');
    Serial.print(jsonString);
    delay(100);

    // String jsonString = "[{\"sensor\":\"dht11\",\"title\":\"temperature\",\"value\":null},{\"sensor\":\"dht11\",\"title\":\"humidity\",\"value\":null},{\"sensor\":\"mq2\",\"title\":\"gassValue\",\"value\":68},{\"sensor\":\"irFlame\",\"title\":\"flameValue\",\"value\":0},{\"sensor\":\"lm35\",\"title\":\"tempValue\",\"value\":-8.455521}]";

    // Parse the JSON array
    StaticJsonDocument<500> doc;
    DeserializationError error = deserializeJson(doc, jsonString);

    // Check for parsing errors
    if (error) {
      Serial.print("JSON parsing error: ");
      Serial.println(error.c_str());
      return;
    }

    // Extract the temperature and humidity values from the JSON array
    JsonArray array = doc.as<JsonArray>();
    for (JsonObject obj : array) {
      String sensor = obj["sensor"];
      String title = obj["title"];
      float value = obj["value"];

      Serial.println("Sensor: " + sensor);
      Serial.println(" title: " + title);
      Serial.println("value " + String(value));

      delay(100);
      if (Firebase.ready() && signupOK) {
        // dht11 temperature
        if (sensor == "dht11") {
          if (title == "temperature") {
            FirebaseJson json;
            json.setDoubleDigits(3);
            json.add("sensor", sensor);
            json.add("title", title);
            json.add("value", value);
            Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, "/dht11/temperature", &json) ? "ok" : fbdo.errorReason().c_str());
            // Serial.printf("Get json... %s\n", Firebase.RTDB.getJSON(&fbdo, "/dht11/temperature") ? fbdo.to<FirebaseJson>().raw() : fbdo.errorReason().c_str());
            // FirebaseJson jVal;
            // Serial.printf("Get json ref... %s\n", Firebase.RTDB.getJSON(&fbdo, "/dht11/temperature", &jVal) ? jVal.raw() : fbdo.errorReason().c_str());
          }
        }

        // dht11 humidity
        if (sensor == "dht11") {
          if (title == "humidity") {
            FirebaseJson json;
            json.setDoubleDigits(3);
            json.add("sensor", sensor);
            json.add("title", title);
            json.add("value", value);
            Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, "/dht11/humidity", &json) ? "ok" : fbdo.errorReason().c_str());
            // Serial.printf("Get json... %s\n", Firebase.RTDB.getJSON(&fbdo, "/dht11/humidity") ? fbdo.to<FirebaseJson>().raw() : fbdo.errorReason().c_str());
            // FirebaseJson jVal;
            // Serial.printf("Get json ref... %s\n", Firebase.RTDB.getJSON(&fbdo, "/dht11/humidity", &jVal) ? jVal.raw() : fbdo.errorReason().c_str());
          }
        }

        // mq2
        if (sensor == "mq2") {
          FirebaseJson json;
          json.setDoubleDigits(3);
          json.add("sensor", sensor);
          json.add("title", title);
          json.add("value", value);
          Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, "/mq2", &json) ? "ok" : fbdo.errorReason().c_str());
          // Serial.printf("Get json... %s\n", Firebase.RTDB.getJSON(&fbdo, "/mq2") ? fbdo.to<FirebaseJson>().raw() : fbdo.errorReason().c_str());
          // FirebaseJson jVal;
          // Serial.printf("Get json ref... %s\n", Firebase.RTDB.getJSON(&fbdo, "/mq2", &jVal) ? jVal.raw() : fbdo.errorReason().c_str());
        }

        // irFlame
        if (sensor == "irFlame") {
          FirebaseJson json;
          json.setDoubleDigits(3);
          json.add("sensor", sensor);
          json.add("title", title);
          json.add("value", value);
          Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, "/irFlame", &json) ? "ok" : fbdo.errorReason().c_str());
          // Serial.printf("Get json... %s\n", Firebase.RTDB.getJSON(&fbdo, "/irFlame") ? fbdo.to<FirebaseJson>().raw() : fbdo.errorReason().c_str());
          // FirebaseJson jVal;
          // Serial.printf("Get json ref... %s\n", Firebase.RTDB.getJSON(&fbdo, "/irFlame", &jVal) ? jVal.raw() : fbdo.errorReason().c_str());
        }

        // lm35
        if (sensor == "lm35") {
          FirebaseJson json;
          json.setDoubleDigits(3);
          json.add("sensor", sensor);
          json.add("title", title);
          json.add("value", value);
          Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, "/lm35", &json) ? "ok" : fbdo.errorReason().c_str());
          // Serial.printf("Get json... %s\n", Firebase.RTDB.getJSON(&fbdo, "/lm35") ? fbdo.to<FirebaseJson>().raw() : fbdo.errorReason().c_str());
          // FirebaseJson jVal;
          // Serial.printf("Get json ref... %s\n", Firebase.RTDB.getJSON(&fbdo, "/lm35", &jVal) ? jVal.raw() : fbdo.errorReason().c_str());
        }
      }
    }
  }
  delay(100);
  controls();
  delay(100);
}

// connect to wifi
void connectWifi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
}

// controls for buzzer, exhaust fan and colling fan
void controls() {
  if (Firebase.ready() && signupOK) {
    // Serial.println("Checking controls");
    //checking status
    // Serial.printf("Get json... %s\n", Firebase.RTDB.getJSON(&fbdo, "/status") ? fbdo.to<FirebaseJson>().raw() : fbdo.errorReason().c_str());
    const char* jsonData = Firebase.RTDB.getJSON(&fbdo, "/status") ? fbdo.to<FirebaseJson>().raw() : fbdo.errorReason().c_str();
    // Parse JSON data and extract a boolean value
    // Serial.println(jsonData);
    FirebaseJsonData data;
    FirebaseJson json;
    json.setJsonData(jsonData);

    // trigger buzzer
    if (json.get(data, "buzzer")) {
      bool buzzer = data.to<bool>();
      // Serial.print("buzzer = ");
      // Serial.print(buzzer);
      digitalWrite(alarm, buzzer);
    }

    // trigger exhaust fan
    if (json.get(data, "exhaust")) {
      bool exhaust = data.to<bool>();
      // Serial.print("exhaust = ");
      // Serial.print(exhaust);
      digitalWrite(exhaustFan, exhaust);
    }

    // trigger cooling fan
    if (json.get(data, "cooling")) {
      bool cooling = data.to<bool>();
      // Serial.print("cooling = ");
      // Serial.print(cooling);
      digitalWrite(coolingFan, cooling);
    }
  }
}