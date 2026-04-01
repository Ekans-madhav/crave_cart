import api from './api';

const login = async (credentials) => {
    const response = await api.post('/api/login/', credentials);
    if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
    }
    return response.data;
};

const register = async (userData) => {
    const response = await api.post('/api/register/', userData);
    return response.data;
};

const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
};

const getProfile = async () => {
    const response = await api.get('/api/profile/');
    return response.data;
};

const changePassword = async (data) => {
    const response = await api.post('/api/change-password/', data);
    return response.data;
};

export default {
    login,
    register,
    logout,
    getProfile,
    changePassword,
};
