import dayjs, { Dayjs } from 'dayjs';
import React, { createContext, useEffect, useReducer, useState } from 'react';

const CalculatorContext = createContext(null);

const CalculatorProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [periods, setPeriods] = useState({});
  const [grossDays, setGrossDays] = useState(0);
  const [netDays, setNetDays] = useState(0);
  const [prDays, setPrDays] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [prDate, setPrDate] = useState<Dayjs | null>(null);
  const [currentDate, setCurrentDate] = useState(dayjs());
  // const [fiveYearsAgoDate, setFiveYearsAgoDate] = useState(currentDate.subtract(5, 'year'));  
  const [fiveYearsAgoDate, setFiveYearsAgoDate] = useReducer(()=>(currentDate.subtract(5, 'year')), currentDate.subtract(5, 'year'))
  
  const pushPeriod = (newPeriod) => {
    setPeriods(prevPeriods=>({...prevPeriods, [newPeriod.id]: newPeriod}))
  };

  const calculateTotalDays = () => {
    // Set Gross Total Days
    let grossTotalDaysTemp: number = 0;
    let netTotalDaysTemp: number = 0;
    let prTotalDaysTemp: number = 0;
    for (const [key, value] of Object.entries(periods)) {
      if(fiveYearsAgoDate?.isAfter(value["departureDate"])) continue;
      grossTotalDaysTemp += value["departureDate"]?.diff(value["arriveDate"], "days") + 1 || 0;

      if(value["departureDate"]?.isAfter(prDate)) {
        if(value["arriveDate"].isAfter(prDate)) {
          prTotalDaysTemp += value["departureDate"]?.diff(value["arriveDate"], "days") + 1 || 0;
        } else {
          netTotalDaysTemp += (prDate.diff(value["arriveDate"], 'days') / 2) + 1;
          prTotalDaysTemp += value["departureDate"].diff(prDate, 'days') + 1;
        }
      } else {
          netTotalDaysTemp += ((value["departureDate"]?.diff(value["arriveDate"], "days") + 1)  / 2) || 0;
      }

    }
    setGrossDays(grossTotalDaysTemp)
    setNetDays(netTotalDaysTemp)
    setPrDays(prTotalDaysTemp)

    netTotalDaysTemp = netTotalDaysTemp > 365 ? 354 : netTotalDaysTemp;
    setRemainingDays((365*3) - netTotalDaysTemp - prTotalDaysTemp)
    // console.log(getUrl())
  }

  const getUrl = () => {

    // let dates = [];
    // for (const [key, value] of Object.entries(inputValues)) {
    //   dates
    // }
    // console.log('inputValues', Object.entries(periods))
    const jsonString = JSON.stringify(Object.entries(periods).map(([inputValueKey, inputValue])=>{
      return [inputValue['arriveDate'],inputValue['departureDate']]
    }));
    // console.log('Generated JsonString', jsonString)
    const encodedJsonString = encodeURIComponent(jsonString);
    // console.log('encodedJsonString', encodedJsonString)
    // console.log('---- USER', user)
    return window.location.origin + "?user="+ JSON.stringify(user) +"&prDate=" + (prDate?.toJSON() || "") +"&data=" + jsonString;
  }
  const removePeriod = (index: any) => {
    // console.log("removing:", index);
    // setPeriodInputs(periodInputs.filter(periodInput => periodInput.props.id != index));
    setPeriods( prevInputValues => {
      const newInputValues = {...prevInputValues};
      delete newInputValues[index];
      return newInputValues;

    });

  };

  const loadFromUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const userEncodedJsonString = urlParams.get('user');
    const userJsonString = decodeURIComponent(userEncodedJsonString);
    setUser(JSON.parse(userJsonString));

    const prDateEncodedJsonString = urlParams.get('prDate');
    setPrDate(dayjs(prDateEncodedJsonString));

    const encodedJsonString = urlParams.get('data');
    const jsonString = decodeURIComponent(encodedJsonString);
    // console.log(`jsonString`, jsonString)
    // console.log(`jsonString`, jsonString[115])
    // console.log(`jsonString`, jsonString[116])
    const data = JSON.parse(jsonString);

    if(data){
      let loadedInputValues = {};
      for (const [key, value] of Object.entries(data)) {
        // console.log('key', key)
        // console.log('value', value)
        loadedInputValues = {...loadedInputValues, [key]: {arriveDate: dayjs(value[0]),departureDate: dayjs(value[1])}}
      }
      setPeriods(loadedInputValues)
      // console.log('loadedInputValues', loadedInputValues)

    }
  }

  useEffect(()=>{
    setFiveYearsAgoDate();
  }, [currentDate]);

  useEffect(()=>{
    console.log(`[CalculatorContext.tsx] Periods:`, periods);
    calculateTotalDays();
  }, [periods, fiveYearsAgoDate, currentDate]);

  // The Query Param  
  useEffect(() => {
    console.clear();

    loadFromUrl();

    return () => {
      
    }
  }, [])
  

  return (
    <CalculatorContext  .Provider
      value={{
        user,
        setUser,
        periods,
        pushPeriod,
        removePeriod,
        grossDays,
        netDays,
        prDays,
        remainingDays,
        prDate,
        setPrDate,
        currentDate,
        setCurrentDate,
        fiveYearsAgoDate,
        getUrl
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export { CalculatorContext, CalculatorProvider };