import React, { useState, useEffect } from "react";

const DateTime = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="timeContainer">
      <p>{weekdays[date.getDay()]}</p>
      <p> {date.toLocaleDateString()}</p>
      <p> {date.toLocaleTimeString()}</p>
    </div>
  );
};

export default DateTime;
