import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import { RootProvinceTotalData } from "../../../ResourceInterfaces/provjson";
import { RootDailyProvinceData } from "../../../ResourceInterfaces/provtimejson";
import {
	LatestProvinceData,
	DailyProvinceUpdate,
	ProvinceData,
} from "../../../types";
import redisClient from "../../../index";
const rest = async (req: Request, res: Response) => {
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
	const data = await retrieveProvinceData();
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
