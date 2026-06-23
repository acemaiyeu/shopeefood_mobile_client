import axiosToken from './axiosToken';


const service_all = "products"
const service_name = "sản phẩm"

export const getMyCart = async () => {
    try {
        const res = await axiosToken.get('/cart');
        return res.data; // Return the actual data
    } catch (e) {
        console.error('Error fetching cart:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};