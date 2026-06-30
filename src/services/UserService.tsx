import axiosAuth from './axiosAuth';
import axiosToken from './axiosToken';


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

export const updateProfile = async (param: object) => {
    try {
        const res = await axiosToken.put('/user', {
            ...param
        });
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching profile:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
export const changePassword = async (param: object) => {
    try {
        const res = await axiosToken.post('/change-password', {...param});
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching profile:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
