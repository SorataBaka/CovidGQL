import {
	GraphQLString,
	GraphQLInt,
	GraphQLObjectType,
	GraphQLList,
	GraphQLSchema,
	GraphQLFloat,
} from "graphql";
import axios from "axios";
import crypto from "crypto";
import { RootIndonesianTotalData } from "../../../../ResourceInterfaces/updatejson";
import { LatestIndonesianData, DailyUpdateData } from "../../../../types";

const DataTotal = new GraphQLObjectType({
	name: "DataTotal",
	description: "Kumpulan kasus total",
	fields: () => ({
		Kasus: { type: GraphQLInt },
		Sembuh: { type: GraphQLInt },
		Meninggal: { type: GraphQLInt },
		Dirawat: { type: GraphQLInt },
	}),
});
const PenambahanTerbaru = new GraphQLObjectType({
	name: "Penambahan",
	description: "Penambahan terbaru",
	fields: () => ({
		Positif: { type: GraphQLInt },
		Sembuh: { type: GraphQLInt },
		Meninggal: { type: GraphQLInt },
	}),
});
const PenambahanHarian = new GraphQLObjectType({
	name: "PenambahanHarian",
	description: "Penambahan harian",
	fields: () => ({
		Tanggal: { type: GraphQLString },
		Penambahan: { type: PenambahanTerbaru },
		PenambahanKumulatif: { type: PenambahanTerbaru },
	}),
});

const Provinsi = new GraphQLObjectType({
	name: "Provinsi",
	description: "data provinsi satuan",
	fields: () => ({
		NamaProvinsi: { type: GraphQLString },
		Total: { type: DataTotal },
		Penambahan: { type: PenambahanTerbaru },
		PenambahanHarian: { type: new GraphQLList(PenambahanHarian) },
	}),
});

const rootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		DaftarProvinsi: {
			type: new GraphQLList(Provinsi),
			resolve: async () => {},
		},
		Provinsi: {
			type: Provinsi,
			args: {
				NamaProvinsi: { type: GraphQLString },
			},
			resolve: async (parent, args) => {},
		},
	},
});
