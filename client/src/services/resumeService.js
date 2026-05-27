import api from "./api";

const RESUME_URL = "/resume";

const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post(`${RESUME_URL}/analyze`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const getResumeHistory = async () => {
  const response = await api.get(`${RESUME_URL}/history`);
  return response.data;
};

const getResumeById = async (id) => {
  const response = await api.get(`${RESUME_URL}/${id}`);
  return response.data;
};

const deleteResume = async (id) => {
  const response = await api.delete(`${RESUME_URL}/${id}`);
  return response.data;
};

const resumeService = {
  analyzeResume,
  getResumeHistory,
  getResumeById,
  deleteResume,
};

export default resumeService;
