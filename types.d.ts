export interface LatestIndonesianData {
	DataTotalKumulatif: {
		OrangDalamPemantauan: number;
		PasienDalamPengawasan: number;
		TotalSpesimen: number;
		TotalSpesimenPositif: number;
		TotalSpesimenNegatif: number;
	};
	Total: {
		JumlahPositif: number;
		JumlahDirawat: number;
		JumlahSembuh: number;
		JumlahMeninggal: number;
	};
	Penambahan: {
		TimeStamp: string;
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
