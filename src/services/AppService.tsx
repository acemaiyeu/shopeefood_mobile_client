import axiosToken from './axiosToken';

export const getVersionApp = async () => {
    try {
        const res = await axiosToken.get('/check-version-app');
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching version:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
