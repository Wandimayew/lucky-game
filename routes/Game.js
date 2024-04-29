import express from "express";
import { checkRole } from "../middleware/CheckRoles.js";
import authenticateToken from "../middleware/ExtractToken.js"
import { getGamesByCategory,addGame,getGamesCount } from "../controller/Game.js";

const gameRoute=express.Router();


gameRoute.get("/getGame",[authenticateToken, checkRole("default-roles-demo")],getGamesByCategory);
gameRoute.post("/addGame/:id",[authenticateToken, checkRole("default-roles-demo")],addGame);
gameRoute.get("/getGamesCount",getGamesCount);


// gameRoute.get("/getGame/:id",[authenticateToken, checkRole("USER")],getGamesByCategory);
// gameRoute.post("/addGame",[authenticateToken, checkRole("USER")],addGame);


export default gameRoute;