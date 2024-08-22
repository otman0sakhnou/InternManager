import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchGroupById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Group/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch group by id:", error);
        throw error;
    }
};

export const fetchAllGroups = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Group`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all groups:", error);
        throw error;
    }
};
export const fetchGroupsByDepartment = async (department) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Group/department/${department}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch groups by department:", error);
        throw error;
    }
};

export const fetchGroupsByCollaboratorId = async (collaboratorId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Group/collaborator/${collaboratorId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch groups by collaborator ID:", error);
        throw error;
    }
};

export const fetchGroupsByInternId = async (internId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Group/intern/${internId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch groups by intern ID:", error);
        throw error;
    }
};
export const createGroup = async (group) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Group`, group);
        return response.data;
    } catch (error) {
        console.error("Failed to create group:", error);
        throw error;
    }
};

export const updateGroup = async (id, updatedGroup) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/Group/${id}`, updatedGroup);
        return response.data;
    } catch (error) {
        console.error("Failed to update group:", error);
        throw error;
    }
};

export const deleteGroup = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/Group/${id}`);
    } catch (error) {
        console.error("Failed to delete group:", error);
        throw error;
    }
};
export const removeInternFromGroup = async (groupId, internId) => {
    try {
        await axios.delete(`${API_BASE_URL}/Group/${groupId}/interns/${internId}`);
    } catch (error) {
        console.error("Failed to remove intern from group:", error);
        throw error;
    }
};
