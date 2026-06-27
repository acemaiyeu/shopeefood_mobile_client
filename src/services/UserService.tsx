import axiosAuth from './axiosAuth';


const service_all = "products"
const service_name = "sản phẩm"

export const getProfile = async () => {
    try {
        const res = await axiosAuth.get('/profile');
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching profile:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
