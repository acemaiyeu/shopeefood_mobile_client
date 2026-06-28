import { deleteItem, getItem, primary_color, setItem, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from "expo-router";
import * as SecureStore from "expo-secure-store"; // Đảm bảo import đúng cách
import { useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

// Gộp chung 1 Interface chuẩn chỉnh
interface Notification {
  id: number | string;
  title: string;
  content: string;
  is_read: number;
  [key: string]: any; 
}

const NotifiHome = () => {
    const { notification, total_notification } = useSelector((state: any) => state.public);

    const [listNotifications, setListNotifications] = useState<Notification[]>([]);
    const navigation: any = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setRefreshing(true);
        // Khôi phục logic fetch API tại đây nếu cần
        setRefreshing(false);
    };

    useEffect(() => {
        setListNotifications([
            {
                id: 1,
                title: "Chào mừng",
                content: "Chào mừng bạn đến với Quán nhỏ nơi mà bạn có thể mua trực tiếp sản phẩm với nhà bán hàng. Bạn cũng có thể trở thành nhà bán hàng. Khi tải phần mềm Quán nhỏ Store tại CH Play nhé!",
                is_read: 0,
            },
            {
                id: 2,
                title: "Đặt hàng thành công (ĐH1237434)",
                content: "Bạn đã đặt hàng thành công, vui lòng thanh toán sau khi được cửa hàng nhận đơn nhé! Đơn sẽ bị hủy sau 3 phút nếu không thanh toán.",
                is_read: 0,
            },
            {
                id: 3,
                title: "Cảnh cáo khi bom hàng",
                content: "Bạn nhận được 1 cảnh cáo khi bom hàng. Bạn có thể vào Đơn hàng → Kiến nghị và gửi các bằng chứng để được xem xét, gỡ bỏ cảnh cáo. Nếu mỗi tài khoản bị cảnh cáo từ 2 lần trở lên sẽ bị hạn chế đặt hàng trong vòng 30 ngày.",
                is_read: 1,
            }
        ]);
        const listTemp: any = getItem("notifications");
    }, []);

    useEffect(() => {
        if (notification?.id) {
            setListNotifications(prev => {
                // Tránh push trùng nếu redux trigger nhiều lần
                const isExist = prev.some(item => item.content === notification.content);
                if (isExist) return prev;
                
                return [notification, ...prev];
            });
        }
    }, [total_notification, notification]);

    // Thêm async để xử lý SecureStore await dữ liệu dưới máy
    const handleDetail = async (noti: Notification) => {
        // 1. Cập nhật giao diện lập tức (UI State)
        const updatedList = listNotifications.map((item) =>
            item.id !== noti.id ? item : { ...item, is_read: 1 }
        );
        setListNotifications(updatedList);

        try {
            // 2. SỬA LỖI TẠI ĐÂY: Sử dụng await với SecureStore
            const notifiesStr = await SecureStore.getItemAsync('notifications');
            let localNotifications: Notification[] = notifiesStr ? JSON.parse(notifiesStr) : [];

            const isItemExistInLocal = localNotifications.some(item => item.id === noti.id);

            if (isItemExistInLocal) {
                localNotifications = localNotifications.map((item) =>
                    item.id !== noti.id ? item : { ...item, is_read: 1 }
                );
            } else {
                localNotifications.push({ ...noti, is_read: 1 });
            }

            // Đồng bộ lại vào hàm setItem của bạn (hãy đảm bảo hàm setItem này chạy Async hoặc đã bọc SecureStore)
            await setItem("notifications", JSON.stringify(localNotifications));
        } catch (error) {
            console.log("Lỗi lưu bộ nhớ mã thông báo:", error);
        }

        // 3. Điều hướng mượt mà, gửi thẳng Object
        navigation.navigate("notifi_detail", { noti: { ...noti, is_read: 1 } });
    };

    return (
        <ScrollView 
            style={styles.container} 
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
        >
            {listNotifications && listNotifications.length > 0 ? (
                <View style={styles.box}>
                    <View style={styles.headerBox}>
                        <Text style={styles.readAllText} onPress={() => deleteItem("notifications")}>Đã đọc tất cả</Text>
                    </View>
                    <View style={styles.list_notifications}>
                        {listNotifications.map((noti, noti_index) => (
                            <Pressable 
                                key={noti.title} // Bổ sung key để tránh cảnh cáo React
                                onPress={() => handleDetail(noti)} 
                                style={[
                                    styles.item_notification, 
                                    noti.is_read === 0 && styles.active, 
                                    noti_index === 0 && styles.item_notification_first, 
                                    noti_index === listNotifications.length - 1 && styles.item_notification_last
                                ]}
                            >
                                <View style={styles.icon}>
                                    <AntDesign name="notification" size={20} color={primary_color} />
                                </View>
                                <View style={styles.info_notification}>
                                    <View style={styles.info_notification_box}>
                                        <View style={styles.info_notification_title}>
                                            <Text style={styles.info_notification_title_text}>{noti.title}</Text>
                                            {noti.is_read === 0 && <Entypo name="dot-single" size={24} color={primary_color} />}
                                        </View>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.info_notification_content}>
                                            {noti.content}
                                        </Text>
                                    </View>
                                    <Text style={styles.info_notification_created_at}>27/06/2026 15:00</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
            ) : (
                <Text style={styles.container_text}>Bạn không có thông báo</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
    },
    container_text: {
        fontFamily: SF_Pro_DISPLAY_BOLD,
        margin: 'auto',
        color: primary_color,
        textAlign: 'center',
        marginTop: 40
    },
    box: {
        width: "95%",
        backgroundColor: "#fff",
        marginVertical: 10,
        borderRadius: 5,
        marginHorizontal: 'auto',
        elevation: 1, // Đổ bóng nhẹ cho Android
        shadowColor: '#000', // Đổ bóng nhẹ cho iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerBox: {
        padding: 10,
        borderBottomWidth: 0.5,
        borderColor: '#eee',
        alignItems: 'flex-end'
    },
    readAllText: {
        color: primary_color,
        fontSize: 12,
        fontFamily: SF_Pro
    },
    list_notifications: {
        width: "100%"
    },
    item_notification: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#eee"
    },
    info_notification: {
        flex: 1,
        paddingHorizontal: 5,
    },
    info_notification_box: {
        overflow: 'hidden'
    },
    info_notification_title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    info_notification_title_text: {
        fontSize: 14,
        fontFamily: SF_Pro_DISPLAY_BOLD,
        flex: 1,
    },
    info_notification_content: {
        fontSize: 13,
        fontFamily: SF_Pro,
        color: '#555',
        marginTop: 2
    },
    icon: {
        marginTop: 2,
        paddingRight: 5
    },
    active: {
        backgroundColor: "#e413590a" 
    },
    item_notification_first: {
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    item_notification_last: {
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomWidth: 0
    },
    info_notification_created_at: {
        color: "#a19d9d",
        fontSize: 10,
        marginTop: 4
    }
});

export default NotifiHome;
