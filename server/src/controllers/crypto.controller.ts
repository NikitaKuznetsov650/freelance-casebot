import { Request, Response } from "express";
import { cryptoClient } from "../services/crypto.service";
import logger from "../../assets/logger/logger";

export async function getCoinData(coin: string): Promise<any> {
    console.log("getCoinData - Запрос данных для монеты:", coin);
    
    try {
        const response = await cryptoClient
            .getPositionInfo({
                category: "spot",
                symbol: coin + "USDT"
            });
        console.log(response);
      ; 
    } catch (error) {
        console.error("getCoinData - Ошибка при запросе данных для монеты:", error);
    }
}

export async function withdraw(req: Request, res: Response) {
    const { coin, chain, address, amount } = req.body;

    try {
        const response = await cryptoClient.submitWithdrawal({
            coin: coin,
            chain: chain,
            address: address,
            amount: amount,
            timestamp: Date.now(),
            forceChain: 0,
            accountType: "SPOT"
        });
        logger.info(response);
        res.json({ response });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error });
    }
}
