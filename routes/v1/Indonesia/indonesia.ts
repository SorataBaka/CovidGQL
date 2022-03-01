import express from "express";
import { graphqlHTTP } from "express-graphql";
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

export default IndonesianRouter;
