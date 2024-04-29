import express from "express";
import { addTransaction, getTransactionsByCategory,getTransactionCount,cancelWithDraw,completeWithDraw,getCompletedWithDraw,addWithDraw,getPendingBalance, getTransactionsByGame, getTransactionsByPlayer ,addBalance} from "../controller/Transactions.js";

const transactionRoute=express.Router();


// transactionRoute.get("/getTransaction/:id",[authenticateToken, checkRole("USER")],getTransactionsByPlayer);
// transactionRoute.post("/addTransaction",[authenticateToken, checkRole("USER")],addTransaction);


transactionRoute.get("/getTransaction/:id",getTransactionsByPlayer);
transactionRoute.post("/addTransaction",addTransaction);
transactionRoute.get("/getTransactionsByGame/:id",getTransactionsByGame);
transactionRoute.get("/getTransactionsByCategory/:id",getTransactionsByCategory);
transactionRoute.post("/addBalance",addBalance);
transactionRoute.get("/getPendingBalance",getPendingBalance);
transactionRoute.post("/addWithDraw/:player_id",addWithDraw);
transactionRoute.get("/getCompletedWithDraw",getCompletedWithDraw);
transactionRoute.post("/completeWithDraw",completeWithDraw);
transactionRoute.delete("/cancelWithDraw",cancelWithDraw);
transactionRoute.get("/getTransactionCount",getTransactionCount);


export default transactionRoute;