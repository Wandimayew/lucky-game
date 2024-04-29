import express from "express";
import { checkRole } from "../middleware/CheckRoles.js";
import authenticateToken from "../middleware/ExtractToken.js"
import { getWinnersByGame ,getAllWinners,getWinnerCount} from "../controller/Winner.js";

const winnerRoute=express.Router();


winnerRoute.get("/getWinner/:id",[authenticateToken, checkRole("default-roles-demo")],getWinnersByGame);
winnerRoute.get("/getAllWinners",getAllWinners);
winnerRoute.get("/getWinnerCount",getWinnerCount)


// winnerRoute.get("/getWinner/:id",[authenticateToken, checkRole("USER")],getWinnersByGame);
// winnerRoute.post("/addWinner",[authenticateToken, checkRole("USER")],addWinner);


export default winnerRoute;