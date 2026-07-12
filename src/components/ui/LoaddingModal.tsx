import { primary_color, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

const LoaddingModal = () => {
  const { loadding } = useSelector((state: any) => state.public);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loadding) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000, // 1 giây xoay một vòng, tốc độ vừa phải, mượt mà
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [loadding]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!loadding) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        
        {/* Tên thương hiệu của quán */}
        <Text style={styles.logoText}>QUÁN NHỎ</Text>
        
        {/* Spinner vòng tròn khuyết cao cấp */}
        <View style={styles.spinnerContainer}>
          <Animated.View 
            style={[styles.customSpinner, { transform: [{ rotate: spin }] }]} 
          />
          {/* Chữ "Đang tải" nhỏ tinh tế ở dưới spinner */}
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)", // Nền tối nhẹ sang trọng
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  card: {
    backgroundColor: "white",
    width: 150, // Thiết kế vuông vắn nhỏ gọn
    paddingVertical: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    // Đổ bóng nhẹ nhàng chuẩn Modern UI
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  logoText: {
    color: primary_color,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
    fontFamily: SF_Pro_DISPLAY_BOLD, 
    marginBottom: 20, // Tạo khoảng cách với phần spinner ở dưới
  },
  spinnerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  customSpinner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#f0f0f0", // Vòng nền màu xám nhạt
    borderTopColor: primary_color, // Tạo điểm nhấn khuyết bằng màu chính của quán
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 11,
    color: "#999999",
    fontWeight: "500",
  },
});

export default LoaddingModal;