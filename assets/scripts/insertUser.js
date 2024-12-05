import { pool } from "../db/connection.js";
import { adminKeyboard, webAppKeyboard } from "../keyboard/keyboard.js";

export async function checkUserExists(id, callback) {
    pool.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error("Error checking user:", error);
            return callback(error, null);
        }
        callback(null, results.length > 0);
    });
}

export async function addUser(id, username, firstName, lastName, ref, origin, balance, cryptoBalance, admin, chatId) {
    const query = `
        INSERT INTO users 
        (id, username, firstName, lastName, ref, origin, balance, cryptobalance, admin, chatId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [id, username, firstName, lastName, ref, origin, balance, cryptoBalance, admin, chatId];

    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
            if (error) {
                console.error("Error adding user:", error.message);
                return reject(error);
            }
            console.info("User added successfully:", results);
            resolve(results);
        });
    });
}


export async function checkAdmin(userId, bot, msg) {
    try {
        const status = await getStatus(userId);

        if (status === 1) {
            await bot.sendMessage(
                msg.chat?.id,
                `Привет, админ ${msg.from?.username}. Ваш статус: ${status}`,
                adminKeyboard
            );
        } else {
            await bot.sendMessage(
                msg.chat?.id,
                `Привет, ${msg.from?.username}.`,
                webAppKeyboard
            );
        }
    } catch (error) {
        console.error("Ошибка проверки статуса администратора:", error.message);
        await bot.sendMessage(
            msg.chat.id,
            "Произошла ошибка при проверке статуса. Попробуйте позже."
        );
    }
}

async function getStatus(userId) {
    const query = 'SELECT admin FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
        pool.query(query, [userId], (error, results) => {
            if (error) {
                return reject(new Error("Ошибка базы данных: " + error.message));
            }

            if (results.length === 0) {
                return resolve(null); // Пользователь не найден
            }

            resolve(results[0].admin); // Возвращаем статус admin (может быть 0, 1 или любое другое)
        });
    });
}

export async function checkUserExistsByUsername(username, callback) {
    pool.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error("Ошибка при проверке пользователя:", error);
            return callback(error, null);
        }
        callback(null, results.length > 0);
    });
}

export async function addPercentUser(username, percent){
    pool.query('INSERT INTO users_percent VALUES (?, ?)', [username, percent], (error, results) => {
        if(error){
            return console.error(error)
        }
    })
}