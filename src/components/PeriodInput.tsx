import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from '@mui/material/Button';
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";

const formatDate = (dateToFormat: any) => {
  return new Date(dateToFormat).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

// @ts-ignore 
export default function PeriodInput({ id = '', onChange, onRemove, inputValue = '', loadArriveDate = '', loadDepartureDate = '', prDate = dayjs() }) {
  // console.log('Single, inputValue', inputValue)
  // const [arriveDate, setArriveDate] = useState("");
  const [arriveDate, setArriveDate] = useState<Dayjs | null>(null);
  // const [departureDate, setDepartureDate] = useState("");
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
  const [daysInLand, setDaysInLand] = useState(0);
  const [fullDaysInLand, setFullDaysInLand] = useState(0);

  const handleDateChange = (dateChanged: string) => {
    setArriveDate(dayjs(dateChanged));
    // console.log("dateChanged", dateChanged);
  };

  useEffect(() => {
    // const totalDaysInLand = calculateDaysInLand(arriveDate?.toDate(), arriveDate?.toDate());
    // setDaysInLand(totalDaysInLand);

    const totalDaysInLand = departureDate?.diff(arriveDate, 'days') + 1;
    // setDaysInLand(arriveDate.diff(departureDate))
    setDaysInLand(totalDaysInLand);

    // setFullDaysInLand( isPR ? totalDaysInLand : totalDaysInLand / 2);

    // onChange({ id, arriveDate, departureDate, daysInLand, fullDaysInLand, isPR });
  }, [arriveDate, departureDate]);

  useEffect(() => {
    // console.log("daysInLand", daysInLand); // Output: 7
    onChange({ id, arriveDate, departureDate, daysInLand, fullDaysInLand });
  }, [daysInLand, fullDaysInLand]);

  useEffect(()=>{
    if(inputValue) {
      // console.log('got inputValue', inputValue)
      // setArriveDate(inputValue["arriveDate"]);
      setArriveDate(dayjs(inputValue["arriveDate"]));
      setDepartureDate(dayjs(inputValue["departureDate"]));
      // setIsPR(inputValue['isPR'])
    }
    // console.log("loadArriveDate", loadArriveDate)

    if(loadArriveDate != '') {
      // console.log("with loadArriveDate", loadArriveDate)
      setArriveDate(dayjs(loadArriveDate))
      // console.log("arriveDate", arriveDate)
    }

    if(loadDepartureDate != '') {
      // console.log("with loadDepartureDate", loadDepartureDate);
      setDepartureDate(dayjs(loadDepartureDate));
      // console.log("DepartureDate", departureDate);
    }
  },[])
  return (
    <div className={
      "period-input "
      +
      (prDate.isBefore(arriveDate) ? "isPR " : "")
      +
      (prDate.isAfter(arriveDate) && prDate.isBefore(departureDate) ? "gotPR " : "")
      }>
      {/* <h3>{id || "-"}</h3> */}
      {/* <label htmlFor={"pr-checkbox-"+id}> PR
        <input type="checkbox" name={"pr-checkbox-"+id} id={"pr-checkbox-"+id} checked={isPR} onChange={()=>setIsPR(wasPR => !wasPR)}/>
      </label> */}
      <DatePicker 
        label="Arrive Date 🌐 🡆 🇨🇦"
        value={arriveDate}
        onChange={(newDate) => {console.log("newDate", newDate ); setArriveDate(newDate)}}
      />
      <DatePicker 
        label="Departure Date 🇨🇦 🡆 🌐"
        value={departureDate}
        onChange={(newDate) => {console.log("newDate", newDate ); setDepartureDate(newDate)}}
      />
      {/* <label htmlFor={"dateIn-"+id}>
        Arrive Date
        <input
          type="date"
          name={"dateIn-"+id}
          id={"dateIn-"+id}
          value={arriveDate}
          onChange={(e) => {console.log("e.target.value", e.target.value ); setArriveDate(e.target.value)}}
        />
      </label> */}
      {/* <label htmlFor={"dateOut-"+id}>
        Departure Date
        <input
          type="date"
          name={"dateOut-"+id}
          id={"dateOut-"+id}
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
      </label> */}
      <span>
        {daysInLand} Day{daysInLand > 1 && "s"}
      </span>
      {/* <span>
        {fullDaysInLand} Day{daysInLand > 1 && "s"}
      </span> */}
      <IconButton aria-label="delete" size="medium" onClick={onRemove ? ()=>onRemove(id) : () => {}}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      {/* <button onClick={onRemove ? ()=>onRemove(id) : () => {}}>
        <span role="img">🗑️</span>
      </button> */}
    </div>
  );
}
