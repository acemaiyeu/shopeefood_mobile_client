import * as SecureStore from 'expo-secure-store';
import { StyleSheet } from "react-native";
export const apiURL = "http://192.168.31.81:8000"
export const API_URL_NOTIFY = "http://192.168.31.81:8001"
export const primary_color = "#f7175a"
export const SF_Pro = "SF_Pro";
export const SF_Pro_DISPLAY_BOLD = "SF_Pro_DISPLAY_BOLD";

export const formGroupGlobal = StyleSheet.create({
    group: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 5,
        // borderBottomColor: "#cccccc80",
        // borderBottomWidth: 1,
        backgroundColor: "#fafafafd",
        boxShadow: "0px 0px 12px 0px #e6e6e6fd",
        padding: 10,
        marginBottom: 20,
    },
    group_first: {
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    text: {
        paddingHorizontal: 10
    },
    input: {
        // borderColor: "#ccc",
        // borderWidth: 1,
        flex: 1
    },
    hr: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginVertical: 5
    },
    button: {
        padding: 5,
        borderRadius: 10
    }
})



export async function getItem(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}
export async function setItem(key: string, value: string) {
  if (key) {
    await SecureStore.setItemAsync(key, value);
  }
}
export async function deleteItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}
export function formatMoney(amount: any, removeDD: boolean = false): string {
    // 1. Chuyển đổi amount sang kiểu số, nếu không hợp lệ (NaN) thì mặc định là 0
    const numericAmount = Number(amount);
    const safeAmount = isNaN(numericAmount) ? 0 : numericAmount;

    // 2. Cấu hình options dựa trên removeDD
    const options: Intl.NumberFormatOptions = removeDD 
        ? { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 2 } 
        : { style: 'currency', currency: 'VND' };

    // 3. Trả về chuỗi đã format
    return new Intl.NumberFormat('vi-VN', options).format(safeAmount);
}


export const formatToInputDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    
    // Tách chuỗi thành phần: "19:50:00" và "18/06/2026"
    const [time, date] = dateStr.split(" ");
    if (!time || !date) return dateStr; // Phòng trường hợp format lỗi

    const [hour, minute] = time.split(":");
    const [day, month, year] = date.split("/");

    // Đảm bảo năm đủ 4 chữ số (ví dụ '26' -> '2026')
    const fullYear = year.length === 2 ? `20${year}` : year;

    // Trả về đúng định dạng YYYY-MM-DDTHH:mm
    return `${fullYear}-${month}-${day}T${hour}:${minute}`;
};
export const setTokenWithExpiry = async (token_name = 'access_token', token: string, expiresIn: number) => {
    const now = new Date();
    
    // Tính mốc thời gian hết hạn (Hiện tại + số giây từ API * 1000 để ra miligiây)
    const expiryTime: any = now.getTime() + (expiresIn * 1000);

    // Lưu cả token và thời gian hết hạn vào một object\

    await setItem(token_name, token)
    await setItem('expiresAt', expiryTime + "")
    const data = await getItem(token_name)
    console.log("data",data)

}
export function getValidToken(name_token = "access_token") {
    const token = getItem(name_token);
    
    
    if (!token) {
        return { status: 'EXPIRED', token: null };
    }
    let expiresAt: any = getItem('expiresAt');
    if(name_token === "access_token_admin"){
      expiresAt = getItem('expiresAdminAt');
    }

    const now = new Date().getTime(); // Lấy timestamp hiện tại (miligiây)
    

    // Tính thời gian còn lại (đổi từ miligiây sang phút)
    const timeLeftInMinutes = (expiresAt - now) / 1000 / 60;

    // 1. Trường hợp đã hết hạn hoàn toàn
    if (timeLeftInMinutes <= 0) {
        deleteItem(name_token); // Xóa token cũ
        return { status: 'EXPIRED', token: null };
    }

    // 2. Trường hợp sắp hết hạn (còn ít hơn hoặc bằng 3 phút)
    if (timeLeftInMinutes <= 3) {
        return { 
            status: 'EXPIRING_SOON', 
            token: token,
            timeLeft: Math.round(timeLeftInMinutes * 60) // Trả về số giây còn lại nếu cần dùng
        };
    }

    // 3. Trường hợp token vẫn còn hạn dài (trên 3 phút)
    return { 
        status: 'VALID', 
        token: token
    };
}