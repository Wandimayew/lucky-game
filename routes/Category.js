import express from "express";
import { checkRole } from "../middleware/CheckRoles.js";
import authenticateToken from "../middleware/ExtractToken.js"
import {addCategory,getCategory,getNotSelectedChoice,getCategoryCount} from "../controller/Category.js";


const categoryRoute=express.Router();


categoryRoute.get("/getCategory",[authenticateToken, checkRole("USER")],getCategory);
categoryRoute.post("/addCategory",addCategory);
categoryRoute.post("/getNotSelectedChoice",getNotSelectedChoice);
categoryRoute.get("/getCategoryCount",[authenticateToken, checkRole("USER")],getCategoryCount);


// categoryRoute.get("/getCategory",[authenticateToken, checkRole("USER")],getCategory);
// categoryRoute.post("/addCategory",[authenticateToken, checkRole("USER")],addCategory);
// categoryRoute.post("/addCategoryChoice",[authenticateToken, checkRole("USER")],addCategoryChoice);
// categoryRoute.get("/getCategoryChoices/:id",[authenticateToken, checkRole("USER")],getCategoryChoices);

export default categoryRoute;