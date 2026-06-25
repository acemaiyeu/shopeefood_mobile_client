// Ví dụ: app/(tabs)/my-orders/index.tsx
import { ThemedView } from '@/components/themed-view';
import { deleteItem, primary_color, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ecebebd5"
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    borderBottomColor: "#cccccc80",
     borderBottomWidth: 1,
     backgroundColor: "#f5f5f5f1"
  },
  group_first: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  text: {
    flex: 1
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  version: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logout: {
    width: "100%",
    padding: 10,
    alignItems: 'center'
  },
  logout_text: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    width: 100,
    backgroundColor: primary_color,
    textAlign: "center",
    color: "white",
    padding: 10,
    borderRadius: 10
  }
  
})
export default function OrderListScreen() { // Bắt buộc phải có 'default'
  const navigation: any = useNavigation();
  const router = useRouter();

  const handleLogout = () => {
    deleteItem('access_token'); router.replace('/(auth)/login')
  }
  return (
    <ThemedView style={styles.container}>
        <Pressable onPress={() => navigation.navigate("info")}><View style={[styles.group, styles.group_first]}>
            <Ionicons name="person" size={24} color="black" />
            <Text style={styles.text} >Thông tin tài khoản</Text>
            <View><MaterialIcons name="navigate-next" size={24} color="black" /></View>
        </View>
        </Pressable>
        <View style={styles.group} >
            <MaterialIcons name="password" size={24} color="black" />
            <Text style={styles.text} >Mật khẩu</Text>
            <View><MaterialIcons name="navigate-next" size={24} color="black" /></View>
        </View>
        <View style={styles.group} >
            <Entypo name="address" size={24} color="black" />
            <Text style={styles.text} >Địa chỉ</Text>
            <View><MaterialIcons name="navigate-next" size={24} color="black" /></View>
        </View>
        <View style={styles.hr}></View>
        <View style={styles.group} >
            <Text style={styles.text}>Điều khoản dịch vụ</Text>
            <View><MaterialIcons name="navigate-next" size={24} color="black" /></View>
        </View>
        <View style={styles.group} >
            <Text style={styles.text}>Giải quyết tranh chấp và khiếu nại</Text>
            <View><MaterialIcons name="navigate-next" size={24} color="black" /></View>
        </View>
         <View style={styles.group} >
            <Text style={styles.text}>Thông tin về chúng tôi</Text>
            <View><MaterialIcons name="navigate-next" size={24} color="black" /></View>
        </View>
        <View style={styles.hr}></View>
        <View style={styles.logout}><Text style={styles.logout_text} onPress={() => handleLogout()}>Đăng xuất</Text></View>
        <View style={styles.version}>
          <Text>Phiên bản phần mềm: <Text>1.0.0</Text></Text>
        </View>
    </ThemedView>
  );
}