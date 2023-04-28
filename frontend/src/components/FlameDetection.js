import { useState, useEffect } from "react";
import { onValue, ref, update } from "firebase/database";
import StartFirebase from "../firebase/config";
import { SendMessage } from "../mail/SendEmail";

const FlameDetection = () => {
  //defining state
  const [email, setEmail] = useState("");
  const [flameAlert, setFlameAlert] = useState("");
  const [buzzerAlert, setBuzzerAlert] = useState("Buzzer OFF");
  let [toggle, setToggle] = useState(false);

  const db = StartFirebase();

  useEffect(() => {
    const dbRef = ref(db, "/irFlame");
    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        // console.log(childSnapshot);
        if (childSnapshot.key === "value") {
          console.log(`value = ${childSnapshot.val()}`);
          if (childSnapshot.val() === 0) {
            setFlameAlert("No Flame Detected ");
          } else {
            setFlameAlert("Flame Detected");
          }
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

  const sendEmail = () => {
    setEmail("");

    const message = "flame alert";
    SendMessage(email, message).then((response) => {
      console.log(response);
    });
  };
  return (
    <div className="gass-container">
      <div className="flame-detection">
        <button className="flame-btn">{flameAlert}</button>
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
        <button className="notification-btn" onClick={sendEmail}>
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default FlameDetection;
