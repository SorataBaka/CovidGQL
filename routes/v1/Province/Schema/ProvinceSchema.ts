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
import { RootProvinceTotalData } from "../../../../ResourceInterfaces/provjson";
import { RootDailyProvinceData } from "../../../../ResourceInterfaces/provtimejson";
import {
	LatestProvinceData,
	DailyProvinceUpdate,
	ProvinceData,
} from "../../../../types";
import redisClient from "../../../../index";
const Total = new GraphQLObjectType({
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
		Penambahan: { type: GraphQLInt },
		PenambahanKumulatif: { type: GraphQLInt },
	}),
});

const Provinsi = new GraphQLObjectType({
	name: "Provinsi",
	description: "data provinsi satuan",
	fields: () => ({
		ProvinceName: { type: GraphQLString },
		Total: { type: Total },
		Penambahan: { type: PenambahanTerbaru },
		PenambahanHarian: { type: new GraphQLList(PenambahanHarian) },
	}),
});

const ProvinceDataUpdate = new GraphQLObjectType({
	name: "DailyProvinceUpdate",
	description: "data provinsi harian",
	fields: () => ({
		LastUpdate: { type: GraphQLString },
		ProvinceList: { type: new GraphQLList(Provinsi) },
	}),
});
const retrieveProvinceData = async (): Promise<
	LatestProvinceData | undefined
> => {
	const baseProvinceData = await axios
		.request({
			url: "https://data.covid19.go.id/public/api/prov.json",
			method: "GET",
		})
		.catch((err) => {
			return undefined;
		});
	const dailyProvinceData = await axios
		.request({
			url: "https://data.covid19.go.id/public/api/prov_time.json",
			method: "GET",
		})
		.catch((err) => {
			return undefined;
		});
	if (baseProvinceData === undefined || dailyProvinceData === undefined) {
		const checkCachedData = await redisClient
			.get("LatestProvinceData")
			.catch((err) => {
				return undefined;
			});
		if (checkCachedData === null || checkCachedData === undefined) {
			return undefined;
		}
		return JSON.parse(checkCachedData);
	}
	const provinceData = baseProvinceData.data as RootProvinceTotalData;
	const provinceDailyData = dailyProvinceData.data as RootDailyProvinceData;
	const provideDataString = JSON.stringify(provinceData);
	const provideDailyDataString = JSON.stringify(provinceDailyData);
	const MixedString = provideDataString + provideDailyDataString;
	const hash = crypto.createHash("sha256").update(MixedString).digest("hex");
	const checkCachedData = await redisClient
		.get("provinceDataHash")
		.catch((err) => {
			return undefined;
		});
	if (checkCachedData === hash) {
		const checkCachedData = await redisClient
			.get("LatestProvinceData")
			.catch((err) => {
				return undefined;
			});
		if (checkCachedData !== null && checkCachedData !== undefined) {
			return JSON.parse(checkCachedData);
		}
	}
	await redisClient.set("provinceDataHash", hash).catch();
	let ProvinceDataList: ProvinceData[] = [];
	for (const baseProvinceData of provinceData.list_data) {
		let dailyData: DailyProvinceUpdate[] = [];
		for (const dailyUpdate of provinceDailyData.list) {
			const selectedProvinceData = dailyUpdate.data.filter((data) => {
				return data.key === baseProvinceData.key;
			});
			if (selectedProvinceData.length === 0) continue;
			const day: DailyProvinceUpdate = {
				Penambahan: selectedProvinceData[0].cur_doc_count,
				PenambahanKumulatif: selectedProvinceData[0].doc_count,
				Tanggal: dailyUpdate.date,
			};
			dailyData.push(day);
		}

		const NewProvinceData: ProvinceData = {
			ProvinceName: baseProvinceData.key,
			Total: {
				Kasus: baseProvinceData.jumlah_kasus,
				Dirawat: baseProvinceData.jumlah_dirawat,
				Meninggal: baseProvinceData.jumlah_meninggal,
				Sembuh: baseProvinceData.jumlah_sembuh,
			},
			Penambahan: {
				Positif: baseProvinceData.penambahan.positif,
				Sembuh: baseProvinceData.penambahan.sembuh,
				Meninggal: baseProvinceData.penambahan.meninggal,
			},
			PenambahanHarian: dailyData,
		};
		ProvinceDataList.push(NewProvinceData);
	}
	const parsedData: LatestProvinceData = {
		LastUpdate: provinceData.last_date,
		ProvinceList: ProvinceDataList,
	};
	await redisClient
		.set("LatestProvinceData", JSON.stringify(parsedData))
		.catch();
	return parsedData;
};

const rootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		DataProvinsi: {
			type: ProvinceDataUpdate,
			description: "Semua data provinsi",
			resolve: async () => {
				const data = await retrieveProvinceData();
				if (data === undefined) {
					return undefined;
				}
				return data;
			},
		},
		Provinsi: {
			type: Provinsi,
			description: "Data provinsi satuan",
			args: {
				NamaProvinsi: { type: GraphQLString },
			},
			resolve: async (parent, args) => {
				const data = await retrieveProvinceData();
				if (data === undefined) {
					return undefined;
				}
				const provinceData = data.ProvinceList.filter(
					(province) =>
						province.ProvinceName === args.NamaProvinsi.toUpperCase()
				);
				if (provinceData.length === 0) {
					return undefined;
				}
				return provinceData[0];
			},
		},
	},
});

export default new GraphQLSchema({
	query: rootQuery,
});
