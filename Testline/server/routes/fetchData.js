const axios = require("axios")
const router = require("express").Router()

router.get("/mcq", async (req,res) => {
    try {
        const result = await axios.get("https://api.jsonserve.com/Uw5CrX")
        res.json(result.data)
    } catch(e) {
        console.log("Error while fetching from API: ",e)
    }
})

module.exports = router
