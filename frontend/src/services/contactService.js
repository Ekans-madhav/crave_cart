import API from "./api";

export const sendContactMessage = async (data) => {
    return await API.post("/api/contact/messages/", data);
};

export const getContactMessages = async () => {
    return await API.get("/api/contact/messages/");
};

export const deleteContactMessage = async (id) => {
    return await API.delete(`/api/contact/messages/${id}/`);
};
