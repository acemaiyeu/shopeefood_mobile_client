import axiosToken from './axiosToken';

export const updateImage = async (formData: FormData) => {
    try {
        // 1. Đổi .put thành .post (theo đúng Postman của bạn)
        // 2. Truyền thẳng formData vào vị trí tham số thứ 2
        const res = await axiosToken.post('/upload-image', formData, {
            headers: {
                // Bắt buộc cấu hình multipart cho axios nhận diện file
                'Content-Type': 'multipart/form-data', 
            },
        });
        
        return res; // Trả về dữ liệu từ server (chứa image_url)
    } catch (e) {
        console.error('Error uploading image:', e);
        throw e; 
    }
};