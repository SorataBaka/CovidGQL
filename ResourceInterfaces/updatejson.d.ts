// data.covid19.go.id/public/api/update.json
export interface RootIndonesianTotalData {
	data: CurrentTotal;
	update: Update;
}
export interface CurrentTotal {
	id: number;
	jumlah_odp: number;
	jumlah_pdp: number;
	total_spesimen: number;
	total_spesimen_negatif: number;
}
export interface Update {
	penambahan: PenambahanTerbaruSeluruhIndonesia;
	harian: PenambahanHarianSeluruhIndonesia[];
	total: TotalSeluruhIndonesia;
}
export interface PenambahanTerbaruSeluruhIndonesia {
	jumlah_positif: number;
	jumlah_meninggal: number;
	jumlah_sembuh: number;
	jumlah_dirawat: number;
	tanggal: string;
	created: string;
}
export interface TotalSeluruhIndonesia {
	jumlah_positif: number;
	jumlah_dirawat: number;
	jumlah_sembuh: number;
	jumlah_meninggal: number;
}
export interface PenambahanHarianSeluruhIndonesia {
	key_as_string: string;
	key: number; // This is a unix timestamp
	doc_count: number;
	jumlah_meninggal: {
		value: number;
	};
	jumlah_sembuh: {
		value: number;
	};
	jumlah_positif: {
		value: number;
	};
	jumlah_dirawat: {
		value: number;
	};
	jumlah_positif_kum: {
		value: number;
	};
	jumlah_sembuh_kum: {
		value: number;
	};
	jumlah_meninggal_kum: {
		value: number;
	};
	jumlah_dirawat_kum: {
		value: number;
	};
}
