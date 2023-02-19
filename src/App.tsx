import { useEffect, useState } from 'react';
import { getAmountOut } from './UniV2';
import './App.css';
import { getAmountOutV3 } from './UniV3';

function App() {
  // UseState hooks to manage USDC / COMP values
  const [usdcAmount, setUsdcAmount] = useState("");
  const [compAmount, setCompAmount] = useState("0");
  const [compAmountV3, setCompAmountV3] = useState("0");

  useEffect(() => {
    if (usdcAmount !== "") {
      work();
    }
  }, [usdcAmount])

  // Fetches and sets the value of output currency to compAmount
  async function work() {
    const outAmount = getAmountOut(usdcAmount);
    setCompAmount(await outAmount);
    const outAmountV3 = getAmountOutV3(usdcAmount);
    setCompAmountV3(await outAmountV3);
  }

  return (
    <div className="App">
      <input value={usdcAmount} onChange={(event) => {setUsdcAmount(event.target.value)}} placeholder={"USDC"}></input>
      <div>Compound Amount: {compAmount} using UniV2</div>
      <div>Compound Amount: {compAmountV3} using UniV3</div>
    </div>
  );
}

export default App;
