import { useEffect, useState } from 'react';
import { getAmountOut } from './UniV2';
import './App.css';
import { getAmountOutV3, getAmountOutV3Smart } from './UniV3';
import { getClientSideQuote, toSupportedChainId } from './UniversalRouter';
import { USDC, COMP } from './UniV3'
import { Protocol } from '@uniswap/router-sdk';
import { ChainId, AlphaRouter } from '@uniswap/smart-order-router';
import { ethers } from 'ethers';

function App() {
  // UseState hooks to manage USDC / COMP values
  const [usdcAmount, setUsdcAmount] = useState("");
  const [compAmount, setCompAmount] = useState("0");
  const [compAmountV3, setCompAmountV3] = useState("0");
  const [compAmountV3Smart, setCompAmountV3Smart] = useState("0");
  const [smart, setSmart] = useState("");

  const CLIENT_PARAMS = {
    protocols: [Protocol.V2, Protocol.V3, Protocol.MIXED],
  }
  const routers = new Map<ChainId, AlphaRouter>()
  function getRouter(chainId: ChainId): AlphaRouter {
    const router = routers.get(chainId)
    if (router) return router

    const supportedChainId = toSupportedChainId(chainId)
    if (supportedChainId) {
      const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_KEY);
      // @ts-ignore
      const router = new AlphaRouter({ chainId, provider })
      routers.set(chainId, router)
      return router
    }

    throw new Error(`Router does not support this chain (chainId: ${chainId}).`)
  }

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
    setSmart("Loading")
    await getClientSideQuote(
      {
        tokenInAddress: USDC.address,
        tokenInChainId: 1,
        tokenInDecimals: USDC.decimals,
        tokenInSymbol: USDC.symbol,
        tokenOutAddress: COMP.address,
        tokenOutChainId: 1,
        tokenOutDecimals: COMP.decimals,
        tokenOutSymbol: COMP.symbol,
        amount: ethers.utils.formatUnits(ethers.utils.parseUnits(usdcAmount, USDC.decimals).mul(10**6), USDC.decimals).split(".")[0],
        type: 'exactIn'
      }, 
      getRouter(1), 
      CLIENT_PARAMS
    ).then((result) => {
      console.log(result)
      setSmart(result.data.routeString + "  $COMP out: " + result.data.quoteDecimals + "  Please check console.log for more data")
    })
  }

  return (
    <div className="App">
      <input value={usdcAmount} onChange={(event) => {setUsdcAmount(event.target.value)}} placeholder={"USDC"}></input>
      <div>Compound Amount: {compAmount} using UniV2 Direct Pair</div>
      <div>Compound Amount: {compAmountV3} using UniV3 Direct Pair</div>
      <div>Compound Amount: {compAmountV3Smart} Smart Router USDC {'>'} WETH {'>'} COMP</div>
      <div>--Uniswap smart router--</div>
      <div>{smart}</div>
    </div>
  );
}

export default App;
