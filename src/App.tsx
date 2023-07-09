import "./styles.scss";
import TotalCalculator from "./components/TotalCalculator";
import { CalculatorProvider } from "./Contexts/CalculatorContext";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function App() {
  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CalculatorProvider>
          <TotalCalculator />
        </CalculatorProvider>
      </LocalizationProvider>
    </div>
  );
}
