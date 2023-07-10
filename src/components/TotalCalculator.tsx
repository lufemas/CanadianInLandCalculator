import { useContext, useEffect, useState } from "react";
import PeriodInput from "../components/PeriodInput";
import { v4 as uuidv4 } from "uuid";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { CalculatorContext } from "../Contexts/CalculatorContext";
import { IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DateField, DatePicker } from "@mui/x-date-pickers";
import TextField from '@mui/material/TextField';
import { placeholder } from "@babel/types";

export default function App() {
  const { 
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
    // console.log("changing:", changeInput);

    Object.values(inputValues).forEach( (input: any) => {
      if(!input.id != changeInput.id ) {
        const intersect = areDatePeriodsIntersecting(input.arriveDate, input.departureDate, changeInput.arriveDate, changeInput.departureDate);
        // console.log('intersect', intersect)
        // console.log(input)
        if(intersect) {
          // return toast.warn("Overlapping date", {autoClose: 1000,})
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

  }, []);

  useEffect(() => {

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

      { Object.entries(periods).map(([periodKey]) => {
        // console.log('mapping key', periodKey)
        // console.log('periodKey: ', periodKey)
        return <PeriodInput 
                key={periodKey}
                id={periodKey}
                onChange={onInputChange}
                onRemove={removePeriod}
                prDate={prDate}
                fiveYearsAgoDate={fiveYearsAgoDate}
                loadArriveDate={periods[periodKey]["arriveDate"]}
                loadDepartureDate={periods[periodKey]["departureDate"]}
                inputValue={periods[periodKey]}/>
        
        })
      }
      {/* <PeriodInput /> */}

      {/* <button onClick={addPeriodInput}>➕</button> */}
      <IconButton aria-label="Add new time range" size="large" onClick={addPeriodInput}>
        <AddCircleIcon fontSize="inherit" />
      </IconButton>
      <br />
      <br />
      <DatePicker
        label="PR Card Issue Date 🪪"
        value={prDate}
        onChange={(newDate) => {console.log("newDate", newDate ); setPrDate(newDate)}}
      />
      <p><strong>Gross Total Days in Land:</strong> {grossDays}, <strong>Approximately :</strong> {(grossDays/365).toFixed(1)} years</p>
      <p><strong>Net Total Days in Land: </strong>{netDays}, <strong>Approximately :</strong> {(netDays  /365).toFixed(1)} years</p>
      <p><strong>PR Total Days in Land: </strong>{prDays}, <strong>Approximately :</strong> {(prDays/365).toFixed(1)} years</p>
      <br/>
      <p><strong>You need to stay in Canada for more: </strong>{remainingDays}, <strong>Approximately :</strong> {(remainingDays/365).toFixed(1)} years</p>

      <br/>
      <DateField
        label="5 Years Ago:"
        value={fiveYearsAgoDate}
        readOnly={true}
      />
      <DatePicker
        label="Current Date:"
        value={currentDate}
        onChange={(newDate) => {console.log("newDate", newDate ); setCurrentDate(newDate)}}
      />
      {/* <p><strong>Five Years Ago was: </strong>{fiveYearsAgoDate.toJSON()}
      </p>
      <p><strong>Current Date: </strong>{currentDate.toJSON()}
      </p> */}
      {/* <button onClick={()=>calculateTotalDays()}>Calculate</button> */}
      <br/>
      <br/>
      <TextField id="first-name" label="First Name" variant="standard" value={user?.firstName} placeholder="First Name" onChange={(event)=>setUser({...user, firstName: event.target.value})} />
      <br/>
      <br/>

      <a href={getUrl()} target="_blank" rel="noopener noreferrer">Your Link 🔗</a>
    {/* </div> */}
    {/* <ToastContainer></ToastContainer> */}
      </>
  );
}
