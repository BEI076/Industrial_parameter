const RoomTemperatureDetection = () => {
    return (
        <div className="gass-container">
          <div className="sensor">
            Room Temperature : <span className="sensor-value">xxxx</span>
          </div>
          <div className="exhust-fan">
            <h3>Exhaust Fan</h3>
            <button className="on">ON</button>
            <button className="off">OFF</button>
          </div>
          <div className="buzzer">
            <button  className="buzzer-btn">
              Buzzer
            </button>
          </div>
          <div className="notification">
            <button className="notification-btn">
              Send Notification
            </button>
          </div>
        </div>
      );
};
export default RoomTemperatureDetection;
