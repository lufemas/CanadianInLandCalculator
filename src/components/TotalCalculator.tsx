import { useEffect, useState } from "react";
import PeriodInput from "../components/PeriodInput";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [grossTotalDays, setGrossTotalDays] = useState(0);
  const [netTotalDays, setNetTotalDays] = useState(0);
  const [periodInputs, setPeriodInputs] = useState([] as JSX.Element[]);
  const [inputValues, setInputValues]
    = useState({
      [uuidv4()]: {
            // arriveDate: "",
            // daysInLand: 0,
            // departureDate: "",
            // id: uuidv4()
          }} as any);
  const currentDate = new Date();
  const fiveYearsAgoDate = new Date(currentDate.getFullYear() - 5, currentDate.getMonth(), currentDate.getDate());        
  const onRemoveInput = (index: any) => {
    // console.log("removing:", index);
    // setPeriodInputs(periodInputs.filter(periodInput => periodInput.props.id != index));
    setInputValues( prevInputValues => {
      const newInputvalues = {...prevInputValues};
      delete newInputvalues[index];
      return newInputvalues;

    });

  };

  const onInputChange = (changeInput: any) => {
    const id = changeInput.id;
    console.log("chaging:", changeInput);

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
  };

  const addPeriodInput = () => {
    // const newElement = (
    //   <PeriodInput
    //     id={uuidv4()}
    //     onChange={onInputChange}
    //     onRemove={onRemoveInput}
    //     inputValue={'a'}
    //   />
    // );
    // setPeriodInputs([...periodInputs, newElement]);
    setInputValues({...inputValues, [uuidv4()]: {}})
  };

  const getUrl = () => {

    // let dates = [];
    // for (const [key, value] of Object.entries(inputValues)) {
    //   dates
    // }
    console.log('inputValues', Object.entries(inputValues))
    const jsonString = JSON.stringify(Object.entries(inputValues).map(([inputValueKey, inputValue])=>{
      return [inputValue['arriveDate'],inputValue['departureDate'], inputValue['isPR']]
    }));
    const encodedJsonString = encodeURIComponent(jsonString);
    return window.location.href + "?data=" + jsonString;
  }
  const areDatePeriodsIntersecting = (start1, end1, start2, end2) => {
    return start1 <= end2 && start2 <= end1;
  }

  useEffect(() => {
    console.clear();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedJsonString = urlParams.get('data');
    const jsonString = decodeURIComponent(encodedJsonString);
    const data = JSON.parse(jsonString);
    // console.log( 'jsonString', jsonString)
    // console.log( 'parserd', data)

    if(data){
      let loadedInputValues = {};
      for (const [key, value] of Object.entries(data)) {
        // console.log('key', key)
        // console.log('value', value)
        loadedInputValues = {...loadedInputValues, [key]: {arriveDate: value[0],departureDate: value[1], isPR: value[2]}}
      }
      setInputValues(loadedInputValues)
      console.log('loadedInputValues', loadedInputValues)

    }

  }, []);
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

    // Set Gross Total Days
    let grossTotalDaysTemp: number = 0;
    let netTotalDaysTemp: number = 0;
    for (const [key, value] of Object.entries(inputValues)) {
      // console.log(`${key}: ${value}`);
      grossTotalDaysTemp += value["daysInLand"] || 0;
      netTotalDaysTemp += value["fullDaysInLand"] || 0;
    }
    // console.log('grossTotalDaysTemp', grossTotalDaysTemp)
    setGrossTotalDays(grossTotalDaysTemp)
    setNetTotalDays(netTotalDaysTemp)

    console.log(getUrl())
  }, [inputValues]);

  useEffect(() => {
    // console.log("inputValues:", inputValues);
  }, [inputValues]);

  return (
    <>
    {/* <div className="total-calculator"> */}
      <h1>Calculator 0</h1>

      {/* <PeriodInput id={1} onChange={onInputChange} onRemove={onRemoveInput} /> */}

      {/* {periodInputs.map((periodInput, index) => {
        return periodInput;
      })} */}

      { Object.keys(inputValues).map((inputValueKey) => {
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
      }
      {/* <PeriodInput /> */}

      <button onClick={addPeriodInput}>➕</button>
      <p><strong>Gross Total Days in Land:</strong> {grossTotalDays}</p>
      <p><strong>Net Total Days in Land: </strong>{netTotalDays}</p>
      <br></br>
      <p><strong>Five Years Ago was: </strong>{fiveYearsAgoDate.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        })}
      </p>
      <br></br>
      <br></br>
      <br></br>
      <a href={getUrl()} target="_blank" rel="noopener noreferrer">{getUrl()}</a>
    {/* </div> */}
    <ToastContainer></ToastContainer>
      </>
  );
}
