const axios = require("axios")
const fs = require("fs")
const mainFunction = async() => {
  const provinceData = await axios.request({
    url: "https://data.covid19.go.id/public/api/prov.json",
    method: "GET"
  }).catch((err) => {
    return undefined
  })
  if(!provinceData) throw new Error("Failed to retrieve province data")
  const provinceArray = provinceData.data.list_data
  let provinceKeyArray = []
  for(const province of provinceArray) {
    const key = province.key
    provinceKeyArray.push(key)
  }
  fs.writeFileSync("./ProvinceKeys.json", JSON.stringify(provinceKeyArray))
}
mainFunction()