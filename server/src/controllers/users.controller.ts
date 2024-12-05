import { Request, Response } from "express";
import { getAllUsers, getCurrentUserBalance } from "../models/db.users.model";

export async function allUsers(): Promise<any> {
   return (await getAllUsers()).users
}

export async function userBalance(req: Request, res: Response): Promise<any>{
    try {
        const {id} = req.body

        const response = await getCurrentUserBalance(id)
    
        return res.json({balance: response})  
    } catch (error) {
        console.error(error)
    }
}