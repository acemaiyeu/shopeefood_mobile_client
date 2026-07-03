import * as Device from 'expo-device';
import { Image, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// 1. Import hook lấy kích thước vùng an toàn
import AddressModal from '@/components/ui/AddressModal';
import { formatMoney, getItem, primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import { getAllProductHots, getAllProductPromotions, getAllProducts } from '@/services/ProductService';
import { getProfile } from '@/services/UserService';
import { updatePublic } from '@/store/features/PublicSlice';
import { useWS } from '@/store/socket/WebSocketProvider';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import no_thumbnail from '../../../../assets/images/no-thumbnail.jpg';
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
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [products, setProducts] = useState<any>([]);
  const [productPromotions, setProductPromotions] = useState<any>([]);
  const [productHots, setProductHots] = useState<any>([]);
  const [params, setParams] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);
  const timeoutSearch: any = useRef(null)
  // Lấy profile từ Redux Store
  const { profile } = useSelector((state: any) => state.public);
  const [isProductMore, setIsProductMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1)
  // 1. Hàm lấy danh sách sản phẩm
  const getProduct = async () => {
    try {
      dispatch(updatePublic({loadding: true}))
      const rs: any = await getAllProducts(params);
      if (rs?.data) {
        if(rs.data.length < 10){
          setIsProductMore(false)
        }
        setProducts(rs.data);
        setParams({ ...params, ...rs.meta });
      }
      dispatch(updatePublic({loadding: false}))

    } catch (error) {
      console.log("Lỗi lấy sản phẩm:", error);
    }
  };

  const getProductMore = async () => {
    try {
      dispatch(updatePublic({loadding: true}))
      const rs: any = await getAllProducts({...params,page: currentPage + 1});
      if (rs?.data) {
        console.log(rs?.data)
        // Tạo một bản sao của mảng trả về để tránh mutate trực tiếp data gốc
        const newItems = [...rs.data]; 
        setCurrentPage(currentPage+1)
        // Kiểm tra xem có trang sau hay không (Nếu nhận về đủ 11 món)
        const hasMore = newItems.length > 10;

        if (hasMore) {
            // CÓ TRANG SAU: Xóa món thứ 11 thừa đi để trang này chỉ còn đúng 10 món sạch
            newItems.pop();
            setIsProductMore(true);
        } else {
            // HẾT TRANG SAU: Giữ nguyên mảng (vì nó chỉ có từ 0 đến 10 món) và tắt trạng thái load more
            setIsProductMore(false);
        }

        // Gộp mảng sạch vào state hiển thị
        if(newItems.length > 0){
          setProducts(prevProducts => [...prevProducts, ...newItems]);
        }
        
    }
    dispatch(updatePublic({loadding: false}))
    } catch (error) {
      console.log("Lỗi lấy sản phẩm:", error);
    }
  }
    const getProductPromotions = async () => {
    try {
      const rs: any = await getAllProductPromotions();
      if (rs?.data) {
        setProductPromotions(rs.data);
      }
    } catch (error) {
      console.log("Lỗi lấy sản phẩm:", error);
    }
  };
  const getProductHots = async () => {
    try {
      const rs: any = await getAllProductHots();
      if (rs?.data) {
        setProductHots(rs.data);
      }
    } catch (error) {
      console.log("Lỗi lấy sản phẩm:", error);
    }
  };

    const fetchData = async () => {
        setRefreshing(true);
        // Fetch your updated API data here
            await getProduct()
            // await getProductPromotions()
        // setData(newData);
        setRefreshing(false);
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
        if(response.data.address_active == ""){
            setModalVisible(true)
        }
        // Cập nhật vào Redux và kết nối Socket
        dispatch(updatePublic({ 
          profile: response.data, 
          total_cart: response.data.total_cart 
        }));
        console.log("uid", response.data.uid)
        connect(response.data.uid);
      }
    } catch (error) {
      console.log("Lỗi khi xử lý tải profile tại Home:", error);
    }
  };

  // 3. Quản lý các hiệu ứng vòng đời component bằng useEffect riêng biệt

   
  const handleSearch = (value: any) => {
    const newParams = { ...params, product_name: value };
    setParams(newParams);

    if (timeoutSearch.current) {
      clearTimeout(timeoutSearch.current);
    }

    timeoutSearch.current = setTimeout(() => {
      // Reset về trang 1 khi tìm kiếm từ khóa mới
      getProduct();
    }, 1000);
  };
    const handleClickCategorySearch = (value: any) => {
    const newParams = { ...params, type_name: value };
    setParams(newParams);
    if (timeoutSearch.current) {
      clearTimeout(timeoutSearch.current);
    }

    timeoutSearch.current = setTimeout(() => {
      // Reset về trang 1 khi tìm kiếm từ khóa mới
      getProduct();
    }, 1000);
  };
  useEffect(() => {
      handleClickCategorySearch(params.type_name)
  },[params.type_name])
  useEffect(() => {
    getProductHots()
    getProduct()
    getProductPromotions()
  },[])
  useEffect(() => {
    fetchProfileIfNeeded();
  }, [profile?.id]); // Chạy lại nếu profile.id thay đổi

  const updateParent = async (status: boolean) => {
    if(status === true){
      await fetchProfileIfNeeded()
      await fetchData()
    }
  }
   const calculateDeliveryTime = (distance: any, prepareTime = 15) => {
    if (!distance || distance <= 0) return prepareTime;

    // Giả định vận tốc trung bình của shipper trong đô thị là 30 km/h
    // 30 km/h tương đương với 1 km đi hết 2 phút (60 / 30)
    const MINUTES_PER_KM = 2; 
    
    // Thời gian di chuyển ước tính
    const travelTime = distance * MINUTES_PER_KM;
    
    // Thêm thời gian biên (sai số kẹt xe, đèn đỏ, tìm nhà) khoảng 5 phút
    const bufferTime = 5; 

    // Tổng thời gian = Chuẩn bị + Di chuyển + Sai số
    const totalMinutes = prepareTime + travelTime + bufferTime;

    // Làm tròn lên số nguyên gần nhất (ví dụ 23.4 phút thành 24 phút)
    return Math.ceil(totalMinutes);
};         
  return (
    <ThemedView style={styles.container}>
      <AddressModal modalVisible={modalVisible} setModalVisible={setModalVisible} address={null} updateParent={updateParent} router='home'/>
     <View style={styles.header}>
        <View style={styles.searchBox}>
            <EvilIcons name="search" size={24} color="black" />
            <TextInput placeholder='Cơm tấm' style={styles.input} onChangeText={(v) => handleSearch(v)}/>
        </View>
     </View>
     {/*  */}
     <ScrollView style={styles.body} refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
           }>
        <ScrollView horizontal={true} style={styles.nav}>
        {CATEGORIES.map((ca, ca_ind) => {
          return ( <Pressable style={styles.category_item} key={ca.id} onPress={() => setParams({...params, type_name: ca.name})}>
                <Text style={styles.category_item_icon}>{ca.icon}</Text>
                <Text style={styles.category_item_text}>{ca.name}</Text>
          </Pressable>)
        })}
     </ScrollView>
     {productPromotions && productPromotions.length > 0 && <View style={styles.productHot}>
          <View style={styles.productHotModal}>
            <Text style={styles.productHotModalText}>Chương trình khuyến mãi</Text>
          </View>
                {productPromotions.map((product: any) => {
                  const thumbnail = product.thumbnail ? { uri: product.thumbnail } : no_thumbnail;
                  return (
                    <Pressable style={styles.product_item} key={product.product_id} onPress={() => navigation.navigate(`store`, {store_slug: product.slug, product_id: product.product_id})}>
                <Image 
                    source={thumbnail} 
                    style={{ width: 80, height: 60, borderRadius: 5 }} // Ensure you provide dimensions
                  />
                <View style={styles.product_info}>
                    <Text style={styles.product_name}>{product.product_name}</Text>
                    <View style={styles.product_detail}>
                      <Text style={styles.product_detail_text}>{Number(product.distance).toFixed(2)} km</Text>
                      <Text style={styles.product_detail_text}>|</Text>
                      <Text style={styles.product_detail_text}>Tối đa: {calculateDeliveryTime(product.distance)} phút</Text>
                    </View>
                    <Text style={styles.product_price}>
                      {formatMoney(product.price)}
                    </Text>  
                </View>
                <Text style={styles.notes}>
                      {product.promotion_name}
                    </Text>
            </Pressable>
                  )
                })}
     </View>}
      {productHots && productHots.length > 0 &&           
     <View style={styles.productHot}>
          <View style={styles.productHotModal}>
            <Text style={styles.productHotModalText}>Bán chạy</Text>
          </View>
                {productHots.map((product: any) => {
                  const thumbnail = product.thumbnail ? { uri: product.thumbnail } : no_thumbnail;
                  return (
                    <Pressable style={styles.product_item} key={product.product_id} onPress={() => navigation.navigate(`store`, {store_slug: product.slug, product_id: product.product_id})}>
                <Image 
                    source={thumbnail} 
                    style={{ width: 80, height: 60, borderRadius: 5 }} // Ensure you provide dimensions
                  />
                <View style={styles.product_info}>
                    <Text style={styles.product_name}>{product.product_name}</Text>
                    <View style={styles.product_detail}>
                      <Text style={styles.product_detail_text}>{Number(product.distance).toFixed(2)} km</Text>
                      <Text style={styles.product_detail_text}>|</Text>
                      <Text style={styles.product_detail_text}>Tối đa: {calculateDeliveryTime(product.distance)} phút</Text>
                    </View>
                    <Text style={styles.product_price}>
                      {formatMoney(product.price)}
                    </Text>  
                </View>
                <Text style={styles.notes}>
                      Bán chạy
                    </Text>
            </Pressable>
                  )
                })}
     </View>}

       {products && products.length > 0 ?
        <>
          {products.map((product: any) => {{
            const thumbnail = product.thumbnail ? { uri: product.thumbnail } : no_thumbnail;
            return (
               <Pressable style={styles.product_item} key={product.product_id} onPress={() => navigation.navigate(`store`, {store_slug: product.slug, product_id: product.product_id})}>
                <Image 
                    source={thumbnail} 
                    style={{ width: 80, height: 60, borderRadius: 5 }} // Ensure you provide dimensions
                  />
                <View style={styles.product_info}>
                    <Text style={styles.product_name}>{product.product_name}</Text>
                    <View style={styles.product_detail}>
                      <Text style={styles.product_detail_text}>{Number(product.distance).toFixed(2)} km</Text>
                      <Text style={styles.product_detail_text}>|</Text>
                      <Text style={styles.product_detail_text}>Tối đa: {calculateDeliveryTime(product.distance)} phút</Text>
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
          {isProductMore && 
          <View style={styles.more_product}>
              <Text style={styles.more_product_text} onPress={getProductMore}>Xem thêm</Text>
          </View> }
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
    position: 'absolute', bottom: 10, fontFamily: SF_Pro, color: "#ccc", right: 5, fontSize: 12
  },
  product_name: {
    flex: 1,
    fontWeight: "600",
    fontFamily: SF_Pro_DISPLAY_BOLD
  },
  product_detail: {
    flex: 1,
    flexDirection: "row",
    gap: 5
  },
  product_price: {
    flex: 1,
    color: primary_color,
    fontFamily: SF_Pro_DISPLAY_BOLD,
    marginTop: -5
  },
  product_detail_text: {
    color: "#818080ea",
    fontFamily: SF_Pro,
    marginTop: -5
  },
  input: {
    flex: 1
  },
  more_product: {
    padding: 10,
    width: "100%",
    alignItems: 'center'
  },
  more_product_text: {
    color: primary_color,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: primary_color,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    width: 100,
    textAlign: "center",
    fontFamily: SF_Pro_DISPLAY_BOLD
  },
  productHot: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: 'relative',
    backgroundColor: primary_color,
    marginVertical: 10
  },
  productHotModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: "white",
    width: "50%",
    height: 20,
    borderBottomRightRadius: 999
  },
  productHotModalText: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    fontSize: 10,
    color: primary_color,
    paddingLeft: 10
  }
});