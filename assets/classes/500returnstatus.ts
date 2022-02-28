import { Response } from 'express'
export default class SuccessReturnStatus {
  constructor(res:Response, data:any|undefined){
    return res.status(200).json({
      message: "Internal server error",
      status: 500,
      data: data || undefined
    })
  }
}