import axios from "axios";
import getToken from "../firebase/getToken";
import { apiBaseUrl } from "./config";

const baseUrl = `${apiBaseUrl}/bookings`;
const authorized = async () => ({ headers: { Authorization: `Bearer ${await getToken()}` } });

export const createBooking = async (payload) => axios.post(baseUrl, payload, await authorized());
export const getBookings = async (params) => axios.get(baseUrl, { ...(await authorized()), params });
export const getBooking = async (bookingId) => axios.get(`${baseUrl}/${bookingId}`, await authorized());
export const updateBooking = async (bookingId, payload) => axios.patch(`${baseUrl}/${bookingId}`, payload, await authorized());
export const updateBookingStatus = async (bookingId, status) => axios.patch(`${baseUrl}/${bookingId}/status`, { status }, await authorized());
export const deleteBooking = async (bookingId) => axios.delete(`${baseUrl}/${bookingId}`, await authorized());
