import Toast from 'react-native-toast-message';

export const toast = (message: string, type = "success") => {
    if(type === "success"){
        Toast.show({
            type: 'success',
            text1: 'Thành công',
            text2: message
        });
    }
    if(type === "error"){
        Toast.show({
            type: 'error',
            text1: 'Có lỗi xảy ra',
            text2: message
        });
    }
};