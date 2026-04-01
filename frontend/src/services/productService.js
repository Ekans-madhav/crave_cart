import API from "./api";

// GET
export const getProducts = () => API.get("/api/products/");
export const getProduct = (id) => API.get(`/api/products/${id}/`);

// CREATE
export const createProduct = (data) =>
    API.post("/api/products/", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// UPDATE
export const updateProduct = (id, data) =>
    API.put(`/api/products/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// DELETE
export const deleteProduct = (id) =>
    API.delete(`/api/products/${id}/`);
