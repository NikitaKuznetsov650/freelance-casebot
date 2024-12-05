import { Request, Response } from 'express';
import { getRefByChatId } from '../models/db.ref.model';

export async function getRef (req: Request, res: Response): Promise<any> {
    const { chatId } = req.body;

    try {
        const ref = await getRefByChatId(chatId);
        
        if (!ref) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("ref from db: " + ref)
        return res.status(200).json({ref})
    } catch (error) {
        console.error("get ref error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
