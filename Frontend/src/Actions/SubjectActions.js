import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getSubjectById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/subject/${id}`);
  console.log(res.data);
  return res.data;
};
export const addSubject = async (subject) => {
  const res = await axios.post(`${API_BASE_URL}/subject`, subject)
  return res.data
}
export const removeSubject = async (id) => {
  return await axios.delete(`${API_BASE_URL}/subject/${id}`)
}

export const getTeamProgressBySubject = async (subjectId, groupId) => {
  const res = await axios.get(`${API_BASE_URL}/SubjectSteps/group/${subjectId}`, {
    params: {
      groupId: groupId
    }
  });
  return res.data;
}
export const getSubjectsHisotryByintern = async (internId) => {
  const res = await axios.get(`${API_BASE_URL}/SubjectSteps/intern/${internId}`)
  return res.data;
}