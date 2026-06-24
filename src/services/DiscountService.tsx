import axiosToken from './axiosToken';


const service_all = "products"
const service_name = "sản phẩm"

export const getDiscountClientAll = async (page = 1, limit = 10, params: object = {}) => {
    try {
        let param_string = "";
        if(params.slug){
            param_string += `&slug=${params.slug}`
        }
        const res = await axiosToken.get(`/discounts?page=${page}&limit=${limit}${param_string}`);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching discount:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
