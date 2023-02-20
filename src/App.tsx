import { useEffect, useState } from 'react';
import { getAmountOut } from './UniV2';
import './App.css';
import { getAmountOutV3, getAmountOutV3Smart } from './UniV3';

function App() {
  // UseState hooks to manage USDC / COMP values
  const [usdcAmount, setUsdcAmount] = useState("");
  const [compAmount, setCompAmount] = useState("0");
  const [compAmountV3, setCompAmountV3] = useState("0");
  const [compAmountV3Smart, setCompAmountV3Smart] = useState("0");

  useEffect(() => {
    if (usdcAmount !== "") {
      work();
    }
  }, [usdcAmount])

  // Fetches and sets the value of output currency to compAmount
  async function work() {
    const outAmount = await getAmountOut(usdcAmount);
    setCompAmount(outAmount);
    const outAmountV3 = await getAmountOutV3(usdcAmount);
    setCompAmountV3(outAmountV3);
    const outAmountV3Smart = await getAmountOutV3Smart(usdcAmount);
    setCompAmountV3Smart(outAmountV3Smart);
  }

  return (
    <div className="App">
      <input value={usdcAmount} onChange={(event) => {setUsdcAmount(event.target.value)}} placeholder={"USDC"}></input>
      <div>Compound Amount: {compAmount} using UniV2 Direct Pair</div>
      <div>Compound Amount: {compAmountV3} using UniV3 Direct Pair</div>
      <div>Compound Amount: {compAmountV3Smart} Smart Router USDC {'>'} WETH {'>'} COMP</div>
    </div>
  );
}

export default App;
