import express from "express";
import { graphqlHTTP } from "express-graphql";
import ProvinceSchema from "./Schema/ProvinceSchema";
const ProvinceRouter = express.Router();
import rest from "./rest";
ProvinceRouter.use(
	"/graphiql",
	graphqlHTTP({
		schema: ProvinceSchema,
		graphiql: true,
	})
);
ProvinceRouter.use(
	"/graphql",
	graphqlHTTP({
		schema: ProvinceSchema,
		graphiql: false,
	})
);
ProvinceRouter.get("/", rest);

export default ProvinceRouter;
