import { Request, Response } from "express";
import {getCase, getCasesAmountDb, insertCaseCounter, randomDrop} from "../models/db.cases.model";
import {getCurrentUserBalance} from "../models/db.users.model";

export async function getCases(req: Request, res: Response): Promise<any>{
    const { tableName } = req.body;

    const response = await getCase(tableName);

    return res.json({ response });
}

export async function openCase(req: Request, res: Response): Promise<any> {
    const { tableName, circles, casePrice, userId } = req.body;
    console.log("openCase - Параметры запроса:", { tableName, circles, casePrice, userId });

    const userBalance: number = await getCurrentUserBalance(userId);
    console.log("openCase - Баланс пользователя:", userBalance);

    // if (userBalance < casePrice) {
    //     console.log("openCase - Недостаточно средств для открытия кейса");
    //     return res?.status(400).json({ message: "Недостаточно средств для покрытия стоимости кейса." });
    // }

    const response = await randomDrop(tableName, circles);
    console.log("openCase - Полученные данные из randomDrop:", response);

    await insertCaseCounter();
    return res?.json(response);
}


export async function getCasesAmount(req: Request, res: Response): Promise<any> {
        const response = await getCasesAmountDb(); 
        
        return response;
}


