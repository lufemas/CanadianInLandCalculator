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
export default function PeriodInput({ id = '', onChange, onRemove, inputValue='', loadArriveDate='', loadDepartureDate='' }) {
  // console.log('Single, inputValue', inputValue)
  const [arriveDate, setArriveDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [daysInLand, setDaysInLand] = useState(0);
  const [fullDaysInLand, setFullDaysInLand] = useState(0);
  const [isPR, setIsPR] = useState(true);

  const handleDateChange = (dateChanged: string) => {
    setArriveDate(dateChanged);
    // console.log("dateChanged", dateChanged);
  };

  const calculateDaysInLand = (initialDate: Date, finalDate: Date) => {
    const date1 = new Date(initialDate);
    const date2 = new Date(finalDate);

    const timeDiff = date2.getTime() - date1.getTime();
    const daysDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));

    // console.log("daysDiff +1", daysDiff + 1); // Output: 7

    return (daysDiff + 1) || 0;
  };

  useEffect(() => {
    const totalDaysInLand = calculateDaysInLand(new Date(arriveDate), new Date(departureDate));
    setDaysInLand(totalDaysInLand);

    setFullDaysInLand( isPR ? totalDaysInLand : totalDaysInLand / 2);

    onChange({ id, arriveDate, departureDate, daysInLand, fullDaysInLand, isPR });
  }, [arriveDate, departureDate, isPR]);

  useEffect(() => {
    // console.log("daysInLand", daysInLand); // Output: 7
    onChange({ id, arriveDate, departureDate, daysInLand, fullDaysInLand, isPR });
  }, [daysInLand]);

  useEffect(()=>{
    // if(inputValue) {
    //   console.log('got inputValue', inputValue)
    //   setArriveDate(inputValue["arriveDate"]);
    //   setDepartureDate(inputValue["departureDate"]);
    // }
    console.log("loadArriveDate", loadArriveDate)

    if(loadArriveDate != '') {
      console.log("with loadArriveDate", loadArriveDate)
      setArriveDate(loadArriveDate)
      console.log("arriveDate", arriveDate)
    }

    if(loadDepartureDate != '') {
      console.log("with loadDepartureDate", loadDepartureDate)
      setDepartureDate(loadDepartureDate)
      console.log("DepartureDate", departureDate)
    }
  },[])
  return (
    <div className="period-input">
      <h3>{id || "-"}</h3>
      <label htmlFor="pr-checkbox"> PR
        <input type="checkbox" name="pr-checkbox" id="pr-checkbox" checked={isPR} onChange={()=>setIsPR(wasPR => !wasPR)}/>
      </label>
      <label htmlFor="dateIn">
        Arrive Date
        <input
          type="date"
          name="dateIn"
          id="dateIn"
          value={arriveDate}
          onChange={(e) => {console.log("e.target.value", e.target.value ); setArriveDate(e.target.value)}}
        />
      </label>
      <label htmlFor="dateIn">
        Departure Date
        <input
          type="date"
          name="dateIn"
          id="dateIn"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
      </label>
      <span>
        {daysInLand} Day{daysInLand > 1 && "s"}
      </span>
      <span>
        {fullDaysInLand} Day{daysInLand > 1 && "s"}
      </span>
      <button onClick={onRemove ? ()=>onRemove(id) : () => {}}>
        <span role="img">🗑️</span>
      </button>
    </div>
  );
}
