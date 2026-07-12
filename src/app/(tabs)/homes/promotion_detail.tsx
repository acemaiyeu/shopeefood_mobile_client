import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { StyleSheet, Text, View } from 'react-native';

export default function OrdersLayout() {
  const param: any = useLocalSearchParams();
  const promotion: any = JSON.parse(param.promotion)
  return (
      <View style={styles.container}>
        <View style={styles.form}>
            <View style={styles.header}>
                  <Text style={styles.header_text}>Tiêu đề:</Text>
                  <Text style={styles.header_value}>{promotion.name}</Text>
            </View>
        </View>

        {/* <View style={styles.form}>
            <View style={styles.header}>
                  <Text style={styles.header_text}>Loại áp dụng:</Text>
                  <Text style={styles.header_value}>{discount.type === 'product' ? 'ĐỒ ĂN' : 'VẬN CHUYỂN'}</Text>
            </View>
        </View> */}

        <View style={styles.form}>
            <View style={styles.header}>
                  <Text style={styles.header_text}>Thời gian áp dụng:</Text>
                  <Text style={styles.header_value}>{promotion.start_time} - {promotion.end_time}</Text>
            </View>
        </View>



        <View style={styles.form}>
            <View style={styles.header}>
                  <Text style={styles.header_text}>Mô tả:</Text>
                  <Text style={styles.header_value}>{promotion.descriptions}</Text>
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
    flex: 1,
    fontFamily: SF_Pro,
    paddingRight: 39,
  },
  food: {
    backgroundColor: primary_color
  }
})