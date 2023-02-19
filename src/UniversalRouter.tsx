export {}
/*
import {
  SwapRouter, UNIVERSAL_ROUTER_ADDRESS
} from "@uniswap/universal-router-sdk";
import { BigNumber, ethers } from 'ethers';
import { Trade } from '@uniswap/router-sdk'
import { Token, Percent, Currency, TradeType, } from '@uniswap/sdk-core';
import { FeeOptions } from "@uniswap/v3-sdk";
import { useCallback } from "react";

export const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_KEY);

const USDC = new Token(1, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6);
const COMP = new Token(1, '0xc00e94cb662c3520282e6f5717214004a7f26888', 18);

interface SwapOptions {
  slippageTolerance: Percent
  deadline?: BigNumber
  permit?: String
  feeOptions?: FeeOptions
}

export function useUniSwapRouter(
  trade: Trade<Currency, Currency, TradeType> | undefined,
  options: SwapOptions,
) {
  // @ts-ignore
  const { calldata: data, value } = SwapRouter.swapERC20CallParameters(trade, {
    slippageTolerance: options.slippageTolerance,
    deadlineOrPreviousBlockhash: options.deadline?.toString(),
    inputTokenPermit: options.permit,
    fee: options.feeOptions,
  });
}

async function getAmountOut(inputAmount: BigNumber, options: SwapOptions): Promise<BigNumber> {
  const trade = new Trade(
    new Route([new Pair(USDC, COMP)], USDC),
    CurrencyAmount.fromRawAmount(USDC, inputAmount),
    TradeType.EXACT_INPUT
  );
  const { calldata, value } = SwapRouter.swapERC20CallParameters(trade, options);
  const gasEstimate = await provider.estimateGas({ to: UNIVERSAL_ROUTER_ADDRESS(ChainId.MAINNET), data: calldata, value: value || 0 });
  const gasLimit = calculateGasMargin(gasEstimate);
  const response = await provider.getSigner().sendTransaction({ to: UNIVERSAL_ROUTER_ADDRESS(ChainId.MAINNET), data: calldata, value: value || 0, gasLimit });
  return response;
}
*/