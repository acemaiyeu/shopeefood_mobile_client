import axiosToken from './axiosToken';


const service_all = "products"
const service_name = "sản phẩm"

export const getMyOrders = async (page = 1, limit = 10) => {
    try {
        const res = await axiosToken.get(`/my-orders?page=${page}&limit=${limit}&sort[created_at]=desc`);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching orders:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
export const createOrder = async () => {
    try {
        const res = await axiosToken.post(`/order`);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching create orders:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
