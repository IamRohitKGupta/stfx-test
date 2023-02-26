import { SupportedChainId, Token } from '@uniswap/sdk-core';
import { ethers } from 'ethers';
import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';

const quoterAbi = require('./QuoterAbi.json');

const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';

const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_KEY);

export const WETH = new Token(
  SupportedChainId.MAINNET,
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  18,
  'WETH',
  'Wrapped Ether'
)

export const USDC = new Token(
  SupportedChainId.MAINNET,
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  6,
  'USDC',
  'USD//C'
)

export const COMP = new Token(
  SupportedChainId.MAINNET,
  '0xc00e94cb662c3520282e6f5717214004a7f26888',
  18,
  'COMP',
  'Compound Finance'
)

export async function getAmountOutV3(amount: string): Promise<string> {
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    provider
  )

  const poolConstants = await getPoolConstants(USDC, COMP);

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    poolConstants.token0,
    poolConstants.token1,
    poolConstants.fee,
    ethers.utils.parseUnits(amount, USDC.decimals),
    0
  )
  const quoteOut = ethers.utils.formatUnits(quotedAmountOut, 18);

  return quoteOut
}

export async function getAmountOutV3Smart(amount: string): Promise<string> {
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    provider
  )

  const poolConstantsWeth = await getPoolConstants(USDC, WETH);
  const poolConstantsWethComp = await getPoolConstants(WETH, COMP);

  const quotedAmountOutWeth = await quoterContract.callStatic.quoteExactInputSingle(
    poolConstantsWeth.token0,
    poolConstantsWeth.token1,
    poolConstantsWeth.fee,
    ethers.utils.parseUnits(amount, USDC.decimals),
    0
  )

  const quotedAmountOutWethComp = await quoterContract.callStatic.quoteExactInputSingle(
    poolConstantsWethComp.token1,
    poolConstantsWethComp.token0,
    poolConstantsWethComp.fee,
    ethers.utils.parseUnits(ethers.utils.formatUnits(quotedAmountOutWeth, WETH.decimals), WETH.decimals),
    0
  )

  const quoteOutSmart = ethers.utils.formatUnits(quotedAmountOutWethComp, COMP.decimals);
  return quoteOutSmart
}

async function getPoolConstants(tA: Token, tB: Token): Promise<{
  token0: string
  token1: string
  fee: number
}> {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tA,
    tokenB: tB,
    fee: FeeAmount.MEDIUM,
  })

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider
  )
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ])

  return {
    token0,
    token1,
    fee,
  }
}