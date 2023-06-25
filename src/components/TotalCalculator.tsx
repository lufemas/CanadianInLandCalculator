import { useEffect, useState } from "react";
import PeriodInput from "../components/PeriodInput";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [periodInputs, setPeriodInputs] = useState([] as JSX.Element[]);
  const [inputValues, setInputValues] = useState({} as any);

  const onRemoveInput = (index: any) => {
    console.log("removing:", index);
  };

  const onInputChage = (input: any) => {
    const id = input.id;
    console.log("chaging:", input);
    setInputValues({ ...inputValues, [`${id}`]: { ...input } });
  };

  const addPeriodInput = () => {
    const newElement = (
      <PeriodInput
        id={uuidv4()}
        onChange={onInputChage}
        onRemove={onRemoveInput}
      />
    );
    setPeriodInputs([...periodInputs, newElement]);
  };

  useEffect(() => {
    console.clear();
  }, []);
  useEffect(() => {
    // addPeriodInput();
    console.log("useEffect inputValues", inputValues);

    let isAllPeriodsFilles = true;

    Object.values(inputValues).forEach( (input: any) => {
      if(!input.daysInLand) {
        console.log(input)
      isAllPeriodsFilles = false;
      }
    })

    if(isAllPeriodsFilles) {
      addPeriodInput();
      console.log('addinf new input')

    }

    // const checkForOpenDate = Object.keys(inputValues).filter((input) => {
    //   console.log("input", inputValues[input]);
    //   return inputValues[input].daysInLand;
    // });

    // if (checkForOpenDate) addPeriodInput();
    // if (checkForOpenDate) console.log('GOOOOO');
    // console.log("checkForOpenDate", checkForOpenDate);
  }, [inputValues]);

  useEffect(() => {
    console.log("inputValues:", inputValues);
  }, [inputValues]);

  return (
    <div className="total-calculator">
      <h1>Calculator 0</h1>

      {/* <PeriodInput id={1} onChange={onInputChage} onRemove={onRemoveInput} /> */}

      {periodInputs.map((periodInput, index) => {
        return periodInput;
      })}
      {/* <PeriodInput /> */}
      <p>Total Days in Land: </p>
    </div>
  );
}
