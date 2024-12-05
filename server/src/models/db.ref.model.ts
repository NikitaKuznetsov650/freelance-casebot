import { pool } from "../services/connection.service";
import { RowDataPacket } from "mysql2";

export async function getRefByChatId(chatId: number) {
    return new Promise((resolve, reject) => {
        const query = "SELECT ref , COUNT(origin) AS originCount FROM users WHERE chatId = ?"
        pool.query(query, [chatId, chatId], (error, results) => {
            if (error) {
                return reject(error);
            }

            const rows = results as RowDataPacket[];

            console.log(rows)
            resolve({
                ref: rows[0].ref,
                originCount: rows[0]?.originCount
            });
         });
    });
}
