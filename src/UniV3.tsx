import { SupportedChainId, Token } from '@uniswap/sdk-core';
import { ethers } from 'ethers';

const quoterAbi = require('./QuoterAbi.json');

const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';

const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_KEY);

const WETH = new Token(
  SupportedChainId.MAINNET,
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  18,
  'WETH',
  'Wrapped Ether'
)

const USDC = new Token(
  SupportedChainId.MAINNET,
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  6,
  'USDC',
  'USD//C'
)

const COMP = new Token(
  SupportedChainId.MAINNET,
  '0xc00e94cb662c3520282e6f5717214004a7f26888',
  18,
  'COMP',
  'Compound Finance'
)

export async function getAmountOutV3(): Promise<string> {
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    quoterAbi,
    provider
  )

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    USDC,
    COMP,
    1000,
    ethers.utils.parseUnits("2000", 6),
    0
  )

  return ethers.utils.formatUnits(quotedAmountOut, 18)
}