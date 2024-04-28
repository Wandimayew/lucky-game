import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import keycloak from "./middleware/Keycloak.js";
import userRoute from "./routes/User.js";
import choiceRoute from "./routes/Choice.js";
import categoryRoute from "./routes/Category.js";
import gameRoute from "./routes/Game.js";
import transactionRoute from "./routes/Transactions.js";
import winnerRoute from "./routes/Winner.js";
import serviceFeeRoute from "./routes/ServiceFee.js";
import http from 'http';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Listen for 'addChoice' event
    socket.on('addChoice', (data) => {
        console.log('addChoice event received:', data);
        // Process the event data here
    });
});

// io.emit('gameWon', {
//     message: 'Game won',
//   });
//   io.emit('userChoiceUpdated', { 
//     message: 'User choice updated',
//   });

dotenv.config();
app.use(cors());
app.use(keycloak.middleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Use body-parser middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));


app.use("/api/game",gameRoute);
app.use("/api/transaction",transactionRoute);
app.use("/api/winner",winnerRoute);
app.use("/api/servicefee",serviceFeeRoute);
app.use("/api/choice",choiceRoute);
app.use("/api/category",categoryRoute);
app.use("/api/user",userRoute);

const PORT = process.env.PORT;

server.listen(PORT, console.log(`server is running on port ${PORT}`));