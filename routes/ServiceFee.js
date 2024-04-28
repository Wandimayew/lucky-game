import express from "express";
import { checkRole } from "../middleware/CheckRoles.js";
import authenticateToken from "../middleware/ExtractToken.js"
import { getServiceFeesByCategory } from "../controller/ServiceFee.js";

const serviceFeeRoute=express.Router();


// serviceFeeRoute.get("/getServiceFee/:id",[authenticateToken, checkRole("USER")],getServiceFeesByCategory);
// serviceFeeRoute.post("/addServiceFee",[authenticateToken, checkRole("USER")],addServiceFee);

serviceFeeRoute.get("/getServiceFee/:id",getServiceFeesByCategory);



export default serviceFeeRoute;