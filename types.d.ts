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

export interface LatestProvinceData {
	LastUpdate: string;
	ProvinceList: ProvinceData[];
}
export interface ProvinceData {
	ProvinceName:
		| "DKI JAKARTA"
		| "JAWA BARAT"
		| "JAWA TENGAH"
		| "JAWA TIMUR"
		| "BANTEN"
		| "DAERAH ISTIMEWA YOGYAKARTA"
		| "KALIMANTAN TIMUR"
		| "BALI"
		| "RIAU"
		| "SUMATERA UTARA"
		| "SULAWESI SELATAN"
		| "SUMATERA BARAT"
		| "KALIMANTAN SELATAN"
		| "SUMATERA SELATAN"
		| "NUSA TENGGARA TIMUR"
		| "LAMPUNG"
		| "KEPULAUAN RIAU"
		| "KEPULAUAN BANGKA BELITUNG"
		| "KALIMANTAN BARAT"
		| "SULAWESI TENGAH"
		| "KALIMANTAN TENGAH"
		| "SULAWESI UTARA"
		| "PAPUA"
		| "ACEH"
		| "KALIMANTAN UTARA"
		| "NUSA TENGGARA BARAT"
		| "JAMBI"
		| "PAPUA BARAT"
		| "BENGKULU"
		| "SULAWESI TENGGARA"
		| "MALUKU"
		| "SULAWESI BARAT"
		| "MALUKU UTARA"
		| "GORONTALO"
		| "LAMPUNG TENGAH";
	Total: {
		Kasus: number;
		Sembuh: number;
		Meninggal: number;
		Dirawat: number;
	};
	Penambahan: {
		Positif: number;
		Sembuh: number;
		Meninggal: number;
	};
	PenambahanHarian: DailyProvinceUpdate[];
}
export interface DailyProvinceUpdate {
	Tanggal: string;
	Penambahan: number;
	PenambahanKumulatif: number;
}
