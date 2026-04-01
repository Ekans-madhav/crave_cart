import API from "./api";

export const getTodayOffers = () => API.get("/api/today-offer/offers/");
export const createTodayOffer = (data) => API.post("/api/today-offer/offers/", data);
export const deleteTodayOffer = (id) => API.delete(`/api/today-offer/offers/${id}/`);
export const updateTodayOffer = (id, data) => API.patch(`/api/today-offer/offers/${id}/`, data);
export const verifyOffer = (code) => API.post("/api/today-offer/offers/verify/", { code });
