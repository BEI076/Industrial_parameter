const FlameDetection = () => {
  return (
    <div className="gass-container">
      <div className="flame-detection">
        <button className="flame-btn">NO Flame Detected</button>
      </div>
      <div className="buzzer">
        <button className="buzzer-btn">Buzzer</button>
      </div>
      <div className="notification">
        <button className="notification-btn">Send Notification</button>
      </div>
    </div>
  );
};

export default FlameDetection;
