import express from "express";
// import { addUser, getUser,addCategory,getCategory,getCategoryChoices,addCategoryChoice,getUserChoices,addUserChoice } from "../controller/User.js";
import { checkRole } from "../middleware/CheckRoles.js";
import authenticateToken from "../middleware/ExtractToken.js";
import {getUserBalance,getUserCount} from "../controller/User.js";

const userRoute=express.Router();

userRoute.get("/getUserBalance/:player_id",[authenticateToken, checkRole("USER")],getUserBalance);
userRoute.get("/getUserCount",[authenticateToken, checkRole("USER")],getUserCount);

// userRoute.post("/user",[ authenticateToken, checkRole("ADMIN")],addUser);
// userRoute.get("/user",[authenticateToken, checkRole("USER")],getUser);
// userRoute.get("/admin",[authenticateToken, checkRole("ADMIN")],addUser);
// userRoute.get("/getCategory",[authenticateToken, checkRole("USER")],getCategory);
// userRoute.post("/addCategory",[authenticateToken, checkRole("USER")],addCategory);
// userRoute.post("/addCategoryChoice",[authenticateToken, checkRole("USER")],addCategoryChoice);
// userRoute.get("/getCategoryChoices/:id",[authenticateToken, checkRole("USER")],getCategoryChoices);
// userRoute.get("/getUserChoices/:id",[authenticateToken, checkRole("USER")],getUserChoices);
// userRoute.post("/addUserChoice",[authenticateToken, checkRole("USER")],addUserChoice);

// userRoute.post("/signup",signup);

export default userRoute;