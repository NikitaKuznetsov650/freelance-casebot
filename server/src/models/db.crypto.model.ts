import { pool } from "../services/connection.service";

export async function dbGetCrypto(tableName: string, cryptos: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        const placeholders = cryptos.map(() => '?').join(', ');
        const query = `SELECT name, amount, network FROM ?? WHERE name IN (${placeholders})`;
        
        pool.query(query, [tableName, ...cryptos], (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
}