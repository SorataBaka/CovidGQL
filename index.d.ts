export interface LatestIndonesianData {
	DataTotal: {
		OrangDalamPemantauan: number;
		PasienDalamPengawasan: number;
		TotalSpesimen: number;
		TotalSpesimenPositif: number;
		TotalSpesimenNegatif: number;
	};
	Penambahan: {
		ISOTimeStamp: string;
		Positif: number;
		Sembuh: number;
		Meninggal: number;
		Dirawat: number;
	};
	Harian: DailyUpdateData[];
}
export interface DailyUpdateData {
	UnixTimeStamp: number;
	ISOTimeStamp: string;
	Penambahan: {
		Positif: number;
		Sembuh: number;
		Meninggal: number;
		Dirawat: number;
	};
	Kumulatif: {
		Positif: number;
		Sembuh: number;
		Meninggal: number;
		Dirawat: number;
	};
}
