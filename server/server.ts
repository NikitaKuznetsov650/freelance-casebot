import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./assets/logger/logger";
import refRoutes from "./src/routes/ref.routes";
import paymentRoutes from "./src/routes/payment.routes";
import casesRoutes from "./src/routes/cases.routes";
import usersRoutes from "./src/routes/users.routes";
import cryptoRoutes from "./src/routes/crypto.routes";
import allData from "./src/routes/getAllData.routes";
import {createServer} from "http";
import { Server } from "socket.io";

dotenv.config();

export const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://crypto-drop.netlify.app",
    credentials: true,
  }))

const server = createServer(app);

const io = new Server(server)

io.on("connect", (socket) => {
  console.log("WebSocket connection established");
  socket.emit("connect", "success");
});

app.use("/api/payments", paymentRoutes);
app.use("/api/ref", refRoutes);
app.use("/api/cases", casesRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/getAllData", allData);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`[server]: Server is running at http://localhost:${PORT}`);
});
