import axios from "axios";
import getToken from "../firebase/getToken";
import { apiBaseUrl } from "./config";

const getAuthHeaders = async () => ({ Authorization: `Bearer ${await getToken()}` });
const adminServiceBaseUrl = `${apiBaseUrl}/services/admin/services`;

export const getAdminServices = async (params = {}) => {
  const response = await axios.get(adminServiceBaseUrl, {
    params,
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const getCaregiverServices = async (params = {}) => {
  const response = await axios.get(`${apiBaseUrl}/services/caregiver/services`, {
    params,
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const createAdminService = async (payload) => {
  const response = await axios.post(adminServiceBaseUrl, payload, {
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const updateAdminService = async (serviceId, payload) => {
  const response = await axios.patch(`${adminServiceBaseUrl}/${serviceId}`, payload, {
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const deleteAdminService = async (serviceId) => {
  const response = await axios.delete(`${adminServiceBaseUrl}/${serviceId}`, {
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const createCaregiverService = async (payload) => {
  const response = await axios.post(`${apiBaseUrl}/services/caregiver/services`, payload, {
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const updateCaregiverService = async (serviceId, payload) => {
  const response = await axios.put(`${apiBaseUrl}/services/caregiver/services/${serviceId}`, payload, {
    headers: await getAuthHeaders(),
  });
  return response.data;
};

export const deleteCaregiverService = async (serviceId) => {
  const response = await axios.delete(`${apiBaseUrl}/services/caregiver/services/${serviceId}`, {
    headers: await getAuthHeaders(),
  });
  return response.data;
};
