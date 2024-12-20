import { defineChain } from "thirdweb";
import { client } from "@/client";
import { getContract } from "thirdweb";
import { tokenusABI } from "@/abis/tokenUsAbi";
import { exchangeABI } from "@/abis/ExchangeAbi";
import { tokenABI } from "@/abis/tokenABI";
import { exchangeUsdtToTokenusABI } from "@/abis/exchangeUsdtToTokenusABI";
import {usdtABI} from "@/abis/usdtABI";

import { escrowABI } from "@/abis/escrowABI"; //nuevo
import { WUsdtAbi } from "@/abis/WUsdtAbi"; // nuevo

import { identityRegistryABI } from "@/abis/IdentityRegistryABI";

const chain = defineChain(137)


export const ExchangeAddress = "0x1d6BA6E94eC2557F7c5360fAbfD17F13905920a4"
export const UsdtAddress = "0xB023eAEd0DE000D200004AF9Af37AD8b02a5d455"
export const ExchangeUsdtToTokenus = "0xB44951bDCAC348146A12709305296aAf055586D5"
export const EscrowBuySellOrders = "0xBB067A2fDCEAa4a9c7ffDe82c886AdE69E093d28";
export const WUsdtTokenAddress = "0x518a5709193A737264eBfCD3631ED48E5b5aCa0D"; 

//Wallet receptora de fees: 0xCCBE0885e7d9CB028D15B380C79EbFd23Fe851d8 (Actualmente 2%)

export const Exchange = getContract({
    client: client,
    address: ExchangeAddress,
    chain: chain,
    abi: exchangeABI
})

export const USDT = getContract({
    client: client,
    address: UsdtAddress,
    chain: chain,
    abi: usdtABI
})
export const exchangeUsdtToTokenus = getContract({
    client: client,
    address: ExchangeUsdtToTokenus,
    chain: chain,
    abi: exchangeUsdtToTokenusABI
})


export const escrowBuySellOrders = getContract({
    client: client,
    address: EscrowBuySellOrders,
    chain: chain,
    abi: escrowABI
})
export const wusdtToken = getContract({
    client: client,
    address: WUsdtTokenAddress,
    chain: chain,
    abi: WUsdtAbi
})
