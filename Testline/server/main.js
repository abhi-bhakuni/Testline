const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 8000

const fetchData = require("./routes/fetchData")

app.use(cors())
app.use("/fetch-data", fetchData)

app.get("/", (req,res) => {
    res.send(`Backend running on ${PORT}`)
    res.end()
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
