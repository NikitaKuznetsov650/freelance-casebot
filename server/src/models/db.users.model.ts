import { pool } from "../services/connection.service";
import logger from "../../assets/logger/logger";
import { RowDataPacket } from "mysql2";

export async function getAllUsers(): Promise<{ users: number }> {
    const query = "SELECT COUNT(*) AS users FROM users;";

    return new Promise<{ users: number }>((resolve, reject) => {
        pool.query(query, (error, results) => {
            if (error) {
                logger.error(error);
                return reject(error);
            }

            const row = results as RowDataPacket[];
            resolve({ users: row[0].users });
        });
    });
}

export async function updateUserBalance(id: number, amount: number) {
    const query = "UPDATE users SET balance = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
        pool.query(query, [amount, id], (error, results) => {
            if (error) {
                logger.error(error);
                return reject(error);
            }

            resolve(results); 
        });
    });
}

export async function getCurrentUserBalance(id: number): Promise<number> {
    const query = "SELECT balance FROM users WHERE id = ?";

    return new Promise((resolve, reject) => {
        pool.query(query, [id], (error, results) => {
            if (error) {
                logger.error(error);
                return reject(error);
            }

            const row = results as RowDataPacket[];
            resolve(row[0]?.balance || 0);
        });
    });
}

export async function getCurrentUserRubBalance(id: number): Promise<number>{
    const query = "SELECT balanceRub FROM users WHERE id = ?"

    return new Promise<number>((resolve, reject) => {
        pool.query(query, [id], (error, results) => {
            if (error){
                logger.error(error)
                return reject(error)
            }

            const row = results as RowDataPacket[]
            resolve(row[0]?.balance || 0)
        })
    })
}