import * as govhu from "./govhu"
import express from "express"
const app = express()

app.get("/", async (req, res) => {
  res.json(await govhu.mainAPI())
})

app.listen(3000, () => {
  console.log("COVID-HU API running on port 3000")
})