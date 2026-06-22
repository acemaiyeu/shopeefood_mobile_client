import axiosClient from './axiosClient';


const service_all = "products"
const service_name = "sản phẩm"

export const getAllProducts = async (params = {}) => {
    try {
        const res = await axiosClient.get('/products', { params });
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching products:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};