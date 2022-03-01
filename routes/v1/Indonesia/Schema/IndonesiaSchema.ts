import {
	GraphQLString,
	GraphQLInt,
	GraphQLObjectType,
	GraphQLList,
	GraphQLSchema,
} from "graphql";
import axios from "axios";
import { CurrentTotal } from "../../../../resourceinterfaces/updatejson";

const DataTotal = new GraphQLObjectType({
	name: "DataTotal",
	fields: () => ({
		OrangDalamPemantauan: { type: GraphQLInt },
		PasienDalamPengawasan: { type: GraphQLInt },
		TotalSpesimen: { type: GraphQLInt },
		TotalSpesimenPositif: { type: GraphQLInt },
		TotalSpesimenNegatif: { type: GraphQLInt },
	}),
});

const PenambahanTerbaru = new GraphQLObjectType({
	name: "Penambahan",
	fields: () => ({
		ISOTimeStamp: { type: GraphQLString },
		Positif: { type: GraphQLInt },
		Sembuh: { type: GraphQLInt },
		Meninggal: { type: GraphQLInt },
		Dirawat: { type: GraphQLInt },
	}),
});

const PenambahanHarian = new GraphQLObjectType({
	name: "PenambahanHarian",
	fields: () => ({
		Positif: { type: GraphQLInt },
		Sembuh: { type: GraphQLInt },
		Meninggal: { type: GraphQLInt },
		Dirawat: { type: GraphQLInt },
	}),
});

const KumulatifHarian = new GraphQLObjectType({
	name: "KumulatifHarian",
	fields: () => ({
		Positif: { type: GraphQLInt },
		Sembuh: { type: GraphQLInt },
		Meninggal: { type: GraphQLInt },
		Dirawat: { type: GraphQLInt },
	}),
});

const DailyUpdateData = new GraphQLObjectType({
	name: "DailyUpdateData",
	fields: () => ({
		UnixTimeStamp: { type: GraphQLInt },
		ISOTimeStamp: { type: GraphQLString },
		Penambahan: { type: PenambahanHarian },
		Kumulatif: { type: KumulatifHarian },
	}),
});

const RootIndonesianData = new GraphQLObjectType({
	name: "RootIndonesianData",
	fields: () => ({
		DataTotal: { type: DataTotal },
		Penambahan: { type: PenambahanTerbaru },
		Harian: { type: new GraphQLList(DailyUpdateData) },
	}),
});

export default new GraphQLSchema({
	query: RootIndonesianData,
});
