import { useContext, useEffect, useState } from "react";
import PeriodInput from "../components/PeriodInput";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CalculatorContext } from "../Contexts/CalculatorContext";

export default function App() {
  const { 
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
          getUrl,
        } = useContext(CalculatorContext)
  const [inputValues, setInputValues]
    = useState({
      [uuidv4()]: {
            // arriveDate: "",
            // daysInLand: 0,
            // departureDate: "",
            // id: uuidv4()
          }} as any);      

  const onInputChange = (changeInput: any) => {
    const id = changeInput.id;
    // console.log("chaging:", changeInput);

    Object.values(inputValues).forEach( (input: any) => {
      if(!input.id != changeInput.id ) {
        const intersect = areDatePeriodsIntersecting(input.arriveDate, input.departureDate, changeInput.arriveDate, changeInput.departureDate);
        // console.log('intersect', intersect)
        // console.log(input)
        if(intersect) {
          return toast.warn("Overlapping date", {autoClose: 1000,})
        }
      }
    })

    setInputValues({ ...inputValues, [`${id}`]: { ...changeInput } });
    pushPeriod(changeInput)
  };

  const addPeriodInput = () => {
    // setInputValues({...inputValues, [uuidv4()]: {}})
    pushPeriod({id: uuidv4()})
  };

  
  const areDatePeriodsIntersecting = (start1, end1, start2, end2) => {
    return start1 <= end2 && start2 <= end1;
  }

  useEffect(() => {
    // console.clear();
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const encodedJsonString = urlParams.get('data');
    // const jsonString = decodeURIComponent(encodedJsonString);
    // const data = JSON.parse(jsonString);
    // // console.log( 'jsonString', jsonString)
    // // console.log( 'parserd', data)

    // if(data){
    //   let loadedInputValues = {};
    //   for (const [key, value] of Object.entries(data)) {
    //     // console.log('key', key)
    //     // console.log('value', value)
    //     loadedInputValues = {...loadedInputValues, [key]: {arriveDate: value[0],departureDate: value[1], isPR: value[2]}}
    //   }
    //   setInputValues(loadedInputValues)
    //   console.log('loadedInputValues', loadedInputValues)

    // }

  }, []);

  // const calculateTotalDays = () => {
  //   // Set Gross Total Days
  //   let grossTotalDaysTemp: number = 0;
  //   let netTotalDaysTemp: number = 0;
  //   for (const [key, value] of Object.entries(inputValues)) {
  //     // console.log(`${key}: ${value}`);
  //     grossTotalDaysTemp += value["daysInLand"] || 0;
  //     netTotalDaysTemp += value["fullDaysInLand"] || 0;
  //   }
  //   // console.log('grossTotalDaysTemp', grossTotalDaysTemp)
  //   setGrossTotalDays(grossTotalDaysTemp)
  //   setNetTotalDays(netTotalDaysTemp)

  //   console.log(getUrl())
  // }
  useEffect(() => {
    // addPeriodInput();
    // console.log("useEffect inputValues", inputValues);

    let isAllPeriodsFilles = true;

    Object.values(inputValues).forEach( (input: any) => {
      if(!input.daysInLand) {
        // console.log(input)
      isAllPeriodsFilles = false;
      }
    })

    if(isAllPeriodsFilles) {
      addPeriodInput();
      // console.log('addinf new input')

    }

    // calculateTotalDays(); 
  }, [inputValues]);

  useEffect(() => {
    // console.log("inputValues:", inputValues);
  }, [inputValues]);

  return (
    <>
    {/* <div className="total-calculator"> */}
      <h1>{user?.firstName || 'Anonymous'}'s Calculator</h1>

      {/* <PeriodInput id={1} onChange={onInputChange} onRemove={onRemoveInput} /> */}

      {/* {periodInputs.map((periodInput, index) => {
        return periodInput;
      })} */}

      {/* { Object.keys(inputValues).map((inputValueKey) => {
        // console.log('mapping key', inputValueKey)
        return <PeriodInput 
                key={inputValueKey}
                id={inputValueKey}
                onChange={onInputChange}
                onRemove={onRemoveInput}
                loadArriveDate={inputValues[inputValueKey]["arriveDate"]}
                loadDepartureDate={inputValues[inputValueKey]["departureDate"]}
                inputValue={inputValues[inputValueKey]}/>
        
        })
      } */}

      { Object.entries(periods).map(([periodKey]) => {
        // console.log('mapping key', periodKey)
        console.log('periodKey: ', periodKey)
        return <PeriodInput 
                key={periodKey}
                id={periodKey}
                onChange={onInputChange}
                onRemove={removePeriod}
                loadArriveDate={periods[periodKey]["arriveDate"]}
                loadDepartureDate={periods[periodKey]["departureDate"]}
                inputValue={periods[periodKey]}/>
        
        })
      }
      {/* <PeriodInput /> */}

      <button onClick={addPeriodInput}>➕</button>
      <p><strong>Gross Total Days in Land:</strong> {grossDays}, <strong>Approximately :</strong> {(grossDays/365).toFixed(1)} years</p>
      <p><strong>Net Total Days in Land: </strong>{netDays}, <strong>Approximately :</strong> {(netDays  /365).toFixed(1)} years</p>
      <p><strong>PR Total Days in Land: </strong>{prDays}, <strong>Approximately :</strong> {(prDays/365).toFixed(1)} years</p>
      <br/>
      <p><strong>You need to stay in Canada for more: </strong>{remainingDays}, <strong>Approximately :</strong> {(remainingDays/365).toFixed(1)} years</p>

      <br/>
      <p><strong>Five Years Ago was: </strong>{fiveYearsAgoDate.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        })}
      </p>
      <p><strong>Current Date: </strong>{currentDate.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        })}
      </p>
      {/* <button onClick={()=>calculateTotalDays()}>Calculate</button> */}
      <br/>
      <br/>
      <br/>
      <a href={getUrl()} target="_blank" rel="noopener noreferrer">{getUrl()}</a>
    {/* </div> */}
    <ToastContainer></ToastContainer>
      </>
  );
}
