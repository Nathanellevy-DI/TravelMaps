/**
 * Share service for TravelMaps
 * Handles sharing pins and categories with other users
 */

import api from './api.js';

/**
 * Get all items shared with the current user
 * @returns {Promise<object>} - { sharedPins, sharedCategories }
 */
export const getSharedWithMe = async () => {
    const data = await api.get('/share');
    return {
        sharedPins: data.sharedPins || [],
        sharedCategories: data.sharedCategories || [],
    };
};

/**
 * Share a pin with a specific user
 * @param {string} pinId - Pin ID to share
 * @param {string} toUserId - User ID to share with
 */
export const sharePin = async (pinId, toUserId) => {
    return api.post(`/share/pin/${pinId}`, { toUserId });
};

/**
 * Unshare a pin from a user
 * @param {string} pinId - Pin ID
 * @param {string} toUserId - User ID to unshare from
 */
export const unsharePin = async (pinId, toUserId) => {
    return api.delete(`/share/pin/${pinId}/${toUserId}`);
};

/**
 * Get who a pin is shared with
 * @param {string} pinId - Pin ID
 * @returns {Promise<object[]>} - Array of users the pin is shared with
 */
export const getPinShares = async (pinId) => {
    const data = await api.get(`/share/pin/${pinId}`);
    return data.shares || data;
};

/**
 * Share a category with a specific user
 * @param {string} categoryId - Category ID to share
 * @param {string} toUserId - User ID to share with
 */
export const shareCategory = async (categoryId, toUserId) => {
    return api.post(`/share/category/${categoryId}`, { toUserId });
};

/**
 * Unshare a category from a user
 * @param {string} categoryId - Category ID
 * @param {string} toUserId - User ID to unshare from
 */
export const unshareCategory = async (categoryId, toUserId) => {
    return api.delete(`/share/category/${categoryId}/${toUserId}`);
};

/**
 * Get who a category is shared with
 * @param {string} categoryId - Category ID
 * @returns {Promise<object[]>} - Array of users the category is shared with
 */
export const getCategoryShares = async (categoryId) => {
    const data = await api.get(`/share/category/${categoryId}`);
    return data.shares || data;
};

export default {
    getSharedWithMe,
    sharePin,
    unsharePin,
    getPinShares,
    shareCategory,
    unshareCategory,
    getCategoryShares,
};
