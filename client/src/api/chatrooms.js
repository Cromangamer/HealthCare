import axios from "axios";
import getToken from "../firebase/getToken";
import { apiBaseUrl } from "./config";

const baseUrl = `${apiBaseUrl}/chatrooms`;
const authorized = async () => ({ headers: { Authorization: `Bearer ${await getToken()}` } });

export const getChatRooms = async () => axios.get(baseUrl, await authorized());
export const getMessages = async (chatRoomId, params) => axios.get(`${baseUrl}/${chatRoomId}/messages`, { ...(await authorized()), params });
export const sendMessage = async (chatRoomId, payload) => axios.post(`${baseUrl}/${chatRoomId}/messages`, payload, await authorized());
