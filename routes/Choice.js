import express from "express";
import { checkRole } from "../middleware/CheckRoles.js";
import authenticateToken from "../middleware/ExtractToken.js"
import {getUserChoicesByPlayer,addUserChoice,getUserChoiceByCategory} from "../controller/Choice.js";

const choiceRoute=express.Router();


choiceRoute.get("/getUserChoices/:id",[authenticateToken, checkRole("default-roles-demo")],getUserChoicesByPlayer);
choiceRoute.post("/addUserChoice",[authenticateToken, checkRole("default-roles-demo")],addUserChoice);
choiceRoute.get("/getUserChoiceByCategory",[authenticateToken, checkRole("default-roles-demo")],getUserChoiceByCategory);


// choiceRoute.get("/getUserChoices/:id",[authenticateToken, checkRole("USER")],getUserChoices);
// choiceRoute.post("/addUserChoice",[authenticateToken, checkRole("USER")],addUserChoice);
// choiceRoute.get("/getUserChoiceByCategory",[authenticateToken, checkRole("USER")],getUserChoiceByCategory);



export default choiceRoute;