import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/contact/messages/";

export const sendContactMessage = async (data) => {
    return await axios.post(API_URL, data);
};

export const getContactMessages = async () => {
    return await axios.get(API_URL);
};

export const deleteContactMessage = async (id) => {
    return await axios.delete(`${API_URL}${id}/`);
};
