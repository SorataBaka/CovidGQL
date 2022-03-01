import express from "express";
const mainRouter = express.Router();

import IndonesianRouter from "./Indonesia/indonesia";
import Province from "./Province/province";

mainRouter.use("/indonesia", IndonesianRouter);
mainRouter.get("/province", Province);

export default mainRouter;
