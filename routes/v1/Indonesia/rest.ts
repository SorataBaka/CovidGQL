import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import { RootIndonesianTotalData } from "../../../ResourceInterfaces/updatejson";
import { LatestIndonesianData, DailyUpdateData } from "../../../types";

// let dataHash: string | undefined = undefined;
// let LatestData: LatestIndonesianData | undefined = undefined;

import redisClient from "../../../index";
const rest = async (req: Request, res: Response) => {
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
	const data: LatestIndonesianData | undefined = await retrieveAndParseData();
	if (data === undefined) {
		return res.status(500).json({
			status: 500,
			message: "Internal Server Error",
			data: {},
		});
	}
	return res.status(200).json({
		status: 200,
		message: "success",
		data: data,
	});
};
export default rest;
