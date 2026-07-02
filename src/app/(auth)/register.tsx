import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { apiURL, formGroupGlobal, primary_color, setTokenWithExpiry, SF_Pro, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import { updatePublic } from '@/store/features/PublicSlice';
import { toast } from '@/utils/toast';
import axios from 'axios';
import { useNavigation, useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
// Import Linking để xử lý mở URL bên ngoài trên điện thoại

export default function HomeScreen() {
  const [formData, setFormData] = useState<any>({});
  const dispatch = useDispatch(); // Khai báo chuẩn ở đây
  const router = useRouter();
  const [loadding, setLoadding] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const navigation: any = useNavigation();

    const getProfile = async (token: string) => {
    try {
      const res = await axios.post(`${apiURL}/api/auth/profile`, {}, {
        headers: { // Sửa lại đúng cấu trúc trường headers của axios
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Dữ liệu profile thành công:", res.data);
      dispatch(updatePublic({
        profile: res.data, 
        total_cart: res.data.total_cart
      }));
    } catch (e) {
      console.log("Lỗi khi lấy thông tin profile trong login:", e);
    }
  };
  // Hàm xử lý Đăng nhập thông thường
  const handleRegister = async () => {
    // 🛑 ĐÃ XÓA DÒNG `const dispatch = useDispatch();` BỊ LỖI Ở ĐÂY
    setLoadding(true);
    try {
      const res: any = await axios.post(`${apiURL}/api/register`, {
        ...formData
      });

      if (res.data) {
        setTokenWithExpiry('access_token', res.data.access_token, res.data.expires_in);
        await getProfile(res.data.access_token);
        toast("Đăng nhập thành công!");
        router.replace('/(tabs)/homes/home');
      }
    } catch (e: any) {
      if (e.response) {
        console.log("--- CHI TIẾT LỖI API ---");
        console.log("Request URL:", `${apiURL}/api/auth` + e.config.url);
        const payload = e.config.data ? JSON.parse(e.config.data) : "Không có payload";
        console.log("Payload (Request Body):", payload);
        console.log("Status Code:", e.response.status, e.response.statusText);
        console.log("------------------------");

        toast(e, "error");
      } else if (e.request) {
        console.log("Không nhận được phản hồi từ server:", e.request);
      } else {
        console.log("Lỗi thiết lập request:", e.message);
      }
    } finally {
      setLoadding(false); // Đảm bảo trạng thái loading luôn được tắt kể cả khi lỗi
    }
  };


  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
            {/* <Image source={logo} style={{ width: 50, height: 50, borderRadius: 5 }} /> */}
        </View>

        <View style={styles.body}>
          <View>
            <Text style={styles.title}>Đăng ký tài khoản: </Text>
          </View>
          <View style={formGroupGlobal.group}>
              <Text style={formGroupGlobal.text}>Họ và tên: </Text>
              <TextInput 
                autoCapitalize="none"
                style={formGroupGlobal.input} 
                onChangeText={(v) => setFormData({ ...formData, fullname: v })} 
              />
          </View>
          <View style={formGroupGlobal.group}>
              <Text style={formGroupGlobal.text}>Email: </Text>
              <TextInput 
                autoCapitalize="none"
                keyboardType="email-address"
                style={formGroupGlobal.input} 
                onChangeText={(v) => setFormData({ ...formData, email: v })} 
              />
          </View>
            <View style={formGroupGlobal.group}>
              <Text style={formGroupGlobal.text}>SĐT: </Text>
              <TextInput 
                autoCapitalize="none"
                keyboardType="phone-pad"
                style={formGroupGlobal.input} 
                onChangeText={(v) => setFormData({ ...formData, phone: v })} 
              />
          </View>
          <View style={formGroupGlobal.group}>
              <Text style={formGroupGlobal.text}>Mật khẩu: </Text>
              <TextInput 
                secureTextEntry={true} 
                style={formGroupGlobal.input} 
                onChangeText={(v) => setFormData({ ...formData, password: v })} 
              />
          </View>
          <View style={formGroupGlobal.group}>
              <Text style={formGroupGlobal.text}>Nhập lại mật khẩu: </Text>
              <TextInput 
                secureTextEntry={true} 
                style={formGroupGlobal.input} 
                onChangeText={(v) => setFormData({ ...formData, confirm_password: v })} 
              />
          </View>
          
          <Pressable style={styles.test} onPress={handleRegister} disabled={loadding}>
            <View style={formGroupGlobal.button}>
              {!loadding ? (
                <Text style={styles.button_text}>Đăng ký</Text>
              ) : (
                <ActivityIndicator color="white" />
              )}
            </View>
          </Pressable>
        </View>
          
        <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
            <Text>Nếu bạn đã có tài khoản?</Text>
            <Text style={styles.register} onPress={() => navigation.navigate("login")}> Đăng nhập ngay </Text>
        </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  test: {
    backgroundColor: primary_color,
    padding: 5,
    borderRadius: 5
  },
  button_text: {
    textAlign: 'center',
    color: "#fff",
    fontFamily: SF_Pro_DISPLAY_BOLD
  },
  container: {
    flex: 1,
    flexDirection: 'column', 
    backgroundColor: '#fff',
    justifyContent: "space-between", // Tối ưu đẩy footer xuống đáy mượt mà hơn
    alignItems: "center"
  },
  header: {
    width: "100%",
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  headerText: {
    fontWeight: 'bold',
    color: primary_color,
    fontSize: 40,
    fontFamily: SF_Pro
  },
  body: {
    width: "90%",
    padding: 20,
  },
  otherLogin: {
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    fontWeight: "600"
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: "row",
    gap: 5,
    justifyContent: "center"
  },
  icon: {
    width: 100,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#eee'
  },
  register: {
    fontWeight: "600",
    color: primary_color,
    fontFamily: SF_Pro
  }
});