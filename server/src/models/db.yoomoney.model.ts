import { Response } from "express"
import { pool } from "../services/connection.service"
import logger from "../../assets/logger/logger"

export async function insertYooMoneyPayment(response: any, userId: string, res?: Response): Promise<any>{

    const query = "INSRT INTO payments (id, amount, status, userId) VALUES (?, ?, ?, ?)"

    return new Promise((resolve, reject) => {
        pool.query(query, [response.id, response.amount.value, response.status], (results, error) => {
            if(error){
                logger.error("Error inserting yoomomney Payment", error)
                return reject(error)
            }

            res?.json(results)
            resolve(results)
        })
    })
}

export async function updateYooMoneyPaymentStatus(response: any, userId: number){
    const query = "UPDATE payments SET status = ? WHERE id = ?"

    return new Promise((resolve, reject) => {
        pool.query(query, [response.status, response.id], (error, results) => {
            if(error){
                logger.error("Errro updating yoomoney payment data", error)
                return reject(error)
            }

            resolve(results)
        })
    })

}