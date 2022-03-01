import {
	GraphQLString,
	GraphQLInt,
	GraphQLObjectType,
	GraphQLList,
	GraphQLSchema,
	GraphQLFloat,
} from "graphql";
import axios from "axios";
import { RootIndonesianTotalData } from "../../../../resourceinterfaces/updatejson";
import { LatestIndonesianData, DailyUpdateData } from "../../../../types";
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

const rootQuery = new GraphQLObjectType({
	name: "RootQuery",
	description: "root query for indonesian route",
	fields: {
		IndonesianData: {
			type: RootIndonesianData,
			resolve: async () => {
				const govdata = await axios
					.request({
						url: "https://data.covid19.go.id/public/api/update.json",
						method: "GET",
					})
					.catch((err) => {
						return undefined;
					});
				if (govdata === undefined)
					return {
						message: "internal server error",
						status: 500,
						data: {},
					};
				const data = govdata.data as RootIndonesianTotalData;
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
			},
		},
	},
});

export default new GraphQLSchema({
	query: rootQuery,
});
