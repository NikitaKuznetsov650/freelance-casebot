import { waitForText } from "../utils/waitForText.js";
import { addPercentUser, checkUserExistsByUsername } from "./insertUser.js";
import * as fs from 'fs'

export async function addUserPercantage(bot, chatId) {
    await bot.sendMessage(chatId, "Пришлите мне username пользователя");

    const username = await waitForText(bot, chatId);

    if (!username) {
        return await bot.sendMessage(chatId, "Вы не ввели username.");
    }

    checkUserExistsByUsername(username, async (error, exists) => {
        if (error) {
            console.error("Ошибка при проверке пользователя:", error);
            return await bot.sendMessage(chatId, "Произошла ошибка при проверке пользователя.");
        }

        if (!exists) {
            return await bot.sendMessage(chatId, "Такого пользователя не существует в базе данных");
        }

        await bot.sendMessage(chatId, `Пользователь ${username} найден. Вы можете установить процент.`);
        const percent = await waitForText(bot, chatId)

        await addPercentUser(username, percent)

        return await bot.sendMessage(chatId, "Вы успешно подкрутили пользователю")
    });
}
