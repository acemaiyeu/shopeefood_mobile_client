import axiosToken from './axiosToken';


export const getAllClientPromotions = async (slug_store: string) => {
    try {
        const res = await axiosToken.get('promotions/'+slug_store);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching products:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
