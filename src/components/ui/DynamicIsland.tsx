import { primary_color } from "@/constants/const";
import { updatePublic } from "@/store/features/PublicSlice";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getItem } from "expo-secure-store";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DynamicHome = () => {
    const dispatch = useDispatch();

    // ✅ BƯỚC 1: Đưa useSelector vào ĐÚNG VỊ TRÍ bên trong Component
    const { notification, positionDynamic } = useSelector((state: any) => state.public);
    
    // Tạo một biến fallback, nếu Redux chưa load xong thì mặc định là 11
    const currentMargin = positionDynamic ?? 11;

    const [showContent, setShowContent] = useState(false);
    const widthValue = useSharedValue(150);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(widthValue.value, { duration: 500 }), 
        };
    });

    // Gọi lấy vị trí từ bộ nhớ máy khi mở app
    useEffect(() => {
        const loadDynamicPosition = async () => {
            const data = await getItem("DYNAMIC_MARGIN_TOP"); 
            if (data) {
                dispatch(updatePublic({ positionDynamic: Number(data) }));
            }
        };
        loadDynamicPosition();
    }, []); 

    // Xử lý hiệu ứng tai thỏ đóng/mở khi có notify
    useEffect(() => {
        let timer: NodeJS.Timeout;
        let hideContentTimer: NodeJS.Timeout;

        if (notification?.title) {
            setShowContent(true);
            widthValue.value = 300; 

            timer = setTimeout(() => {
                widthValue.value = 150;

                hideContentTimer = setTimeout(() => {
                    setShowContent(false);
                }, 500); 
                
            }, 5000); 
        } else {
            widthValue.value = 150;
            setShowContent(false);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (hideContentTimer) clearTimeout(hideContentTimer);
        };
    }, [notification]);

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* ✅ BƯỚC 2: Truyền marginTop động qua inline style ở đây để nó cập nhật theo thời gian thực */}
            <AnimatedPressable 
                style={[styles.box, animatedStyle, { marginTop: currentMargin }]} 
                onPress={() => alert("me")}
            >
                <View style={styles.box_notify}>
                    {showContent && (
                        <>
                            <Ionicons name="notifications-circle-outline" size={18} color={primary_color} />
                            <Text 
                                style={styles.box_text}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {notification?.title}
                            </Text>
                        </>
                    )}
                </View>
            </AnimatedPressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute", 
        top: 0,
        left: 0,
        width: "100%", 
        height: "100%", 
        backgroundColor: "transparent",
        alignItems: 'center',
    },
    box: {
        height: 35,
        backgroundColor: "black",
        borderRadius: 100,
        // ❌ ĐÃ XÓA marginTop cố định ở đây vì nó không tự cập nhật được dữ liệu mới
        overflow: 'hidden', 
        justifyContent: 'center',
    },
    box_notify: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        height: "100%",
        paddingHorizontal: 12,
    },
    box_text: {
        fontSize: 11,
        color: "white",
        marginLeft: 6,
        flex: 1, 
    }
});

export default DynamicHome;