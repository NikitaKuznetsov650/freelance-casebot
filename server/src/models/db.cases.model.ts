import { pool } from "../services/connection.service";
import logger from "../../assets/logger/logger";
import {QueryError, QueryResult, RowDataPacket} from "mysql2";
import {getCoinData} from "../controllers/crypto.controller";

export async function getCase(tableName: string) {
    const query = `SELECT * FROM ??;`;
    return new Promise((resolve, reject) => {
        pool.query(query, [tableName], (error, results) => {
            if (error) {
                logger.error("error: " + error);
                return reject(error); 
            }
            results = results as RowDataPacket[]
            const processedResults = results.map((result) => getCoinData(String(result.name + "USDT")));
            resolve(processedResults);
        });
    });
}

export async function insertCaseCounter(){
    const query = "UPDATE cases SET casesAmount = casesAmount + 1;"
    return new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
            if(error){
                return reject(error)
            }

            resolve(results)
        })
    })
}

export async function randomDrop(tableName: string, circles: number): Promise<RowDataPacket[]> {
    console.log("randomDrop - Запрос уникальных имён из таблицы:", tableName);

    const uniqueNamesQuery = `SELECT DISTINCT name FROM ??`;

    const uniqueNames: string[] = await new Promise<string[]>((resolve, reject) => {
        pool.query(uniqueNamesQuery, [tableName], (error, results) => {
            if (error) {
                console.error("randomDrop - Ошибка при получении уникальных имён:", error);
                return reject(new Error("Ошибка при получении уникальных имен: " + error.message));
            }

            console.log("randomDrop - Уникальные имена, полученные из базы данных:", results);

            const names: string[] = (results as RowDataPacket[]).map(result => {
                const symbol: string = result.name;
                console.log("randomDrop - Добавление символа:", symbol);
                return symbol;
            });

            resolve(names);
        });
    });

    const selectedCoins: RowDataPacket[] = [];

    for (let i = 0; i < circles; i++) {
        const randomName = uniqueNames[Math.floor(Math.random() * uniqueNames.length)];
        console.log(`randomDrop - Случайно выбранное имя для круга ${i + 1}:`, randomName);

        const query = `
        SELECT * FROM ?? 
        WHERE name = ?
        `;

        const rows = await new Promise<RowDataPacket[]>((resolve, reject) => {
            pool.query(query, [tableName, randomName], (error, results) => {
                if (error) {
                    console.error("randomDrop - Ошибка при выборке данных:", error);
                    return reject(new Error("Ошибка при выборке данных: " + error.message));
                }

                const rows = results as RowDataPacket[];
                console.log(`randomDrop - Данные, полученные из выборки для круга ${i + 1}:`, rows);
                resolve(rows);
            });
        });

        const weightedCoins: RowDataPacket[] = [];

        rows.forEach((coin) => {
            getCoinData(String(coin))
            const percentage = coin.percentage;
            if (percentage > 0) {
                for (let i = 0; i < percentage; i++) {
                    weightedCoins.push(coin);
                }
            }
        });

        if (weightedCoins.length > 0) {
            const randomCoin = weightedCoins[Math.floor(Math.random() * weightedCoins.length)];
            console.log(`randomDrop - Случайно выбранная монета для круга ${i + 1}:`, randomCoin);
            selectedCoins.push(randomCoin);
        } else {
            console.error(`randomDrop - Нет монет с корректным процентом для круга ${i + 1}`);
        }
    }
    return selectedCoins;
}


export async function getCasesAmountDb(): Promise<unknown> {
    const query = "SELECT casesAmount FROM cases";

    return new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }

            const rows = results as RowDataPacket[];
            resolve(rows[0].casesAmount);
        });
    });
}
 