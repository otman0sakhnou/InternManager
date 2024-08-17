import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchAllInterns = async () => {
    const response = await axios.get(`${API_BASE_URL}/intern`);
    return response.data;
};

export const fetchInternById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/intern/${id}`);
    return response.data;
};

export const createIntern = async (internData) => {
    const response = await axios.post(`${API_BASE_URL}/intern`, internData);
    return response.data;
};

export const updateIntern = async (internData) => {
    const response = await axios.put(`${API_BASE_URL}/intern`, internData);
    return response.data;
};

export const deleteIntern = async (id) => {
    await axios.delete(`${API_BASE_URL}/intern/${id}`);
};

export const deleteAllInterns = async () => {
    await axios.delete(`${API_BASE_URL}/intern/all`);
};
