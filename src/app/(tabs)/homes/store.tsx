import { ThemedView } from '@/components/themed-view';
import StoreModal from '@/components/ui/StoreModal';
import { formatMoney, primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import { getStoreBySlug } from '@/services/StoreService';
import Entypo from '@expo/vector-icons/Entypo';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Store() {
    const params: any = useLocalSearchParams();
    const [store, setStore] = useState<any>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [productActive, setProductActive] = useState({ name: "", price: 0 });
    const navigation: any = useNavigation();
    const handlePressProduct = (selectedProduct: any) => {
        // Chuẩn bị data bọc gọn gàng
        const productData = {
            ...selectedProduct,
            toppings: selectedProduct.toppings ? JSON.stringify(selectedProduct.toppings) : JSON.stringify([])
        };

        // Điều hướng sang màn hình chi tiết
        navigation.navigate("product_detail", JSON.stringify(productData));
        };
    // Refs cho cuộn
    const scrollViewRef = useRef<ScrollView>(null);
    const groupRefs = useRef<{ [key: string]: number }>({});

    const getDataStore = async () => {
        const data = await getStoreBySlug(params.store_slug);
        if (data) setStore(data);
    };

    useEffect(() => {
        if (!store.slug) getDataStore();
    }, []);

    const scrollToGroup = (groupId: string) => {
        const y = groupRefs.current[groupId];
        if (y !== undefined && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: y, animated: true });
        }
    };
    const handleAddToCart = (product: any) => {
        setProductActive({ ...product });
        setModalVisible(true);
    };

    useEffect(() => {
    setTimeout(() => {
      if (store.groups && store.groups.length > 0) {
        const products = store.groups.flatMap((group: any) => group.products);
        const find_product = products.findIndex((i: any) => i.id == params.product_id);
        if (find_product >= 0) {
          setProductActive({ ...products[find_product] });
          setModalVisible(true);
        }
      }
    }, 500);
  }, [store]);
    return (
        <ThemedView style={styles.container}>
            <StoreModal modalVisible={modalVisible} setModalVisible={setModalVisible} product={productActive || {}} />
            <View style={styles.header}>
                <View style={styles.thumbnail_container}>
                    <Image source={{ uri: store.thumbnail }} style={{ width: 130, height: 65 }} />
                        <View style={styles.store_info}>
                        <Text style={styles.store_name}>{store.name}</Text>
                        <View style={styles.time}> 
                                <View style={styles.info_time}> 
                                        <View style={styles.info_time_box}>
                                                <Text style={styles.info_time_box_title}>Mở cửa: </Text>
                                                <Text style={styles.info_time_box_value}>{store.time_open}</Text>
                                        </View>
                                        <View style={styles.info_time_box}>
                                                <Text style={styles.info_time_box_title}>Đóng cửa: </Text>
                                                <Text style={styles.info_time_box_value}>{store.time_close}</Text>
                                        </View>
                                </View>
                                <Text style={[styles.open, store.is_open == 1 ? styles.opening : styles.closed]}>{store.is_open ? 'Đang mở cửa' : 'Đã đóng cửa'}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.address}>
                    <Text style={styles.store_address}>Địa chỉ: {store.address}</Text>
                </View>
            </View>

            <View style={styles.body}>
                {/* Menu danh mục */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menu}>
                  <Text style={styles.menu_modal}>DANH MỤC: </Text>
                    {store?.groups?.map((group: any) => {
                      if(group.products && group.products.length > 0) {
                            return (
                              <Pressable key={group.id} style={styles.group_item} onPress={() => scrollToGroup(group.id)}>
                                  <Text style={styles.group_item_name}>{group.name}</Text>
                              </Pressable>
                            )
                      } 
                    })}
                </ScrollView>

                {/* Danh sách sản phẩm */}
                <ScrollView ref={scrollViewRef} style={styles.products}>
                    {store?.groups?.map((group: any) => {
                      if(group?.products && group?.products.length > 0){
                        return (
                          <View 
                            key={group.id} 
                            onLayout={(event) => {
                                groupRefs.current[group.id] = event.nativeEvent.layout.y;
                            }}
                            style={styles.groups}
                        >
                            <Text style={styles.group_name}>{group.name}</Text>
                            {group?.products?.map((product: any) => (
                                <Pressable style={styles.group_product_item} key={product.id} onPress={() => navigation.navigate("product_detail", {product: JSON.stringify(product)})}>
                                    <Image source={{ uri: product.thumbnail }} style={{ width: 50, height: 50, borderRadius: 5 }} />
                                    <View style={styles.group_product_info}>
                                        <Text style={styles.group_product_info_name}>{product.name}</Text>
                                        <Text style={styles.group_product_info_price}>{formatMoney(product.price)}</Text>
                                    </View>
                                    <Pressable style={styles.icon} onPress={() => handleAddToCart(product)}><Entypo name="circle-with-plus" size={24} color={primary_color} /></Pressable>
                                </Pressable>
                            ))}
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
    container: { flex: 1, backgroundColor: '#ebebebad', alignItems: "center" },
    header: { width: "98%", backgroundColor: "#fff", marginBottom: 10, padding: 5 },
    thumbnail_container: { width: "100%", padding: 5, flexDirection: "row", gap: 5 },
    store_info: { flex: 1},
    store_name: { fontSize: 20, fontWeight: "600" },
    store_address: { fontSize: 11, color: "#6d6c6c" },
    body: { width: "100%", flex: 1, paddingHorizontal: 10, gap: 10},
    menu: { flexGrow: 0, minHeight: 70, marginBottom: 10, backgroundColor: "#fff", padding: 10, paddingTop: 40, position: "relative"},
    menu_modal: {position: 'absolute', top: -35, left: 0, color: primary_color, fontWeight: '600'},
    group_item: { padding: 10, marginHorizontal: 5, borderRadius: 10, borderWidth: 1, borderColor: primary_color, alignItems: 'center', justifyContent: "center", minWidth: 60 },
    group_item_name: { textAlign: "center", color: primary_color, fontWeight: "600" },
    products: { flex: 1 },
    groups: { marginBottom: 20 },
    group_name: { fontSize: 20, fontWeight: "600", padding: 10, borderLeftWidth: 2, borderColor: "red" },
    group_product_item: { flexDirection: "row", padding: 10, backgroundColor: "#fff", marginVertical: 5, borderRadius: 5 },
    group_product_info: { flex: 1, paddingHorizontal: 10 },
    group_product_info_name: { fontWeight: "600", fontFamily: SF_Pro },
    group_product_info_price: { color: "red" },
    icon: {justifyContent: "center"},
    time: {width: "100%", alignItems: 'flex-start'},
    info_time: {flexDirection: "row", gap: 10},
    info_time_box: {flexDirection: "row", gap: 5},
    info_time_box_title: {fontFamily: SF_Pro_DISPLAY_BOLD, fontSize: 12},
    info_time_box_value: {fontFamily: SF_Pro_DISPLAY_BOLD, color: primary_color, fontSize: 12},
    opening: {color: "green"},
    closed: {color: "red"},
    open: {fontFamily: SF_Pro, fontSize: 12},
    address: {paddingHorizontal: 10}
});