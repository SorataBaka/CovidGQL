import express, {Request, Response} from "express"
const app = express()

app.get("/", (req:Request, res:Response) => {
  return res.send("Hello World")
})

app.listen(30, () => {
  console.log("Listening on port 3000")
})