import express from "express";
import { addTransaction, getTransactionsByCategory, getTransactionsByGame, getTransactionsByPlayer ,addBalance} from "../controller/Transactions.js";

const transactionRoute=express.Router();


// transactionRoute.get("/getTransaction/:id",[authenticateToken, checkRole("USER")],getTransactionsByPlayer);
// transactionRoute.post("/addTransaction",[authenticateToken, checkRole("USER")],addTransaction);


transactionRoute.get("/getTransaction/:id",getTransactionsByPlayer);
transactionRoute.post("/addTransaction",addTransaction);
transactionRoute.get("/getTransactionsByGame/:id",getTransactionsByGame);
transactionRoute.get("/getTransactionsByCategory/:id",getTransactionsByCategory);
transactionRoute.post("/addBalance",addBalance);


export default transactionRoute;