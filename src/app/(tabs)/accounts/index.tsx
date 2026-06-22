// Ví dụ: app/(tabs)/my-orders/index.tsx
import { ThemedView } from '@/components/themed-view';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from 'expo-router';
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
  }
  
})
export default function OrderListScreen() { // Bắt buộc phải có 'default'
  const navigation: any = useNavigation();

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
        <View style={styles.version}>
          <Text>Phiên bản phần mềm: <Text>1.0.0</Text></Text>
        </View>
    </ThemedView>
  );
}