import axiosToken from './axiosToken';


const service_all = "products"
const service_name = "sản phẩm"

export const getAllProducts = async (params: any = {}) => {
    try {
        
        let param = "";
        if(params.product_name){
            param += "&product_name=" + params.product_name
        }
        if(params.type_name){
            param += "&type_name=" + params.type_name
        }
        const res = await axiosToken.get('/products?'+param, {...params});
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching products:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
export const getAllProductPromotions = async () => {
    try {
        const res = await axiosToken.get('/product-promotions');
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching products:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
export const getAllProductHots = async () => {
    try {
        const res = await axiosToken.get('/product-hots');
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching products:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};

export const getProductDetail = async (id: string | number) => {
    try {
        const res = await axiosToken.get(`/product/${id}`);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching products:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
