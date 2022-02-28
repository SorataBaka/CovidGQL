import express from "express"

const versionRouter = express.Router()
import v1router from "./v1/v1router"

versionRouter.use("/v1", v1router)

export default versionRouter