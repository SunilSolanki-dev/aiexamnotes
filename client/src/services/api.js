import axios from "axios"
import { serverUrl } from "../app.jsx"
import { setUserData } from "../redux/userSlice.js"

export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(serverUrl + '/api/user/currentUser', { withCredentials: true })
        dispatch(setUserData(result.data))
    } catch (error) {
        // No valid cookie / expired token / network failure — treat as logged out.
        dispatch(setUserData(null))
    }
}


export const generateNotes = async (payload) => {
  const result = await axios.post(serverUrl + '/api/notes/generate-notes', payload, { withCredentials: true });
  return result.data;
}

export const getAllNotes = async () => {
  const result = await axios.get(serverUrl + '/api/notes/getnotes', { withCredentials: true });
  return result.data;
}
export const getSingleNote = async (noteId) => {
  const result = await axios.get(serverUrl + `/api/notes/${noteId}`, { withCredentials: true });
  return result.data;
}

export const createCreditsOrder = async (amount) => {
  const result = await axios.post(serverUrl + '/api/credits/order', { amount }, { withCredentials: true });
  return result.data;
}