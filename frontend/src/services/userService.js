import API from "./api";

// GET ALL USERS
export const getUsers = () => API.get("/api/users/");
