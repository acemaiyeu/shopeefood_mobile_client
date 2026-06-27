import axiosNotify from './axiosNotify';

export const sendMessage = async (params: any) => {
    
try {
        // Thêm return ở đầu dòng này
        const res = await axiosNotify.post(`push-notification/notify.${params.channel_id}`,{
            type: "",
            message: params.message,
            qr: params.qr,
            order_code: params.order_code ?? "",
            status: params.status ?? "",
            shipping: {
            name: params?.shipping?.name ?? "",
            phone: params?.shipping?.phone ?? "0767900000"
            }
        });
        return res.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error(`Lỗi khi tạo bắn thông báo:`, error);
        throw error; 
    }

};
export const pushNotifiToStore = async (channel_id: string, message: string) => {
    try {
        // Thêm return ở đầu dòng này
        await axiosNotify.post(`push-notification/${channel_id}`,{
            message: message,
            }
        );
    } catch (error) {
        console.error(`Lỗi khi tạo bắn thông báo:`, error);
        throw error; 
    }
}