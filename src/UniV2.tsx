// Using UniV2

import { ethers } from 'ethers';

// USDC and COMP token addr on Eth mainnet
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const COMP_ADDRESS = '0xc00e94cb662c3520282e6f5717214004a7f26888';

// Uniswap V2 router contract address and correspondign ABI
const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const UNISWAP_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
];

// Init Infura and create Uniswap router contract instance 
const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_KEY);
const uniswapRouter = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, provider);

// USDC/COMP trading pair
const USDC_COMP_PAIR = [USDC_ADDRESS, COMP_ADDRESS];

// getAmountOut function
export async function getAmountOut(usdcAmount: string): Promise<string> {
  const amounts = await uniswapRouter.getAmountsOut(ethers.utils.parseUnits(usdcAmount, 6), USDC_COMP_PAIR);
  return ethers.utils.formatUnits(amounts[1].toString(), 18);
}