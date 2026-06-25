import { ThemedView } from '@/components/themed-view';
import StoreModal from '@/components/ui/StoreModal';
import { formatMoney, primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import AntDesign from '@expo/vector-icons/AntDesign';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import no_thumbnail from '../../../../assets/images/no-thumbnail.jpg';
export default function ProductDetail() {
    let params: any = useLocalSearchParams();
    // const toppingsArray = product.toppings ? JSON.parse(product.toppings) : [];
    let product = JSON.parse(params.product)
    const thumbnail = product.thumbnail != "" ? {uri: product.thumbnail} : no_thumbnail;
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <ThemedView style={styles.container}>
            <StoreModal modalVisible={modalVisible} setModalVisible={setModalVisible} product={product} />
            <View style={styles.header}>
                    <View style={styles.thumbnail_container}>
                            <Image source={thumbnail} style={{width: "100%", height: 200}} />
                    </View>
                    <Text style={styles.product_name}>{product.name}</Text>
                    <View style={styles.price}>
                            <View style={styles.price_info}>
                                <Text style={styles.price_text}>{(formatMoney(product.price))}</Text>
                                <Text style={styles.buy_text}>{product.qty_sale ?? 0} đã bán</Text>
                            </View>
                            <Pressable style={styles.icon_plus} onPress={() => {
                                setModalVisible(true)
                                }}>
                                <AntDesign name="plus-square" size={24} color={primary_color} />
                            </Pressable>
                    </View>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footer_title}>Đánh giá: </Text>
                    <View style={styles.list_rates}>
                            <View style={styles.rate_item}>
                                <View style={styles.icon}>
                                    <Ionicons name="person-circle-outline" size={24} color="black" />
                                </View>
                                    <View style={styles.rate_info}>
                                        <View style={styles.rate_info_detail}>
                                            <Text style={styles.rate_item_name}>Đỗ Nam Võ</Text>
                                            <Text style={styles.rate_item_value}>(
                                                <Foundation name="star" size={15} color={primary_color} />
                                                <Foundation name="star" size={15} color={primary_color} />
                                                <Foundation name="star" size={15} color={primary_color} />
                                                <Foundation name="star" size={15} color={primary_color} />
                                                <Foundation name="star" size={15} color={primary_color} />
                                            )
                                            </Text>
                                        </View>
                                        <View style={styles.rate_item_note}>
                                            
                                            <Text style={styles.rate_item_note_text}>Nội dung: </Text>
                                            <Text style={styles.rate_item_note_value}>Đồ ăn ngon</Text>
                                        </View>
                                    </View>
                            </View>

                            <View style={styles.rate_item}>
                                <View style={styles.icon}>
                                    <Ionicons name="person-circle-outline" size={24} color="black" />
                                </View>
                                    <View style={styles.rate_info}>
                                        <View style={styles.rate_info_detail}>
                                            <Text style={styles.rate_item_name}>Đỗ Nam Võ</Text>
                                            <Text style={styles.rate_item_value}>(
                                                <Foundation name="star" size={15} color={primary_color} />
                                                <Foundation name="star" size={15} color={primary_color} />
                                                <Foundation name="star" size={15} color={primary_color} />
                                                <Foundation name="star" size={15} color={primary_color} />
                                                <Foundation name="star" size={15} color={primary_color} />
                                            )
                                            </Text>
                                        </View>
                                        <View style={styles.rate_item_note}>
                                            
                                            <Text style={styles.rate_item_note_text}>Nội dung: </Text>
                                            <Text style={styles.rate_item_note_value}>Đồ ăn ngon</Text>
                                        </View>
                                    </View>
                            </View>
                    </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ebebebad', alignItems: "center", width: '100%' },
    header: { width: "98%", backgroundColor: "#fff", marginBottom: 10, padding: 5 },
    thumbnail_container: { width: "100%", padding: 5, flexDirection: "row", gap: 5 },
    product_name: {fontFamily: SF_Pro_DISPLAY_BOLD, fontSize: 20, paddingHorizontal: 10},
    price: {flexDirection: 'row', justifyContent: 'space-between'},
    price_info: {flexDirection: 'row', gap: 10},
    price_text: {paddingHorizontal: 10, borderColor: "#ccc", fontFamily: SF_Pro_DISPLAY_BOLD, color: primary_color, borderRightWidth: 1},
    buy_text: {fontFamily: SF_Pro},
    footer: {
        flex: 1,
        width: "100%",
        padding: 10,
        alignItems: 'flex-start'
    },
    footer_title: {fontFamily: SF_Pro_DISPLAY_BOLD, fontSize: 20},
    list_rates: {flexDirection: "column", width: "100%", gap: 5},
    rate_item: {flexDirection: "row"},
    icon: {
        paddingHorizontal: 10
    },
    rate_info: {width: '100%'},
    rate_info_detail: {flexDirection: 'row', gap: 5, alignItems: 'center'},
    rate_item_name: {fontFamily: SF_Pro_DISPLAY_BOLD},
    rate_item_value: {flexDirection: "row"},
    rate_item_note: {flexDirection: 'row', alignItems: 'center'},
    rate_item_note_text: {fontFamily: SF_Pro_DISPLAY_BOLD, fontSize: 12},
    rate_item_note_value: {fontFamily: SF_Pro, fontSize: 12},
    icon_plus: {width: 100, height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10}
});