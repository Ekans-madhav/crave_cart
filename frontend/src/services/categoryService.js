import API from "./api";

// GET
export const getCategories = () => API.get("/api/categories/");

// CREATE
export const createCategory = (data) =>
    API.post("/api/categories/", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// UPDATE
export const updateCategory = (id, data) =>
    API.patch(`/api/categories/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// DELETE
export const deleteCategory = (id) =>
    API.delete(`/api/categories/${id}/`);

// --- Menu Types ---
export const getMenuTypes = () => API.get("/api/menu-types/");

export const createMenuType = (data) => API.post("/api/menu-types/", data);

export const updateMenuType = (id, data) => API.patch(`/api/menu-types/${id}/`, data);

export const deleteMenuType = (id) => API.delete(`/api/menu-types/${id}/`);
// SORT OPTIONS
export const getSortOptions = () => API.get("/api/sort-options/");
export const createSortOption = (data) => API.post("/api/sort-options/", data);
export const updateSortOption = (id, data) => API.patch(`/api/sort-options/${id}/`, data);
export const deleteSortOption = (id) => API.delete(`/api/sort-options/${id}/`);
