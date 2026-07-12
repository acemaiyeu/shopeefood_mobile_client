import { primary_color } from "@/constants/const";
import { updatePublic } from "@/store/features/PublicSlice";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const KEY_DYNAMIC_MARGIN = "DYNAMIC_MARGIN_TOP";

const SettingDynamic = () => {
  const dispatch = useDispatch();
  
  // ✅ Đã sửa: Đổi sang lấy đúng 'positionDynamic' từ Redux Store cho đồng bộ
  const { positionDynamic } = useSelector((state: any) => state.public);
  const currentMargin = positionDynamic ?? 11;

  // 1. Đọc dữ liệu từ SecureStore khi vừa vào màn hình
  useEffect(() => {
    const loadSavedPosition = async () => {
      try {
        const savedValue = await SecureStore.getItemAsync(KEY_DYNAMIC_MARGIN);
        if (savedValue !== null) {
          // ✅ Đã sửa: Đổi tên biến sang positionDynamic
          dispatch(updatePublic({ positionDynamic: Number(savedValue) }));
        }
      } catch (error) {
        console.log("Lỗi đọc cấu hình từ SecureStore:", error);
      }
    };
    loadSavedPosition();
  }, []);

  // Hàm tăng khoảng cách (Tối đa 120px)
  const handleIncrease = () => {
    if (currentMargin < 120) {
      // ✅ Đã sửa: Gửi đúng key 'positionDynamic' lên Redux
      dispatch(updatePublic({ positionDynamic: currentMargin + 2 }));
    }
  };

  // Hàm giảm khoảng cách (Tối thiểu 0px)
  const handleDecrease = () => {
    if (currentMargin > 0) {
      // ✅ Đã sửa: Gửi đúng key 'positionDynamic' lên Redux
      dispatch(updatePublic({ positionDynamic: currentMargin - 2 }));
    }
  };

  // 2. Hàm lưu giá trị xuống thiết bị
  const handleSaveConfig = async () => {
    try {
      await SecureStore.setItemAsync(KEY_DYNAMIC_MARGIN, String(currentMargin));
      Alert.alert("Thành công", `Đã khóa vị trí Dynamic ở mức ${currentMargin}px vào bộ nhớ thiết bị.`);
    } catch (error) {
      Alert.alert("Thất bại", "Không thể lưu cấu hình bảo mật vào thiết bị.");
    }
  };

  return (
    <View style={styles.container}>
      
      {/* KHU VỰC XEM TRƯỚC (PREVIEW) */}
      <View style={styles.previewContainer}>
        <Text style={styles.previewLabel}>MÀN HÌNH XEM TRƯỚC VỊ TRÍ</Text>
        {/* <View style={[styles.boxFake, { marginTop: currentMargin }]}>
          <Text style={styles.boxTextFake}>Quán Nhỏ • Đang tải...</Text>
        </View> */}
      </View>

      {/* KHU VỰC BẢN ĐIỀU KHIỂN */}
      <View style={styles.controlCard}>
        <Text style={styles.title}>Cấu hình Dynamic Island</Text>
        <Text style={styles.subTitle}>
          Điều chỉnh khoảng cách cách lề đỉnh đầu sao cho vừa vặn với tai thỏ hoặc camera của thiết bị hiện tại.
        </Text>

        <View style={styles.counterWrapper}>
          <Pressable style={styles.adjustBtn} onPress={handleDecrease}>
            <Text style={styles.btnText}>- Giảm</Text>
          </Pressable>

          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{currentMargin}</Text>
            <Text style={styles.unitText}>pixel</Text>
          </View>

          <Pressable style={styles.adjustBtn} onPress={handleIncrease}>
            <Text style={styles.btnText}>+ Tăng</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* Nút lưu cấu hình */}
        <Pressable style={styles.saveBtn} onPress={handleSaveConfig}>
          <Text style={styles.saveBtnText}>Lưu cấu hình thiết bị</Text>
        </Pressable>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  previewContainer: { 
    height: 200, 
    backgroundColor: "#e2e2e7", 
    alignItems: "center", 
    justifyContent: "flex-start", 
    borderBottomWidth: 1, 
    borderColor: "#d1d1d6",
    paddingTop: 1, // ✅ Đã thêm: Tạo điểm neo cho marginTop của boxFake hoạt động chuẩn xác
  },
  previewLabel: { fontSize: 10, color: "#8e8e93", fontWeight: "600", letterSpacing: 1, position: "absolute", bottom: 10 },
  boxFake: { height: 35, width: 180, backgroundColor: "black", borderRadius: 100, justifyContent: "center", alignItems: "center" }, // Đổi nền đen cho giống cái thật
  boxTextFake: { color: "white", fontSize: 11, fontWeight: "500" },
  controlCard: { backgroundColor: "white", margin: 20, padding: 24, borderRadius: 20, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  title: { fontSize: 19, fontWeight: "700", color: "#1c1c1e", marginBottom: 6 },
  subTitle: { fontSize: 13, color: "#8e8e93", lineHeight: 18, marginBottom: 25 },
  counterWrapper: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 },
  adjustBtn: { backgroundColor: "#f2f2f7", paddingHorizontal: 22, paddingVertical: 14, borderRadius: 12 },
  btnText: { color: primary_color, fontWeight: "700", fontSize: 15 },
  valueContainer: { alignItems: "center" },
  valueText: { fontSize: 28, fontWeight: "800", color: "#1c1c1e" },
  unitText: { fontSize: 11, color: "#8e8e93", marginTop: -2 },
  divider: { height: 1, backgroundColor: "#f2f2f7", marginVertical: 20 },
  saveBtn: { backgroundColor: primary_color, paddingVertical: 15, borderRadius: 14, alignItems: "center" },
  saveBtnText: { color: "white", fontWeight: "700", fontSize: 16 },
});

export default SettingDynamic;