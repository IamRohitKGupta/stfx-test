import { useEffect, useState } from 'react';
import { getAmountOut } from './UniV2';
import './App.css';
import { getAmountOutV3 } from './UniV3';

function App() {
  // UseState hooks to manage USDC / COMP values
  const [usdcAmount, setUsdcAmount] = useState("");
  const [compAmount, setCompAmount] = useState("0");

  useEffect(() => {
    if (usdcAmount !== "") {
      work();
    }
  }, [usdcAmount])

  // Fetches and sets the value of output currency to compAmount
  async function work() {
    const outAmount = getAmountOut(usdcAmount);
    console.log(outAmount);
    setCompAmount(await outAmount);
    console.log("V3:");
    console.log(getAmountOutV3());
  }

  return (
    <div className="App">
      <input value={usdcAmount} onChange={(event) => {setUsdcAmount(event.target.value)}}></input>
      {compAmount}
      <>{}</>
    </div>
  );
}

export default App;
