import { useState, useEffect } from "react";
import { onValue, ref, update } from "firebase/database";
import StartFirebase from "../firebase/config";
import { SendMessage } from "../mail/SendEmail";

const RoomHumidityDetection = () => {
  //defining state
  const [email, setEmail] = useState("");

  const [humidity, setHumidity] = useState("");
  const [buzzerAlert, setBuzzerAlert] = useState("Buzzer OFF");
  let [toggle, setToggle] = useState(false);

  const db = StartFirebase();

  useEffect(() => {
    const dbRef = ref(db, "/dht11/humidity");
    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.key === "value") {
          // console.log(childSnapshot.val());
          console.log(`value = ${childSnapshot.val()}`);
          setHumidity(childSnapshot.val());
        }
      });
    });
  }, [db]);

  const buzzerHandler = () => {
    const dbRef1 = ref(db, "/status");
    if (!toggle) {
      const data = {
        buzzer: true,
      };
      update(dbRef1, data).then(() => {
        setToggle(!toggle);
        console.log("buzzer clicked ON !!");
        setBuzzerAlert("Buzzer ON");
      });
    } else {
      const data = {
        buzzer: false,
      };
      update(dbRef1, data).then(() => {
        setToggle(!toggle);
        console.log("buzzer clicked OFF !!");
        setBuzzerAlert("Buzzer OFF");
      });
    }
  };

  const exhaustFanHandler = (e) => {
    const dbRef1 = ref(db, "/status");
    const option = e.target.value;
    if (option === "on") {
      update(dbRef1, { exhaust: true }).then(() => {
        console.log("exhaust fan on");
      });
    }
    if (option === "off") {
      update(dbRef1, { exhaust: false }).then(() => {
        console.log("exhaust fan off");
      });
    }
  };
  const sendEmail = () => {
    setEmail("")

    const message = "over humidity";
    SendMessage(email, message).then((response) => {
      console.log(response);
    });
  };

  return (
    <div className="gass-container">
      <div className="sensor">
        Humidity : <span className="sensor-value">{humidity}</span>
      </div>
      <div className="exhust-fan">
        <h3>Exhaust Fan</h3>
        <button className="on" value="on" onClickCapture={exhaustFanHandler}>
          ON
        </button>
        <button className="off" value="off" onClickCapture={exhaustFanHandler}>
          OFF
        </button>
      </div>
      <div className="buzzer">
        <button className="buzzer-btn" onClickCapture={buzzerHandler}>
          {buzzerAlert}
        </button>
      </div>
      <div className="notification">
      <input
          className="email-input"
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="notification-btn" onClick={sendEmail}>Send Notification</button>
      </div>
    </div>
  );
};
export default RoomHumidityDetection;
