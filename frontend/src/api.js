import axios from 'axios';

const api = axios.create({
  baseURL: "https://cold-email-agent-2ge9.onrender.com",
});

export default api;

export const generateEmail = async (formData) => {
  const response = await api.post("/generate-email", formData);
  return response.data;
};

export const refineEmail = async (emailBody, feedback, context) => {
  const response = await api.post("/refine-email", {
    email_body: emailBody,
    feedback,
    context,
  });
  return response.data;
};
