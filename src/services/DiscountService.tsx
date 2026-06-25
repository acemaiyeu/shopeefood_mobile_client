import axiosToken from './axiosToken';


const service_all = "products"
const service_name = "sản phẩm"

export const getDiscountClientAll = async (page = 1, limit = 10, params: any) => {
    try {
        let param_string = "";
        if(params.slug){
            param_string += `&slug=${params.slug}`
        }
        const res = await axiosToken.get(`/discounts?page=${page}&limit=${limit}&sort[type]=asc${param_string}`);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching discount:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
export const applyDiscount = async (params: any) => {
    try {
        const res = await axiosToken.post(`/apply-discount`, params);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching apply discount:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
