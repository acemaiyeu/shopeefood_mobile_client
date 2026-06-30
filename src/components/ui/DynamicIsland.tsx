import { primary_color } from "@/constants/const";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react"; // Thêm useState
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSelector } from "react-redux";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DynamicHome = () => {
    const { notification } = useSelector((state: any) => state.public);
    // State dùng để ẩn/hiện nội dung bên trong một cách đồng bộ với animation
    const [showContent, setShowContent] = useState(false);
    
    const widthValue = useSharedValue(150);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(widthValue.value, { duration: 500 }), 
        };
    });

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let hideContentTimer: NodeJS.Timeout;

        if (notification?.title) {
            // 1. Hiện nội dung bên trong ngay lập tức khi có thông báo mới
            setShowContent(true);
            widthValue.value = 300; 

            // 2. Đặt lịch sau 5 giây tự động ra lệnh co thanh đen về 150px
            timer = setTimeout(() => {
                widthValue.value = 150;

                // 3. Đợi thêm 500ms (bằng thời gian chạy animation) cho thanh đen co xong rồi mới ẩn chữ
                hideContentTimer = setTimeout(() => {
                    setShowContent(false);
                }, 500); 
                
            }, 5000); // Bạn đang để 5000ms (5 giây) trong đoạn code mẫu của bạn
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
            <AnimatedPressable style={[styles.box, animatedStyle]} onPress={() => alert("me")}>
                <View style={styles.box_notify}>
                    {/* Chỉ render nội dung khi showContent bằng true */}
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
        marginTop: 11,
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
