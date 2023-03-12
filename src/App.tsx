import { useEffect, useState } from 'react';
import { getAmountOut } from './UniV2';
import './App.css';
import { getAmountOutV3, getAmountOutV3Smart } from './UniV3';
import { getClientSideQuote, toSupportedChainId } from './UniversalRouter';
import { USDC, COMP } from './UniV3'
import { Protocol } from '@uniswap/router-sdk';
import { ChainId, AlphaRouter } from '@uniswap/smart-order-router';
import { ethers } from 'ethers';
import styled from 'styled-components/macro';

const SwapDiv = styled.div`
  display: block;
  margin: auto;
  margin-top: 36px;
  width: 90%;
  max-width: 480px;
  height: fit-content;
`

const InputWrapper = styled.div`
  display: flex;
  margin: auto;
`
const InputPanel = styled.input`
    display: block;
    margin: auto;
    font-size: large;
    padding: 1rem;
    max-width: 320px;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    background: #ffffff60;
    border-radius: 24px;
    border: none;
    &:focus {
      border: none;
      outline: none;
      background: #ffffff80;
    }
`

const OutputWrapper = styled.div`
  display: flex;
`

const OutputPanel = styled.input<{ isLoading: boolean }>`
    display: block;
    margin: auto;
    font-size: large;
    padding: 1rem;
    max-width: 320px;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    background: #ffffff60;
    border-radius: 24px;
    border: none;
    background-image: ${({isLoading}) => (isLoading ? 'linear-gradient(to right, #FFFB7D 20%, #b4ff69c2 80%)' : 'none')};
    background-repeat: no-repeat;
    background-size: 800px 104px;
    animation-duration: 2s;
    -webkit-animation-duration: 5s;
    animation-fill-mode: forwards;
    -webkit-animation-fill-mode: forwards; 
    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;
    animation-name: shimmer;
    -webkit-animation-name: shimmer;
    animation-timing-function: linear;
    -webkit-animation-timing-function: linear;

    @keyframes shimmer {
      0% {
        background-position: -468px 0;
      }
      50% {
        background-position: 0px 0; 
      }
      100% {
        background-position: -468px 0;
      }
    }
`

function App() {
  // UseState hooks to manage USDC / COMP values
  const [usdcAmount, setUsdcAmount] = useState("");
  const [compAmount, setCompAmount] = useState("0");
  const [compAmountV3, setCompAmountV3] = useState("0");
  const [compAmountV3Smart, setCompAmountV3Smart] = useState("0");
  const [smart, setSmart] = useState("");
  const [smartAmount, setSmartAmount] = useState("");
  const [loading, setLoading] = useState(false)

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
  }, [usdcAmount, setLoading])

  // Fetches and sets the value of output currency to compAmount
  async function work() {
    setLoading(true)
    const outAmount = await getAmountOut(usdcAmount);
    setCompAmount(outAmount.slice(0, 6));
    const outAmountV3 = await getAmountOutV3(usdcAmount);
    setCompAmountV3(outAmountV3.slice(0, 6));
    const outAmountV3Smart = await getAmountOutV3Smart(usdcAmount);
    setCompAmountV3Smart(outAmountV3Smart.slice(0, 6));
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
      setSmart(result.data.routeString + "  $COMP out: " + result.data.quoteDecimals.slice(0, 6) + "  Please check console.log for more data")
      setSmartAmount(result.data.quoteDecimals.slice(0, 6))
      setLoading(false)
    }).catch((error) => {
      console.log(error)
      setLoading(false)
    })
  }

  return (
    <div className="App">
      <SwapDiv>
        <InputWrapper>
          <InputPanel 
            value={usdcAmount} 
            onChange={(event) => {setUsdcAmount(event.target.value)}} 
            placeholder={"USDC Amount"} 
          />
        </InputWrapper>
        <OutputWrapper>
          <OutputPanel
            isLoading={loading}
            value={smartAmount}
            disabled={true}
            placeholder={"COMP Amount"}
          />
        </OutputWrapper>
        <div>--Output amounts--</div>
        <div>{compAmount} $COMP using UniV2 Direct Pair</div>
        <div>{compAmountV3} $COMP using UniV3 Direct Pair</div>
        <div>{compAmountV3Smart} $COMP using Smart Router USDC {'>'} WETH {'>'} COMP</div>
        <div>--Uniswap smart router--</div>
        <div>{smart}</div>
      </SwapDiv>
    </div>
  );
}

export default App;
