// data.covid19.go.id/public/api/prov.json

export interface RootProvinceTotalData {
	last_date: string;
	current_data: number;
	missing_data: number;
	tanpa_provinsi: number;
	list_data: TotalKasusProvinsi[];
}
export interface TotalKasusProvinsi {
	key:
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
	doc_count: number;
	jumlah_kasus: number;
	jumlah_sembuh: number;
	jumlah_meninggal: number;
	jumlah_dirawat: number;
	jenis_kelamin: JenisKelamin[];
	kelompok_umur: KelompokUmur[];
	lokasi: {
		lon: number;
		lat: number;
	};
	penambahan: PenambahanKasusProvinsiHarian;
}

interface JenisKelamin {
	key: "LAKI-LAKI" | "PEREMPUAN";
	doc_count: number;
}
interface KelompokUmur {
	key: "0-5" | "6-18" | "19-30" | "31-45" | "46-59" | "≥ 60";
	doc_count: number;
	usia: {
		value: number;
	};
}
export interface PenambahanKasusProvinsiHarian {
	positif: number;
	sembuh: number;
	meninggal: number;
}
