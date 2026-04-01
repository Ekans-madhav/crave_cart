import API from './api';

export const getReviews = (productId = null) => {
    const url = productId ? `/api/reviews/?product_id=${productId}` : '/api/reviews/';
    return API.get(url);
};
export const submitReview = (data) => API.post('/api/reviews/submit/', data);
