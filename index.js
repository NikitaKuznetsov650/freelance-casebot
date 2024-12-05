import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';
import { addUser, checkAdmin, checkUserExists } from './assets/scripts/insertUser.js';
import { adminKeyboard, webAppKeyboard } from './assets/keyboard/keyboard.js';
import axios from "axios";
import { addUserPercantage } from "./assets/scripts/adminFunctions.js";

dotenv.config({ path: './assets/modules/.env' });

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.on('message', async (msg) => {
    if (msg.text?.includes("/start")) {
        const ref = `${process.env.BOT_LINK}?start=${msg.chat?.id}`;
        console.info(`Referral link: ${ref}`);
        console.log(msg);

        const userId = msg.from?.id;
        const chatId = msg.chat?.id;
        const firstName = msg.from?.first_name;
        const lastName = msg.from?.last_name;
        const username = msg.from?.username;
        const origin = msg.text.replace("/start ", "") || "";

        checkUserExists(userId, async (error, exists) => {
            if (error) {
                return console.error('Error checking user');
            }

            if (!exists) {
                try {
                    await addUser(
                        userId,             // id
                        username,           // username
                        firstName,          // firstName
                        lastName,           // lastName
                        ref,                // ref
                        origin, 
                        chatId,            // origin
                        0,                  // balance (начальный баланс)
                        0,                  // cryptoBalance (начальный крипто-баланс)
                        false               // admin (по умолчанию false)
                    );
                } catch (error) {
                    console.error("Failed to add user:", error.message);
                }
            }

            checkAdmin(userId, bot, msg);


            console.info('User already exists in the database');
        });
    }
});

bot.on('callback_query', async (msg) => {
    if(msg.data === "add_percantage_user"){
        await addUserPercantage(bot, msg.message.chat.id)
    }
})

bot.on('polling_error', console.log);
