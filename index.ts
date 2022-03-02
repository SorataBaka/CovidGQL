import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import compression from "compression";
import favicon from "serve-favicon";
import { createClient } from "redis";

const app = express();
dotenv.config();

const PORT = (process.env.PORT as string) || 3000;
const REDIS_URL = (process.env.REDIS_URL as string) || undefined;

if (REDIS_URL === undefined) throw new Error("REDIS_URL is not defined");

import versionRouter from "./routes/versionrouter";
import SuccessReturnStatus from "./assets/classes/200returnstatus";

app.use(express.json());
app.use(versionRouter);
app.use(cors());
app.use(morgan("common"));
app.use(compression());
app.use(favicon(__dirname + "/../assets/favicon.ico"));

app.get("/", (req: Request, res: Response) => {
	const returnData = {
		message: "GraphQL API for Covid19 Status in Indonesia",
		versions: [
			{
				version: "v1",
				endpoints: ["/indonesia/graphql", "/indonesia/graphiql"],
			},
		],
	};
	return new SuccessReturnStatus(res, returnData);
});

const initializeRedis = async () => {
	const redisClient = createClient({
		url: REDIS_URL,
	});
	await redisClient.connect();
	redisClient.on("connect", () => {
		console.log("Redis connected");
	});
	return redisClient;
};
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
