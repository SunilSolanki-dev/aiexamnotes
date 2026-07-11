import axios from "axios"
import { serverUrl } from "../app.jsx"
import { setUserData } from "../redux/userSlice.js"

export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(serverUrl + '/api/user/currentUser', { withCredentials: true })
        dispatch(setUserData(result.data))
    } catch (error) {
        console.log('error', error)
    }
}