import axios from "axios";
import getToken from "../firebase/getToken";
import { apiBaseUrl } from "./config";

const authorized = async () => ({ headers: { Authorization: `Bearer ${await getToken()}` } });

export const submitReview = async (payload) => axios.post(`${apiBaseUrl}/reviews`, payload, await authorized());
export const getCaregiverReviews = async (caregiverId) => axios.get(`${apiBaseUrl}/reviews/${caregiverId}`);
