import axiosToken from './axiosToken';


const service_all = "products"
const service_name = "sản phẩm"

export const getMyAddress = async () => {
    try {
        const res = await axiosToken.get('/my-address?page=1&limit=20&sort[default]=desc');
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching profile:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};

export const getCities = async () => {
    try {
        const res = await axiosToken.get('/cities?page=1&limit=1000');
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching profile:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
export const getDistricts = async (city_id: string | number) => {
    try {
        const res = await axiosToken.get('/districts?page=1&limit=1000&city_id='+city_id);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching profile:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};
export const getWards = async (district_id: string | number) => {
    try {
        const res = await axiosToken.get('/wards?page=1&limit=1000&district_id='+district_id);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching profile:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};

export const createAddress = async (address: object) => {
    try {
        const res = await axiosToken.post('/address',address);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching profile:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};

export const updateAddress = async (address: object) => {
    try {
        const res = await axiosToken.put('/address', address);
        return res; // Return the actual data
    } catch (e) {
        console.error('Error fetching profile:', e);
        throw e; // Rethrow to handle in the component/calling function
    }
};


