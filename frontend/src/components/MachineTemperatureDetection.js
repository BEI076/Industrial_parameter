import { useState, useEffect } from "react";
import { onValue, ref, update } from "firebase/database";
import StartFirebase from "../firebase/config";

const MachineTemperatureDetection = () => {
  //defining state
  const [machineTemp, setMachineTemp] = useState("");
  const [buzzerAlert, setBuzzerAlert] = useState("Buzzer OFF");
  let [toggle, setToggle] = useState(false);

  const db = StartFirebase();

  useEffect(() => {
    const dbRef = ref(db, "/lm35");
    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.key === "value") {
          // console.log(childSnapshot.val());
          console.log(`value = ${childSnapshot.val()}`);
          setMachineTemp(childSnapshot.val());
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

  const coolingFanHadler = (e) => {
    const dbRef1 = ref(db, "/status");
    const option = e.target.value;
    if (option === "on") {
      update(dbRef1, { cooling: true }).then(() => {
        console.log("cooling fan on");
      });
    }
    if (option === "off") {
      update(dbRef1, { cooling: false }).then(() => {
        console.log("cooling fan off");
      });
    }
  };

  return (
    <div className="gass-container">
      <div className="sensor">
        Machine Temperature:<span className="sensor-value">{machineTemp}</span>
      </div>
      <div className="exhust-fan">
        <h3>Cooling Fan</h3>
        <button className="on" value="on" onClickCapture={coolingFanHadler}>
          ON
        </button>
        <button className="off" value="off" onClickCapture={coolingFanHadler}>
          OFF
        </button>
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
export default MachineTemperatureDetection;
