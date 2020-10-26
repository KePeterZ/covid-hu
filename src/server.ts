import * as govhu from "./govhu"
import express from "express"
const app = express()

app.get("/", async (req, res) => {
  res.json(await govhu.mainAPI())
})

app.get("/pages=:num", async (req, res) => {
  res.json(await govhu.getPages(Number.parseInt(req.params.num)))
})

app.get("/changes", async (req, res) => {
  res.json(await govhu.getNumberChanges(20))
})

app.get("/numbers", async (req, res) => {
  res.json(await govhu.getNumbers())
})

app.listen(3000, () => {
  console.log("COVID-HU API running on port 3000")
})