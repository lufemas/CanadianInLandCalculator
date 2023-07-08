import "./styles.scss";
import TotalCalculator from "./components/TotalCalculator";
import { CalculatorProvider } from "./Contexts/CalculatorContext";

export default function App() {
  return (
    <div className="App">
      <CalculatorProvider>
        <TotalCalculator />
      </CalculatorProvider>
    </div>
  );
}
