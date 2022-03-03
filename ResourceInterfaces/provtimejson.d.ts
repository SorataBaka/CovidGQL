// https://data.covid19.go.id/public/api/prov_time.json

export interface RootDailyProvinceData {
	missing_date: number;
	list: DailyData[];
}
export interface DailyData {
	date: string;
	total: number;
	cur_total: number;
	data: DailyProvinceData[];
}
export interface DailyProvinceData {
	title:
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
		| "LAMPUNG TENGAH"
		| null;
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
	cur_doc_count: number;
	doc_count: number;
	persen: number;
	lokasi?: {
		lon: number;
		lat: number;
	};
}
