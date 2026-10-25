# Industrial Parameter Monitoring System

Watch a factory room from a web page. Sensors measure gas, flame, room temperature, humidity and machine temperature. The values go to Firebase in real time, and the web page shows them. From the same page you can turn on a buzzer, an exhaust fan or a cooling fan.

A BEI076 student project (2023).

## How it works

```
Sensors ──► Arduino Mega ──serial 9600──► NodeMCU (ESP8266) ──Wi-Fi──► Firebase Realtime Database ◄──► React web app
                                              │                                                           │
                                              └──────── buzzer, exhaust fan, cooling fan ◄── /status ◄────┘
```

1. An **Arduino Mega** reads the sensors and sends them to the NodeMCU as one JSON line over serial.
2. The **NodeMCU** writes each value to Firebase.
3. The **web app** listens to Firebase and updates the page as soon as a value changes.
4. When you press a button on the page, the app writes to `/status` in Firebase. The NodeMCU reads it and switches the output pins.

## Sensors and outputs

| Tab in the web app | Sensor | Firebase path | Alert |
|---|---|---|---|
| Gas Detection | MQ-2 | `/mq2` | "Harmful gas" above 120 |
| Flame Detection | IR flame sensor | `/irFlame` | flame when the value is 0 |
| Room Temperature | DHT11 | `/dht11/temperature` | – |
| Room Humidity | DHT11 | `/dht11/humidity` | – |
| Machine Temperature | LM35 | `/lm35` | – |

| Output | NodeMCU pin | Firebase key |
|---|---|---|
| Buzzer | D0 | `/status/buzzer` |
| Exhaust fan | D1 | `/status/exhaust` |
| Cooling fan | D4 | `/status/cooling` |

The Mega talks to the NodeMCU on **D3 (RX) and D2 (TX)**, at 9600 baud.

## Folders

| Path | What it is |
|---|---|
| `frontend/src/` | React web app (one component per sensor in `components/`) |
| `frontend/src/firebase/config.js` | Firebase settings for the web app |
| `frontend/Arduino ino/Node_Mcu/` | NodeMCU sketch |

The Arduino Mega sketch is not in this repo.

## Run it

You need your own Firebase project with a **Realtime Database**.

**NodeMCU**

1. In the Arduino IDE, install the ESP8266 boards and the libraries **Firebase ESP Client** (by mobizt) and **ArduinoJson**.
2. Open `frontend/Arduino ino/Node_Mcu/Node_Mcu.ino`.
3. Set `WIFI_SSID`, `WIFI_PASSWORD`, `API_KEY` and `DATABASE_URL` to your own values.
4. Upload it to the NodeMCU.

**Web app** (Node.js 16 or newer)

1. Put your Firebase web settings in `frontend/src/firebase/config.js`.
2. Run:

   ```sh
   cd frontend
   npm install
   npm start
   ```

3. Open http://localhost:3000.

The "Send Notification" button uses [EmailJS](https://www.emailjs.com/). Put your service ID, template ID and user ID in `frontend/src/mail/SendEmail.js` to make it work.

## Built with

React 18 · Firebase Realtime Database · ESP8266 (NodeMCU) · Arduino Mega · EmailJS

Based on the Random Nerd Tutorials guide [ESP8266 NodeMCU with Firebase Realtime Database](https://randomnerdtutorials.com/esp8266-nodemcu-firebase-realtime-database/).
