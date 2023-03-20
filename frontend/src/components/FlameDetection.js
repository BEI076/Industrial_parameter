import { useState, useEffect } from "react";
import { onValue, ref, update } from "firebase/database";
import StartFirebase from "../firebase/config";

const FlameDetection = () => {
  //defining state
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
        <button className="notification-btn">Send Notification</button>
      </div>
    </div>
  );
};

export default FlameDetection;
