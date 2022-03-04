import { Response } from "express";
export default class SuccessReturnStatus {
	constructor(res: Response, data: object) {
		return res.status(200).json({
			message: "success",
			status: 200,
			data: {
				...data,
			},
		});
	}
}
