import { Request, Response } from "express"
import SuccessReturnStatus from "../../../assets/classes/200returnstatus"
export default (req: Request, res: Response) => {
  return new SuccessReturnStatus(res, {
    data1: "random1",
    data2: "random2"
  })
}