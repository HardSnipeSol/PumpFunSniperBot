import { LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { ArbBot, SwapToken } from './bot';
import dotenv from "dotenv";
import { createJupiterApiClient } from '@jup-ag/api';

const ENDPOINT = `https://public.jupiterapi.com`; // 👈 Replace with your Metis Key or a public one https://www.jupiterapi.com/
const CONFIG = {
    basePath: ENDPOINT
};
const jupiterApi = createJupiterApiClient(CONFIG);

jupiterApi.quoteGet({
    inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    outputMint: "So11111111111111111111111111111111111111112",
    amount: 100_000_000,
}).then((quote) => {
    console.log(quote.outAmount, quote.outputMint);
}).catch((error) => {
    console.error(error);
});

dotenv.config({
    path: ".env",
});

const defaultConfig = {
    solanaEndpoint: clusterApiUrl("mainnet-beta"),
    jupiter: "https://quote-api.jup.ag/v6",
};

async function main() {
    if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY environment variable not set");
    }
    let decodedSecretKey = Uint8Array.from(JSON.parse(process.env.SECRET_KEY));

    
    const bot = new ArbBot({
        solanaEndpoint: process.env.SOLANA_ENDPOINT ?? defaultConfig.solanaEndpoint,
        metisEndpoint: process.env.METIS_ENDPOINT ?? defaultConfig.jupiter,
        secretKey: decodedSecretKey,
        firstTradePrice: 0.11 * LAMPORTS_PER_SOL,
        targetGainPercentage: 1.5,
        initialInputToken: SwapToken.USDC,
        initialInputAmount: 10_000_000,
    });

    await bot.init();

}

main().catch(console.error);