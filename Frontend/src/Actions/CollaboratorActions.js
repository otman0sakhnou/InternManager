import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllCollaborators = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/Collaborator`);
    return res.data;
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    throw new Error("Failed to fetch collaborators.");
  }
}

export const getCollaboratorById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/Collaborator/${id}`);
  return res.data
}

export const AddCollaborator = async (collaborator) => {
  const res = await axios.post(`${API_BASE_URL}/Collaborator`, collaborator);
  return res.data;
}

export const UpdateCollaborator = async (id, collaborator) => {
  const res = await axios.put(`${API_BASE_URL}/Collaborator/${id}`, collaborator);
    return res.data;
}

export const DeleteCollaborator = async (id) => {
  await axios.delete(`${API_BASE_URL}/Collaborator/${id}`);
  return true;
}

export const getCollaboratorIdByUserId = async (userId) => {
  const res = await axios.get(`${API_BASE_URL}/Collaborator/user/${userId}`);
  return res.data;
};
