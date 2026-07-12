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


export const generateNotes= async (payload)=>{
  try {
    const result = await axios.post(serverUrl+ '/api/notes/generate-notes' ,payload,{withCredentials:true});
    console.log('result', result);
    return result.data;
  } catch (error) {
    console.log('error', error)
  }
}