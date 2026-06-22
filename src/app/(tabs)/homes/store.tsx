import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { formatMoney, primary_color } from '@/constants/const';
import { getStoreBySlug } from '@/services/StoreService';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Store() {
    const params: any = useLocalSearchParams();
    const [store, setStore] = useState<any>({id: undefined})
    const getDataStore = async () => {
        const data = await getStoreBySlug(params.store_slug);
        console.log(data)
        if(data){
            setStore(data)
        }
    }
    useEffect(() => {
        if(!store.slug){
            getDataStore()
        }
        
    })
  
  return (
    <ThemedView style={styles.container}>
        <View style={styles.header}>
            <View style={styles.thumbnail_container}>
                   <Image source={{ uri: store.thumbnail }} 
                    style={{ width: 150, height: 100 }} />
            </View>
            <View style={styles.store_info}>
                    <View style={styles.partner}><Text style={styles.partner_text}>Đối tác với Quán Nhỏ</Text></View>
                    <Text style={styles.store_name}>{store.name} {store.is_open ? 
                            <Text style={styles.store_opened}>Đang mở cửa</Text> : 
                            <Text style={styles.store_closed}>Đã đóng cửa</Text> 
                        }</Text>
                    <Text style={styles.store_address}>{store.address}</Text>
                    <View style={styles.store_detail}>
                        <View style={styles.store_detail_box}>
                            <View style={styles.store_rating}>
                                <EvilIcons name="star" size={18} color={primary_color} />
                                <Text  style={styles.store_rating_text}>4.6 (500+ đánh giá)</Text>
                            </View>
                            <View style={styles.time}>
                                <Text style={styles.time}>Mở cửa: </Text> <Text style={styles.store_time}>08:00</Text>
                            </View>
                            <View style={styles.time}>
                                <Text style={styles.time}>Đóng cửa: </Text> <Text style={styles.store_time}>17:00</Text>
                            </View>
                        </View>
                        
                    </View>
            </View>
        </View>
        <View style={styles.body}>
                <View style={styles.menu}>
                    <Pressable style={styles.group_item}> 
                                    <Text style={styles.group_item_name}>Tất cả</Text>
                                </Pressable>
                    {store?.groups && store.groups.length > 0 && store.groups.map((group: any) => {
                        if(group.products.length > 0){
                            return (
                                <Pressable style={styles.group_item} key={group.id}> 
                                    <Text style={styles.group_item_name}>{group.name}</Text>
                                </Pressable>
                            )
                        }
                    })}
                </View>
                <ScrollView style={styles.products}>
                   {store?.groups && store.groups.length > 0 && store.groups.map((group: any) => {
                        if(group.products.length > 0){
                            return (
                                <View style={styles.groups} key={group.name}> 
                                    <Text style={styles.group_name}>{group.name}</Text>
                                    <View style={styles.group_products}>
                                            {group?.products && group?.products.length > 0 && group?.products.map((product: any) => {
                                                return (
                                                    <View style={styles.group_product_item} key={product.id}>
                                                        <Image source={{uri: product.thumbnail}} style={{width: 50, height: 50, borderRadius: 5}}/>
                                                        <View style={styles.group_product_info}>
                                                                <Text style={styles.group_product_info_name}>{product.name}</Text>
                                                                <Text style={styles.group_product_info_price}>{formatMoney(product.price)}</Text>
                                                        </View>
                                                        <View style={styles.group_product_add}>
                                                            <Entypo name="circle-with-plus" size={24} color={primary_color} />
                                                        </View>
                                                    </View>
                                                )
                                            })}
                                    </View>
                                </View>
                            )
                        }
                    })}
                </ScrollView>
        </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Thay vì dùng row ở gốc làm vỡ giao diện dọc, hãy xếp dọc (mặc định)
    flexDirection: 'column', 
    backgroundColor: '#ebebebad',
    alignItems: "center"
  },
  header: {
    width: "98%",
    height: 145,
    backgroundColor: "#fff",
    borderRadius: 5,
    flexDirection: "row"
  },
  thumbnail_container: {
    padding: 20,
  },
  store_info: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  partner: {
    backgroundColor: primary_color,
    width: 120,
    paddingHorizontal: 5,
    borderRadius: 2,
    marginTop: 10
  },
  partner_text: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center"
  },
  store_name: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    flexDirection: "row",
    justifyContent: "space-between",

  },
  store_address: {
    fontSize: 11,
    color: "#6d6c6c",
    flex: 1,
  },
  store_detail: {
    flexDirection: "row",
    gap: 10,
    height: 35,
  },
  store_detail_box: {
    flexDirection: "row",
    gap: 10,
    alignItems: 'center',
    marginTop: -15
  },
  store_rating: {
    flexDirection: "row"
  },
  store_rating_text: {
    fontSize: 11,
    fontWeight: "400"
  },
  time: {
    flexDirection: "row",
    gap: 2,
    fontSize: 11
  },
  store_time: {
    color: primary_color,
    fontSize: 11
  },
  store_opened: {
    color: "green",
    fontWeight: 'condensed',
    fontSize: 10
  },
  store_closed: {
    color: "red",
    fontWeight: 'condensed',
    fontSize: 10
  },
  body: {
    width: "100%",
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 10
  },
  menu: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 5,
    minHeight: 100,
    alignItems: 'center'
  },
  products: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    minHeight: 100
  },
  group_item: {
    width: "90%",
    padding: 10,
    borderRadius: 10
  },
  group_item_name: {
    // textAlign: "center"
  },
  groups: {
    gap: 10,
    
  },
  group_name: {
    fontSize: 20,
    fontWeight: "600",
    borderLeftWidth: 2,
    borderColor: primary_color,
    paddingHorizontal: 10
  },
  group_products: {
    gap: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  group_product_item: {
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 5,
    gap: 5,
    marginTop: 5
  },
  group_product_info: {
    flex: 1,
    justifyContent: "space-evenly"
  },
  group_product_info_name: {
    fontWeight: "600"
  },
  group_product_info_price: {
    color: primary_color
  },
  group_product_add: {
    width: 50,
    alignItems: 'center',
    justifyContent: "center",
  }
});