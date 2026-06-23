import * as Device from 'expo-device';
import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// 1. Import hook lấy kích thước vùng an toàn
import { apiURL, formGroupGlobal, primary_color, setTokenWithExpiry, SF_Pro } from '@/constants/const';
import axiosAuth from '@/services/axiosAuth';
import { toast } from '@/utils/toast';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import logo from '../../../../assets/images/logo.png';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  // 2. Lấy thông số khoảng cách an toàn của thiết bị hiện tại
  const [formData, setFormData] = useState({});
  const handleLogin = async () => {
            await axios.post(`${apiURL}/api/login`, {
                ...formData
            }).then((res: any) => {
                if(res.data){
                  // console.log('res', res.data.access_token, res.data.expires_in)
                  setTokenWithExpiry('access_token', res.data.access_token, res.data.expires_in);
                  console.log("Đăng nhập thành công!");
                }
            }).catch((e) => {
              if (e.response) {
                  // Đối tượng e.config chứa thông tin request
                  // Đối tượng e.response chứa thông tin phản hồi từ server
                  
                  console.log("--- CHI TIẾT LỖI API ---");
                  console.log("Request URL:", `${apiURL}/api/auth` + e.config.url);
                  const payload = e.config.data ? JSON.parse(e.config.data) : "Không có payload";
                  console.log("Payload (Request Body):", payload);
                  console.log("Request Method:", e.config.method?.toUpperCase());
                  console.log("Status Code:", e.response.status, e.response.statusText);
                  console.log("Remote Address:", e.request._responseURL || "N/A"); // Lưu ý: React Native có thể không trả về đầy đủ Remote Address giống trình duyệt
                  console.log("Request Headers:", e.config.headers);
                  console.log("Response Headers:", e.response.headers);
                  console.log("------------------------");

                  toast("Lỗi xảy ra, kiểm tra console để xem chi tiết.", "error");
                } else if (e.request) {
                  console.log("Không nhận được phản hồi từ server:", e.request);
                } else {
                  console.log("Lỗi thiết lập request:", e.message);
                }
            })
    };
    const handleGoogleLogin = async () => {
    try {
        // Gọi lên API Laravel xin cái link Google auth
        const response = await axiosAuth.get('/google');
        
        // Chuyển hướng trình duyệt qua trang login của Google
        if (response.data.url) {
            window.location.href = response.data.url;
        }
    } catch (error) {
        console.error('Lỗi lấy link Google:', error);
    }
};
  const insets = useSafeAreaInsets();
  const navigation: any = useNavigation();
  return (
    <ThemedView style={styles.container}>
      {/* 3. Cộng thêm insets.top vào header để tự động tránh tai thỏ */}
        <View style={[styles.header]}>
            {/* <Text style={styles.headerText}>Quán nhỏ</Text> */}
            <Image source={logo} style={{width: 150, height: 150, borderRadius: 5}}/>
        </View>

        

        
        
        <View style={styles.body}>
          <View >
            <Text style={styles.title}>Đăng nhập tài khoản của bạn: </Text>
          </View>
            <View style={formGroupGlobal.group}>
              <Text style={formGroupGlobal.text}>Email: </Text>
              <TextInput style={formGroupGlobal.input} onChangeText={(v) => setFormData({...formData, email: v})}></TextInput>
          </View>
          <View style={formGroupGlobal.group}>
              <Text style={formGroupGlobal.text}>Mật khẩu: </Text>
              <TextInput secureTextEntry={true} style={formGroupGlobal.input} onChangeText={(v) => setFormData({...formData, password: v})}></TextInput>
          </View>
          <Pressable style={styles.test} onPress={() => handleLogin()}>
            <View style={formGroupGlobal.button}>
              <Text  style={styles.button_text}>Đăng nhập</Text>
            </View>
          </Pressable>
        </View>
{/*         
        <View style={formGroupGlobal.hr}></View> */}
        <View style={styles.otherLogin}>
            <Text style={styles.title}>Hoặc đăng nhập với: </Text>
            <View style={styles.icon}>
              <EvilIcons name="sc-google-plus" size={40} color="red" />
            </View>
          </View>
          
        {/* 4. Cộng thêm insets.bottom vào footer nếu cần tránh vạch điều hướng */}
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
            <Text>Nếu bạn chưa có tài khoản?</Text>
            <Text style={styles.register}> Đăng ký ngay </Text>
        </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  test: {
    backgroundColor: primary_color,
    borderWidth: 1
  },
  button_text: {
    textAlign: 'center',
    color: "#fff",
    fontFamily: SF_Pro
  },
  container: {
    flex: 1,
    // Thay vì dùng row ở gốc làm vỡ giao diện dọc, hãy xếp dọc (mặc định)
    flexDirection: 'column', 
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    width: "100%",
    alignItems: 'center',
    marginTop: 50,
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
    // justifyContent: 'center',
    // alignItems: 'center',
    width: "90%",
    padding: 20,
    paddingTop: 40
  },
  otherLogin: {
    alignItems: "center",
    // gap: , 
    marginBottom: 30
  },
  title: {
    padding: 10,
    marginBottom: 20,
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
    padding: 2,
    boxShadow: "0px 0px 12px 0px #ccc",
    borderRadius: 2,
    alignItems: "center"
  },
  register: {
    fontWeight: "600",
    color: primary_color,
    fontFamily: SF_Pro
  }
});