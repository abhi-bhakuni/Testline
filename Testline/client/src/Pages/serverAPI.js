import axios from "axios";

const serverAPI = axios.create({
    baseURL: "http://localhost:8000/fetch-data"
})

export const apiData = async() => {
    try {
        const response = await serverAPI.get('/mcq')
        return response.data
    } catch(e) {
        console.log("Error while fetching: ", e)
    }
}
