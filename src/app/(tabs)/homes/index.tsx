import * as Device from 'expo-device';
import { Button, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// 1. Import hook lấy kích thước vùng an toàn
import { formGroupGlobal, primary_color } from '@/constants/const';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useNavigation } from 'expo-router';
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
              <TextInput style={formGroupGlobal.input}></TextInput>
          </View>
          <View style={formGroupGlobal.group}>
              <Text style={formGroupGlobal.text}>Mật khẩu: </Text>
              <TextInput secureTextEntry={true} style={formGroupGlobal.input}></TextInput>
          </View>
          <Pressable onPress={() => alert("me")}>
            <View style={formGroupGlobal.button}>
              <Button title="Đăng nhập" color={primary_color} />
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
    fontSize: 40
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
    color: primary_color
  }
});