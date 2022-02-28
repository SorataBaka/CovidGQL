import express from "express"
const mainRouter = express.Router()

import Indonesia from "./Indonesia/indonesia"
import Province from "./Province/province"

mainRouter.get("/indonesia", Indonesia)
mainRouter.get("/province", Province)

export default mainRouter