import express from "express";
import { graphqlHTTP } from "express-graphql";
import rest from "./rest";
import IndonesianSchema from "./Schema/IndonesiaSchema";
const IndonesianRouter = express.Router();

IndonesianRouter.use(
	"/graphiql",
	graphqlHTTP({
		schema: IndonesianSchema,
		graphiql: true,
	})
);
IndonesianRouter.use(
	"/graphql",
	graphqlHTTP({
		schema: IndonesianSchema,
		graphiql: false,
	})
);
IndonesianRouter.get("/", rest);

export default IndonesianRouter;
