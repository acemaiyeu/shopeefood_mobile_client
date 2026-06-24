import { SF_Pro, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { StyleSheet, Text, View } from 'react-native';

export default function OrdersLayout() {
  const discount = useLocalSearchParams();
  return (
      <View style={styles.container}>
        <View style={styles.form}>
            <View style={styles.header}>
                  <Text style={styles.header_text}>Tiêu đề:</Text>
                  <Text style={styles.header_value}>{discount.name}</Text>
            </View>
        </View>

        <View style={styles.form}>
            <View style={styles.header}>
                  <Text style={styles.header_text}>Loại áp dụng:</Text>
                  <Text style={styles.header_value}>{discount.type === 'product' ? 'ĐỒ ĂN' : 'VẬN CHUYỂN'}</Text>
            </View>
        </View>

        <View style={styles.form}>
            <View style={styles.header}>
                  <Text style={styles.header_text}>Thời gian áp dụng:</Text>
                  <Text style={styles.header_value}>{discount.start_time} - {discount.end_time}</Text>
            </View>
        </View>

        <View style={styles.form}>
            <View style={styles.header}>
                  <Text style={styles.header_text}>Trạng thái áp dụng:</Text>
                  <Text style={styles.header_value}>{discount.is_apply === "true" ? 'Đã đủ điều kiện' : 'Chưa đủ điều kiện'}</Text>
            </View>
        </View>

        <View style={styles.form}>
            <View style={styles.header}>
                  <Text style={styles.header_text}>Điều kiện áp dụng:</Text>
                  <Text style={styles.header_value}>{discount.descriptions}</Text>
            </View>
        </View>

      </View>
  );
}
const styles = StyleSheet.create({
  container: {
      padding: 10
  },
  form: {
    width: "100%"
  },
  header: {
    flexDirection: 'row',
    gap: 5
  },
  header_text: {
    fontFamily: SF_Pro_DISPLAY_BOLD
  },
  header_value: {
    fontFamily: SF_Pro
  }
})