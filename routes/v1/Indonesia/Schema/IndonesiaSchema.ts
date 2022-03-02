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

// let dataHash: string | undefined = undefined;
// let LatestData: LatestIndonesianData | undefined = undefined;

import redisClient from "../../../../index";
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
		TimeStamp: { type: GraphQLString },
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

const DailyData = new GraphQLObjectType({
	name: "DailyData",
	fields: () => ({
		UnixTimeStamp: { type: GraphQLFloat },
		ISOTimeStamp: { type: GraphQLString },
		Penambahan: { type: PenambahanHarian },
		Kumulatif: { type: KumulatifHarian },
	}),
});

const Total = new GraphQLObjectType({
	name: "Total",
	fields: () => ({
		JumlahPositif: { type: GraphQLInt },
		JumlahDirawat: { type: GraphQLInt },
		JumlahSembuh: { type: GraphQLInt },
		JumlahMeninggal: { type: GraphQLInt },
	}),
});

const RootIndonesianData = new GraphQLObjectType({
	name: "DataIndonesia",
	fields: () => ({
		DataTotalKumulatif: { type: DataTotal },
		Total: { type: Total },
		Penambahan: { type: PenambahanTerbaru },
		Harian: { type: new GraphQLList(DailyData) },
	}),
});

const responseQuery = new GraphQLObjectType({
	name: "ResponseQuery",
	fields: () => ({
		message: { type: GraphQLString },
		status: { type: GraphQLInt },
		currentHash: { type: GraphQLString },
		lastHash: { type: GraphQLString },
		query: { type: RootIndonesianData },
	}),
});
const retrieveAndParseData = async (): Promise<
	LatestIndonesianData | undefined
> => {
	const govdata = await axios
		.request({
			url: "https://data.covid19.go.id/public/api/update.json",
			method: "GET",
		})
		.catch((err) => {
			return undefined;
		});
	if (govdata === undefined) {
		const trygetdata = await redisClient.get("LatestData");
		if (trygetdata === null) {
			return undefined;
		}
		return JSON.parse(trygetdata);
	}
	const data = govdata.data as RootIndonesianTotalData;
	const latestHash = crypto
		.createHash("sha256")
		.update(JSON.stringify(data))
		.digest("hex");
	const currentHash = await redisClient.get("dataHash");
	if (currentHash === latestHash) {
		const latestData = await redisClient.get("LatestData");
		if (latestData !== null) {
			return JSON.parse(latestData);
		}
	}
	await redisClient.set("dataHash", latestHash);
	let dailyArray: DailyUpdateData[] = [];
	for (const dailyData of data.update.harian) {
		const day: DailyUpdateData = {
			ISOTimeStamp: dailyData.key_as_string,
			UnixTimeStamp: dailyData.key,
			Penambahan: {
				Positif: dailyData.jumlah_positif.value,
				Sembuh: dailyData.jumlah_sembuh.value,
				Meninggal: dailyData.jumlah_meninggal.value,
				Dirawat: dailyData.jumlah_dirawat.value,
			},
			Kumulatif: {
				Positif: dailyData.jumlah_positif_kum.value,
				Sembuh: dailyData.jumlah_sembuh_kum.value,
				Meninggal: dailyData.jumlah_meninggal_kum.value,
				Dirawat: dailyData.jumlah_dirawat_kum.value,
			},
		};
		dailyArray.push(day);
	}
	dailyArray.reverse();
	const parsedData: LatestIndonesianData = {
		DataTotalKumulatif: {
			OrangDalamPemantauan: data.data.jumlah_odp,
			PasienDalamPengawasan: data.data.jumlah_pdp,
			TotalSpesimen: data.data.total_spesimen,
			TotalSpesimenPositif:
				data.data.total_spesimen - data.data.total_spesimen_negatif,
			TotalSpesimenNegatif: data.data.total_spesimen_negatif,
		},
		Total: {
			JumlahPositif: data.update.total.jumlah_positif,
			JumlahDirawat: data.update.total.jumlah_dirawat,
			JumlahSembuh: data.update.total.jumlah_sembuh,
			JumlahMeninggal: data.update.total.jumlah_meninggal,
		},
		Penambahan: {
			TimeStamp: data.update.penambahan.created,
			Positif: data.update.penambahan.jumlah_positif,
			Sembuh: data.update.penambahan.jumlah_sembuh,
			Meninggal: data.update.penambahan.jumlah_meninggal,
			Dirawat: data.update.penambahan.jumlah_dirawat,
		},
		Harian: dailyArray,
	};
	return parsedData;
};

const rootQuery = new GraphQLObjectType({
	name: "RootQuery",
	description: "root query for indonesian route",
	fields: {
		DataTotalKumulatif: {
			type: DataTotal,
			resolve: async () => {
				const data = await retrieveAndParseData();
				if (data === undefined) {
					return undefined;
				}
				return data.DataTotalKumulatif;
			},
		},
		Total: {
			type: Total,
			resolve: async () => {
				const data = await retrieveAndParseData();
				if (data === undefined) {
					return undefined;
				}
				return data.Total;
			},
		},
		Penambahan: {
			type: PenambahanTerbaru,
			resolve: async () => {
				const data = await retrieveAndParseData();
				if (data === undefined) {
					return undefined;
				}
				return data.Penambahan;
			},
		},
		Harian: {
			type: new GraphQLList(DailyData),
			resolve: async () => {
				const data = await retrieveAndParseData();
				if (data === undefined) {
					return undefined;
				}
				return data.Harian;
			},
		},
	},
});

export default new GraphQLSchema({
	query: rootQuery,
});
