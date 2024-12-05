import { Server } from "socket.io";
import http from "http";
import { app } from "../../server"; // Express-приложение

let io: Server;
let onlineUsers = new Set<string>();

export function initializeSocket(server: http.Server) {
    io = new Server(server, {
        cors: {
            origin: "https://crypto-drop.netlify.app", // Настройте ваш фронтенд
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        onlineUsers.add(socket.id);

        // Отправка информации о подключении всем клиентам
        io.emit("onlineUsers", { count: onlineUsers.size });

        // Пример: отправка данных только текущему клиенту
        socket.emit("welcome", {
            message: "Welcome to the server!",
            userId: socket.id,
        });

        socket.on("disconnect", () => {
            onlineUsers.delete(socket.id);
            console.log("User disconnected:", socket.id);

            // Обновляем данные для всех клиентов
            io.emit("onlineUsers", { count: onlineUsers.size });
        });
    });
}

export function getSocketIO() {
    if (!io) {
        throw new Error("Socket.IO is not initialized!");
    }
    return io;
}
