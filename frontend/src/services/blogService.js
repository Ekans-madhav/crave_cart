import API from './api';

// 1. Blog Hero
export const getBlogHeroes = () => API.get('/api/blog/hero/');
export const createBlogHero = (data) => API.post('/api/blog/hero/', data);
export const updateBlogHero = (id, data) => API.patch(`/api/blog/hero/${id}/`, data);
export const deleteBlogHero = (id) => API.delete(`/api/blog/hero/${id}/`);

// 2. Trending Stories
export const getTrendingStories = () => API.get('/api/blog/trending/');
export const createTrendingStory = (data) => API.post('/api/blog/trending/', data);
export const updateTrendingStory = (id, data) => API.patch(`/api/blog/trending/${id}/`, data);
export const deleteTrendingStory = (id) => API.delete(`/api/blog/trending/${id}/`);

// 3. Main Blog Posts
export const getBlogPosts = () => API.get('/api/blog/posts/');
export const createBlogPost = (data) => API.post('/api/blog/posts/', data);
export const updateBlogPost = (id, data) => API.patch(`/api/blog/posts/${id}/`, data);
export const deleteBlogPost = (id) => API.delete(`/api/blog/posts/${id}/`);

// 4. Food Gallery
export const getFoodGallery = () => API.get('/api/blog/gallery/');
export const createGalleryItem = (data) => API.post('/api/blog/gallery/', data);
export const updateGalleryItem = (id, data) => API.patch(`/api/blog/gallery/${id}/`, data);
export const deleteGalleryItem = (id) => API.delete(`/api/blog/gallery/${id}/`);

// 5. Specialized Categories (Merged into generic handlers for UI simplicity if needed, but keeping separate for now)
export const getChefTips = () => API.get('/api/blog/chef-tips/');
export const createChefTip = (data) => API.post('/api/blog/chef-tips/', data);
export const updateChefTip = (id, data) => API.patch(`/api/blog/chef-tips/${id}/`, data);
export const deleteChefTip = (id) => API.delete(`/api/blog/chef-tips/${id}/`);

export const getFoodCulture = () => API.get('/api/blog/food-culture/');
export const createFoodCulture = (data) => API.post('/api/blog/food-culture/', data);
export const updateFoodCulture = (id, data) => API.patch(`/api/blog/food-culture/${id}/`, data);
export const deleteFoodCulture = (id) => API.delete(`/api/blog/food-culture/${id}/`);

export const getStreetGuides = () => API.get('/api/blog/street-guides/');
export const createStreetGuide = (data) => API.post('/api/blog/street-guides/', data);
export const updateStreetGuide = (id, data) => API.patch(`/api/blog/street-guides/${id}/`, data);
export const deleteStreetGuide = (id) => API.delete(`/api/blog/street-guides/${id}/`);

export const getHealthyEating = () => API.get('/api/blog/healthy-eating/');
export const createHealthyEating = (data) => API.post('/api/blog/healthy-eating/', data);
export const updateHealthyEating = (id, data) => API.patch(`/api/blog/healthy-eating/${id}/`, data);
export const deleteHealthyEating = (id) => API.delete(`/api/blog/healthy-eating/${id}/`);
