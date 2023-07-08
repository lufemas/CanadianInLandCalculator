import React, { createContext, useEffect, useState } from 'react';

const CalculatorContext = createContext(null);

const CalculatorProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [periods, setPeriods] = useState({});
  const [grossDays, setGrossDays] = useState(0);
  const [netDays, setNetDays] = useState(0);
  const [prDays, setPrDays] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fiveYearsAgoDate, setFiveYearsAgoDate] = useState(new Date(currentDate.getFullYear() - 5, currentDate.getMonth(), currentDate.getDate()));  
  
  const getPeriods = () => periods;
  const pushPeriod = (newPeriod) => {
    setPeriods(prevPeriods=>({...prevPeriods, [newPeriod.id]: newPeriod}))
  };

  const calculateTotalDays = () => {
    // Set Gross Total Days
    let grossTotalDaysTemp: number = 0;
    let netTotalDaysTemp: number = 0;
    let prTotalDaysTemp: number = 0;
    for (const [key, value] of Object.entries(periods)) {
      // console.log(`'KEY/VALUE`, key, value);
      grossTotalDaysTemp += value["daysInLand"] || 0;
      netTotalDaysTemp += value["fullDaysInLand"] || 0;
      if(value["isPR"]) {

        prTotalDaysTemp += value["fullDaysInLand"] || 0;
      }
    }
    setGrossDays(grossTotalDaysTemp)
    setNetDays(netTotalDaysTemp)
    setPrDays(prTotalDaysTemp)

    netTotalDaysTemp = netTotalDaysTemp > 365 ? 354 : netTotalDaysTemp;
    setRemainingDays((365*3) - netTotalDaysTemp - prTotalDaysTemp)
    console.log(getUrl())
  }

  const getUrl = () => {

    // let dates = [];
    // for (const [key, value] of Object.entries(inputValues)) {
    //   dates
    // }
    console.log('inputValues', Object.entries(periods))
    const jsonString = JSON.stringify(Object.entries(periods).map(([inputValueKey, inputValue])=>{
      return [inputValue['arriveDate'],inputValue['departureDate'], inputValue['isPR']]
    }));
    console.log('Generated JsonString', jsonString)
    const encodedJsonString = encodeURIComponent(jsonString);
    // console.log('encodedJsonString', encodedJsonString)
    console.log('---- USER', user)
    return window.location.origin + "?user="+ JSON.stringify(user) +"&data=" + jsonString;
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

  useEffect(()=>{
    console.log(`[CalculatorContext.tsx] Periods:`, periods);
    calculateTotalDays();
  }, [periods]);

  // The Query Param  
  useEffect(() => {
    console.clear();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const userEncodedJsonString = urlParams.get('user');
    const userJsonString = decodeURIComponent(userEncodedJsonString);
    setUser(JSON.parse(userJsonString));

    const encodedJsonString = urlParams.get('data');
    const jsonString = decodeURIComponent(encodedJsonString);
    console.log(`jsonString`, jsonString)
    console.log(`jsonString`, jsonString[115])
    console.log(`jsonString`, jsonString[116])
    const data = JSON.parse(jsonString);

    if(data){
      let loadedInputValues = {};
      for (const [key, value] of Object.entries(data)) {
        // console.log('key', key)
        // console.log('value', value)
        loadedInputValues = {...loadedInputValues, [key]: {arriveDate: value[0],departureDate: value[1], isPR: value[2]}}
      }
      setPeriods(loadedInputValues)
      console.log('loadedInputValues', loadedInputValues)

    }
  
    return () => {
      
    }
  }, [])
  

  return (
    <CalculatorContext  .Provider
      value={{
        user,
        periods,
        pushPeriod,
        removePeriod,
        grossDays,
        netDays,
        prDays,
        remainingDays,
        currentDate,
        fiveYearsAgoDate,
        getUrl
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export { CalculatorContext, CalculatorProvider };