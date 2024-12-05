
export const webAppKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "Web App",
                web_app: {
                    url: "https://crypto-drop.netlify.app"
                }
            }]
        ]
    }
}

export const adminKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{text: "Добавить подкрут для пользователя", callback_data: "add_percantage_user"}]
        ]
    }
}