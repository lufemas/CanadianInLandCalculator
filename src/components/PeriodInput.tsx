import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const formatDate = (dateToFormat: any) => {
  return new Date(dateToFormat).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

// @ts-ignore 
export default function PeriodInput({ id = '', onChange, onRemove }) {
  const [arriveDate, setArriveDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [daysInLand, setDaysInLand] = useState(0);

  const handleDateChange = (dateChanged: string) => {
    setArriveDate(dateChanged);
    console.log("dateChanged", dateChanged);
  };

  const calculateDaysInLand = (initialDate: Date, finalDate: Date) => {
    const date1 = new Date(initialDate);
    const date2 = new Date(finalDate);

    const timeDiff = date2.getTime() - date1.getTime();
    const daysDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));

    console.log("daysDiff +1", daysDiff + 1); // Output: 7

    return daysDiff + 1;
  };

  useEffect(() => {
    setDaysInLand(
      calculateDaysInLand(new Date(arriveDate), new Date(departureDate))
    );

    onChange({ id, arriveDate, departureDate, daysInLand });
  }, [arriveDate, departureDate]);

  useEffect(() => {
    console.log("daysInLand", daysInLand); // Output: 7
    onChange({ id, arriveDate, departureDate, daysInLand });
  }, [daysInLand]);
  return (
    <div className="period-input">
      <h3>{id || "-"}</h3>
      <label htmlFor="dateIn">
        Arrive Date
        <input
          type="date"
          name="dateIn"
          id="dateIn"
          // value={arriveDate}
          onChange={(e) => setArriveDate(e.target.value)}
        />
      </label>
      <label htmlFor="dateIn">
        Departure Date
        <input
          type="date"
          name="dateIn"
          id="dateIn"
          onChange={(e) => setDepartureDate(e.target.value)}
        />
      </label>
      <span>
        {daysInLand} Day{daysInLand > 1 && "s"}
      </span>
      <button onClick={onRemove ? onRemove : () => {}}>
        <span role="img">🗑️</span>
      </button>
    </div>
  );
}
