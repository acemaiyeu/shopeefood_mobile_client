// Ví dụ: app/(tabs)/my-orders/index.tsx
import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';


export default function PromotionListScreen() { // Bắt buộc phải có 'default'
    const param: any = useLocalSearchParams();
    const promotions = JSON.parse(param.promotions);
    const promo = param?.promotion ? JSON.parse(param.promotion):undefined
    const navigation: any = useNavigation();
    useEffect(() => {
      if(promo){
        navigation.navigate("promotion_detail", {promotion: JSON.stringify(promo)})
      }
    },[])
  return (
    <ScrollView >
      {promotions && promotions.length > 0 && promotions.map((promotion: any, promotion_index: number) => {
              return (
                  <Pressable style={[styles.order_item, promotion_index == promotion.length - 1 && styles.order_item_last]} key={promotion.id} onPress={() => navigation.navigate("promotion_detail", {promotion: JSON.stringify(promotion)})}>
                    <View style={styles.info}>
                        <Text style={styles.product_name}>{promotion.name}</Text>
                        <Text style={styles.notes}>
                            {promotion.start_time} - {promotion.end_time}
                          </Text>
                    </View>
                   
                </Pressable>
              )
            })}
            
          
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 10,
  },
  order_item: {
    width: "100%",
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    minHeight: 50,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flex: 1
  },
  order_item_last: {
    borderBottomWidth: 1,
  },
  thumbnail_container: {
      width: 80,
      height: "100%",
      alignItems: "center",
      borderWidth: 1,
      // justifyContent: "center"
  },
  info: {
    flex: 1,
  },
  product_name: {
    fontSize: 14,
    fontFamily: SF_Pro_DISPLAY_BOLD,
    color: primary_color
  },
  notes: {
    fontFamily: SF_Pro,
    fontSize: 12,
    fontStyle: 'italic',
  },
  price: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    color: primary_color,
    fontSize: 13
  },
  footer: {
    width: 100,
    height: "100%",
    justifyContent: 'space-between',
    paddingTop: 5,
    alignItems: 'flex-end',
    paddingRight: 5
  },
  created: {
    color: "#ccc",
    fontSize: 13,
    fontFamily: SF_Pro
  },
  pages: {
    width: "100%",
    padding: 10
  },
  page_box: {
    flexDirection: "row",
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  page_text: {
    fontSize: 20,
    fontFamily: SF_Pro_DISPLAY_BOLD,
    color: primary_color
  },
  order_status: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    fontSize: 12
  },
  pending: {
    color: "blue",
  },
  confirmed: {
    color: "orange",
  },
  paymented: {
    color: primary_color
  },
  ready: {
    color: "#aeb911"
  },
  shipping: {
    color: "#ce1adf"
  },
  shipped: {
    color: "#03a5ce"
  },
  cancelled: {
    color: "red"
  },
  completed: {
    color: "green"
  }
})