// Ví dụ: app/(tabs)/my-orders/index.tsx
import { formatMoney, primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import { getMyOrders } from '@/services/OrderService';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import no_thumbnail from '../../../../assets/images/no-thumbnail.jpg';


export default function OrderListScreen() { // Bắt buộc phải có 'default'
  const [orders, setOrders] = useState<any>([]);
  const [params, setParams] = useState<any>({
    curent_page: 1
  });
  const {order} = useSelector((state: any) => state.public)
  const navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const getOrders = async () => {
    const data: any = await getMyOrders(params?.pagination?.current_page ?? 1, 9)
    if(data) {
      setOrders(data.data);
      setParams({...data.meta})
    }
  }
  useEffect(() => {
    getOrders()
  }, [params?.pagination?.current_page,order])

      const fetchData = async () => {
        setRefreshing(true);
        // Fetch your updated API data here
            await getOrders()
        // setData(newData);
        setRefreshing(false);
    };

  return (
    <ScrollView style={styles.container}  refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} 
          />}>
      {orders && orders.length > 0 ? 
          <>
            {orders.map((order: any, order_index: number) => {
              const thumbnail = order.details[0].product.thumbnail ? {uri: order.details[0].product.thumbnail} : no_thumbnail
              return (
                  <Pressable style={[styles.order_item, order_index == orders.length - 1 && styles.order_item_last]} key={order.id} onPress={() => navigation.navigate("detail", {order: JSON.stringify(order)})}>
                      <Image source={thumbnail} style={{width: 60, height: 50, borderRadius: 5}}/>
                    <View style={styles.info}>
                        <Text style={styles.product_name}>{order.details[0].product_name}</Text>
                        <Text style={styles.notes}>
                            {order.details.length > 0 ? `(${order.details.map((i: any) => i.product_name).join(', ')})` : ''}
                          </Text>
                        <Text style={styles.price}>{formatMoney(order.grand_total)}</Text>
                    </View>
                    <View style={styles.footer}>
                        <Text style={[styles.order_status, 
                          order.status === "PENDING" && styles.pending,
                          order.status === "CONFIRMED" && styles.confirmed,
                          order.status === "PAYMENTED" && styles.paymented,
                          order.status === "SHIPPED" && styles.shipped,
                          order.status === "COMPLETED" && styles.completed,
                          order.status === "CANCELLED" && styles.cancelled,
                          order.status === "SHIPPING" && styles.shipping,
                          order.status === "READY" && styles.ready,
                        ]
                        }>{order.status_text}</Text>
                        <Text style={styles.created}>{order.created_at}</Text>
                    </View>
                </Pressable>
              )
            })}
            
          </> : <View><Text>Không có đơn hàng nào</Text></View>}
          <View style={styles.pages}>
              <View style={styles.page_box}>
                  {!params.pagination || params?.pagination?.current_page === 1 ?
                  <MaterialCommunityIcons name="skip-previous-circle-outline" size={30} color="gray"/> :
                    <MaterialCommunityIcons name="skip-previous-circle-outline" size={30} color={primary_color} onPress={() => {if((params.pagination.current_page ?? 1) === 1) {return}; setParams({pagination: {...params.pagination, current_page: params.pagination.current_page - 1}})}}/>
                  }
                  <Text style={styles.page_text}>{params?.pagination?.current_page ?? 1}</Text>
                  {!params.pagination || (params?.pagination.current_page === (params?.pagination?.total_pages??1)) ?
                  <MaterialCommunityIcons name="skip-next-circle-outline" size={30} color="gray" />
                  : <MaterialCommunityIcons onPress={() => setParams({pagination: {...params.pagination, current_page: params.pagination.current_page + 1}})} name="skip-next-circle-outline" size={30} color={primary_color} />}
              </View>
          </View>
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
    fontFamily: SF_Pro_DISPLAY_BOLD
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