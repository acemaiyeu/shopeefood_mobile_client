import * as Device from 'expo-device';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// 1. Import hook lấy kích thước vùng an toàn
import { formatMoney, primary_color } from '@/constants/const';
import { getAllProducts } from '@/services/ProductService';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const CATEGORIES = [
  { id: 1, name: 'Cơm', icon: '🍛' },
  { id: 2, name: 'Trà Sữa', icon: '🧋' },
  { id: 3, name: 'Bánh Mì', icon: '🥖' },
  { id: 4, name: 'Gà Rán', icon: '🍗' },
  { id: 5, name: 'Ăn Vặt', icon: '🍿' },
  { id: 6, name: 'Bún/Phở', icon: '🍜' },
  { id: 7, name: 'Nước Ép', icon: '🥤' },
  { id: 8, name: 'Tráng Miệng', icon: '🍰' },
];
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
  const [products, setProducts] = useState([]);
  const [params, setParams] = useState({});
  const navigation: any = useNavigation();

  const getProduct = async () => {
    const rs: any = await getAllProducts(params);
    if(rs?.data){
        setProducts(rs.data)
        setParams({...params, ...rs.meta})
    }
  }
  useEffect(() => {
    getProduct()
  }, [])
  
  return (
    <ThemedView style={styles.container}>
     <View style={styles.header}>
        <View style={styles.searchBox}>
            <EvilIcons name="search" size={24} color="black" />
            <TextInput placeholder='Cơm tấm' style={styles.input}/>
        </View>
     </View>
     <View style={styles.nav}>
        {CATEGORIES.map((ca, ca_ind) => {
          return ( <Pressable style={styles.category_item} key={ca.id} onPress={() => getProduct()}>
                <Text style={styles.category_item_icon}>{ca.icon}</Text>
                <Text style={styles.category_item_text}>{ca.name}</Text>
          </Pressable>)
        })}
     </View>
     <ScrollView style={styles.body}>
       {products && products.length > 0 ?
        <>
          {products.map((product: any) => {{
            return (
               <Pressable style={styles.product_item} key={product.id} onPress={() => navigation.navigate(`store`, {store_slug: product.slug, product_id: product.id})}>
                <Image 
                    source={{ uri: product.thumbnail }} 
                    style={{ width: 100, height: 100 }} // Ensure you provide dimensions
                  />
                <View style={styles.product_info}>
                    <Text style={styles.product_name}>{product.name}</Text>
                    <View style={styles.product_detail}>
                      <Text style={styles.product_detail_text}>{product.distance ?? "1.2km"}</Text>
                      <Text style={styles.product_detail_text}>|</Text>
                      <Text style={styles.product_detail_text}>30 phút</Text>
                    </View>
                    <Text style={styles.product_price}>
                      {formatMoney(product.price)}
                    </Text>
                </View>
            </Pressable>
            )
          }})}
        </>
       : <Text>Không tìm thấy sản phẩm</Text>}
     </ScrollView>
     {/* <View style={styles.body}></View> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Thay vì dùng row ở gốc làm vỡ giao diện dọc, hãy xếp dọc (mặc định)
    flexDirection: 'column', 
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 5,
    backgroundColor: primary_color,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    boxSizing: 'border-box'
  },
  searchBox: {
    width: "99%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10
  },
  nav: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 10,
    marginBottom: 10
  },
  category_item: {
    width: "11.7%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    // paddingHorizontal: 10,
    // paddingVertical: 10,
    paddingBottom: 10,
    borderRadius: 5
  },
  category_item_first: {
    marginLeft: 5
  },
  category_item_icon: {
    fontSize: 30,
    lineHeight: 60
  },
  category_item_text: {
    fontSize: 12
  },
  body: {
    gap: 20,
    backgroundColor: "#f0f0f0",
    // justifyContent: "center",
    // alignItems: "center",
    // overflow: "hidden",
    // overflowY: "auto",
    // flex: 1
  },
  product_item: {
    width: "99%",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 5
  },
  product_info: {
    paddingVertical: 10
  },
  product_name: {
    flex: 1,
    fontWeight: "600"
  },
  product_detail: {
    flex: 1,
    flexDirection: "row",
    gap: 5
  },
  product_price: {
    flex: 1,
    color: primary_color
  },
  product_detail_text: {
    color: "#818080ea"
  },
  input: {
    flex: 1
  }
});