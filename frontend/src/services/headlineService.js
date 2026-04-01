import API from './api';

export const getHeadlines = () => API.get('/api/headlines/headlines/');
export const createHeadline = (data) => API.post('/api/headlines/headlines/', data);
export const updateHeadline = (id, data) => API.patch(`/api/headlines/headlines/${id}/`, data);
export const deleteHeadline = (id) => API.delete(`/api/headlines/headlines/${id}/`);
export const getSiteFeatures = () => API.get('/api/headlines/features/');
