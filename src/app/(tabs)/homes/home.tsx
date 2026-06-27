import * as Device from 'expo-device';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// 1. Import hook lấy kích thước vùng an toàn
import { formatMoney, getItem, primary_color, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import { getAllProducts } from '@/services/ProductService';
import { getProfile } from '@/services/UserService';
import { updatePublic } from '@/store/features/PublicSlice';
import { useWS } from '@/store/socket/WebSocketProvider';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
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
// Hàm tiện ích giúp dừng tiến trình (delay) một khoảng thời gian bằng async/await
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const { connect } = useWS();

  const [products, setProducts] = useState([]);
  const [params, setParams] = useState({});
  
  // Lấy profile từ Redux Store
  const { profile } = useSelector((state: any) => state.public);

  // 1. Hàm lấy danh sách sản phẩm
  const getProduct = async () => {
    try {
      const rs: any = await getAllProducts(params);
      if (rs?.data) {
        setProducts(rs.data);
        setParams({ ...params, ...rs.meta });
      }
    } catch (error) {
      console.log("Lỗi lấy sản phẩm:", error);
    }
  };

  // 2. Hàm xử lý lấy Profile một cách an toàn
  const fetchProfileIfNeeded = async () => {
    // Nếu trong Redux đã có profile id rồi thì không cần lấy lại nữa
    if (profile?.id) return;

    try {
      let token = await getItem('access_token');
      let retryCount = 0;

      // Thay thế vòng lặp while lỗi bằng vòng lặp đợi bất đồng bộ an toàn
      // Thử lại tối đa 3 lần, mỗi lần cách nhau 500ms nếu chưa tìm thấy token trong Storage
      while ((!token || typeof token !== 'string') && retryCount < 3) {
        console.log(`Chưa thấy token, đang thử lại lần ${retryCount + 1}...`);
        await sleep(500); // Đợi 500ms một cách đồng bộ trước khi kiểm tra lại
        token = await getItem('access_token');
        retryCount++;
      }

      // Kiểm tra lại lần cuối, nếu thực sự không có token thì dừng lại (chưa đăng nhập)
      if (!token || typeof token !== 'string') {
        console.log("Không tìm thấy token hợp lệ. Người dùng chưa đăng nhập.");
        return;
      }

      // Gọi API lấy thông tin profile (AxiosAuth interceptor sẽ tự đính kèm token vừa ghi)
      const response: any = await getProfile();

      if (response && response.data) {
        console.log("Dữ liệu profile tải thành công:", response.data);
        
        // Cập nhật vào Redux và kết nối Socket
        dispatch(updatePublic({ 
          profile: response.data, 
          total_cart: response.data.total_cart 
        }));
        connect(response.data.uid);
      }
    } catch (error) {
      console.log("Lỗi khi xử lý tải profile tại Home:", error);
    }
  };

  // 3. Quản lý các hiệu ứng vòng đời component bằng useEffect riêng biệt
  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    fetchProfileIfNeeded();
  }, [profile?.id]); // Chạy lại nếu profile.id thay đổi

            
  return (
    <ThemedView style={styles.container}>
     <View style={styles.header}>
        <View style={styles.searchBox}>
            <EvilIcons name="search" size={24} color="black" />
            <TextInput placeholder='Cơm tấm' style={styles.input}/>
        </View>
     </View>
     {/*  */}
     <ScrollView style={styles.body}>
        <ScrollView horizontal={true} style={styles.nav}>
        {CATEGORIES.map((ca, ca_ind) => {
          return ( <Pressable style={styles.category_item} key={ca.id} onPress={() => getProduct()}>
                <Text style={styles.category_item_icon}>{ca.icon}</Text>
                <Text style={styles.category_item_text}>{ca.name}</Text>
          </Pressable>)
        })}
     </ScrollView>
       {products && products.length > 0 ?
        <>
          {products.map((product: any) => {{
            return (
               <Pressable style={styles.product_item} key={product.id} onPress={() => navigation.navigate(`store`, {store_slug: product.slug, product_id: product.id})}>
                <Image 
                    source={{ uri: product.thumbnail }} 
                    style={{ width: 80, height: 60, borderRadius: 5 }} // Ensure you provide dimensions
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
                <Text style={styles.notes}>
                      Gần bạn
                    </Text>
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
    width: "100%"
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
    width: '100%',
    height: 100,
    flexDirection: "row",
    gap: 5,
    marginTop: 10,
    marginBottom: 10,
    overflow: 'hidden',
    overflowX: 'scroll',
    backgroundColor: '#fff'
  },
  category_item: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
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
    width: '100%'
  },
  product_item: {
    width: "99%",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 5,
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: 5
  },
  product_info: {
    paddingVertical: 10,
  },
  notes: {
    position: 'absolute', bottom: 10, fontFamily: SF_Pro_DISPLAY_BOLD, color: "#ccc", right: 5
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