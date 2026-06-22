import axiosClient from './axiosClient';


const service_all = "stores"
const service_name = "cửa hàng"

export const getStoreBySlug = async (slug: string) => {
    try {
        const res = await axiosClient.get(`/store/${slug}`);
        return res.data; // Return the actual data
    } catch (e) {
        console.error('Error fetching store:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};