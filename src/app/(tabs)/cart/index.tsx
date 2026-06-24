import DiscountModal from "@/components/ui/DiscountModal";
import QtyProductCartModal from "@/components/ui/QtyProductCartModal";
import { formatMoney, primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { addCart, getMyCart } from "@/services/CartService";
import { updatePublic } from "@/store/features/PublicSlice";
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import no_thumbnail from '../../../../assets/images/no-thumbnail.jpg';
const Cart = () => {
    const {total_cart} = useSelector((state: any) => state.public)
    const [cart, setCart] = useState<any>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalDiscountVisible, setModalDiscountVisible] = useState(false);
    const dispatch = useDispatch();
    const [dataModel, setDataModal] = useState({});
    const getCart = async() => {
        const data: any = await getMyCart();
        if(data){
            setCart({...data})
        }
    }
    useEffect(() => {
        getCart()
    }, [total_cart])

    const handleAddToCart = async (param: object) => {
        const data: any = await addCart(param);
        if(data){
           getCart() 
            dispatch(updatePublic({total_cart: data.total_cart}))
            setModalVisible(false)
        }
    }
    const updateCart = (params) => {
            
    }
    return (
        <ScrollView style={styles.container} >
            
            
            {!cart.id ? <Text style={styles.container_text}>Giỏ hàng của bạn đang trống!</Text> : 
            <>
                <QtyProductCartModal modalVisible={modalVisible} setModalVisible={setModalVisible} data={dataModel}  setQty={handleAddToCart} />
                <DiscountModal modalVisible={modalDiscountVisible} setModalVisible={setModalDiscountVisible} cart={cart} setCart={updateCart} />
                <View style={styles.box}>    
                    {cart.details && cart.details.length > 0 && cart.details.map((detail: any) => {
                        return(
                        <View style={styles.product_item} key={detail.id}>
                            <Pressable style={styles.product_item_x} onPress={() => handleAddToCart({product_id: detail.product_id, qty: 0})}>
                                <Feather name="x-square" size={24} color={primary_color} />
                            </Pressable>
                            <View style={styles.product_detail_item}>
                                <Image source={{ uri: detail.product.thumbnail }}  style={{width: 100, height: 50, borderRadius: 5}} />
                                <View style={styles.product_info}>
                                    <Text style={styles.product_name}>{detail.product_name}</Text>
                                    <Text style={styles.product_price}>{formatMoney(detail.product_price)}</Text>
                                </View>
                                <View style={styles.product_qty}>
                                        <View style={styles.box_qty}>
                                            <AntDesign name="minus-square" size={15}  color={primary_color} />
                                            <Text  style={styles.box_qty_text} onPress={() => {setDataModal(detail); setModalVisible(true)}}>{detail.qty}</Text>
                                            {/* <AntDesign name="plus" size={15} color="white" /> */}
                                            <AntDesign name="plus-square" size={15} color={primary_color} />
                                        </View>
                                        <View style={styles.total_price}>
                                                <Text style={styles.total_price_text}>Tổng tiền: </Text>
                                                <Text style={styles.total_price_value}>{formatMoney(detail.total_price)}</Text>
                                        </View>
                                </View>
                            </View>
                            {detail.product_toppings && detail.product_toppings.length > 0 && 
                                <View style={styles.product_topping}>
                                    <Text style={styles.product_topping_item_text}>Topping: </Text>
                                    {detail.product_toppings.map((pro: any) => {
                                        const imageSource = pro?.thumbnail 
                                        ? { uri: pro.thumbnail } 
                                        : no_thumbnail;
                                        return(
                                            
                                            <View style={[styles.product_topping_item, styles.bder]} key={pro.id}>
                                                    <Image source={imageSource}  style={{width: 100, height: 50, borderRadius: 5}} />
                                                    <View style={styles.product_info}>
                                                        <Text style={styles.product_name}>{pro.name}</Text>
                                                        <Text style={styles.product_price}>{formatMoney(pro.price)}</Text>
                                                    </View>
                                                    <View style={styles.product_qty}>
                                                            <View style={styles.box_qty}>
                                                                <AntDesign name="minus-square" size={15}  color={primary_color} />
                                                                <Text  style={styles.box_qty_text}>1</Text>
                                                                {/* <AntDesign name="plus" size={15} color="white" /> */}
                                                                <AntDesign name="plus-square" size={15} color={primary_color} />
                                                            </View>
                                                            <View style={styles.total_price}>
                                                                    <Text style={styles.total_price_text}>Tổng tiền: </Text>
                                                                    <Text style={styles.total_price_value}>{formatMoney(40000)}</Text>
                                                            </View>
                                                </View>
                                            </View>
                                        )
                                    })}
                                    
                                </View>
                            }
                        </View>)
                    })}
                    
            </View>
            
            <Pressable style={styles.box} onPress={() => setModalDiscountVisible(true)}> 
                <View style={styles.box_item}>
                        <Text style={styles.box_item_text}>Mã giảm giá: </Text>
                        <Text style={styles.box_item_value}>Chọn mã giảm giá</Text>
                        <View style={styles.icon}>
                                <EvilIcons name="chevron-right" size={24} color={primary_color} />
                        </View>
                </View>
            </Pressable>

            <Pressable style={styles.box}> 
                <View style={styles.box_item}>
                        <Text style={styles.box_item_text}>Phương thức thanh toán: </Text>
                        <Text style={styles.box_item_value}>{cart.type_payment === 'cash' ? "Thanh toán khi nhận hàng" : 'Chuyển khoản'}</Text>
                        <View style={styles.icon}>
                                <EvilIcons name="chevron-right" size={24} color={primary_color} />
                        </View>
                </View>
            </Pressable>

            <View style={styles.box}> 
                <View style={styles.box_item_input}>
                        <Text style={styles.box_item_text}>Ghi chú: </Text>
                        <TextInput style={styles.box_item_input_value} />
                        
                </View>
            </View>

            <View style={styles.box}> 
                <View style={styles.box_item_payment}>
                        <Text style={styles.box_item_payment_header}>THANH TOÁN</Text>
                        <View style={styles.box_item_payment_info}> 
                            {cart.info && cart.info.length > 0 && cart.info.map((info: any, info_index: number) => {
                                return (
                                    <View style={styles.box_item_payment_item} key={info.code}>
                                    <Text style={[styles.box_item_payment_item_text,(info_index <= 1 || info_index == cart.info.length - 1) && styles.color_primary]}>{info.title} </Text>
                                    <Text style={[styles.box_item_payment_item_value,(info_index <= 1 || info_index == cart.info.length - 1) && styles.color_primary]}>{info.value_text}</Text>
                                </View>
                                )
                            })}
                                
                        </View>
                        
                </View>
            </View>

            <Pressable style={styles.payment} onPress={() => setModalVisible(true)}> 
                    <Text style={styles.payment_text}>Đặt hàng</Text> 
            </Pressable>
            </>}
        </ScrollView>
            
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        // alignItems: "center",
        overflow: 'scroll',
        // overflowY: '',
    },
    container_text: {
        fontFamily: SF_Pro_DISPLAY_BOLD,
        margin: 'auto',
        color: primary_color
    },
    box: {
        width: "98%",
        backgroundColor: "#fff",
        marginVertical: 10,
        borderRadius: 5,
    },
    product_item: {
        gap: 5,
        alignItems: 'flex-end',
        position: 'relative',
        width: "100%",
    },
    product_item_x: {
        position: 'absolute',
        top: "2%",
        left: ".2%",
        zIndex: 100
    },
    product_detail_item: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        minHeight: 50,
        paddingHorizontal: 10,
        marginVertical: 5
    },
    product_info: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        flex: 1,
        gap: 10
    },
    product_name: {
        fontFamily: SF_Pro_DISPLAY_BOLD,
        fontSize: 18,
        fontWeight: "600"
    },
    product_price: {
        fontWeight: "500",
        color: primary_color
    },
    product_qty: {
        justifyContent: "space-between",
        // height: "100%"
        width: 130,
        alignItems: 'center',
    },
    box_qty: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 5,
        borderRadius: 5,
        // backgroundColor: primary_color,
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: 100,
        height: 30,
        justifyContent: 'space-between'
    },
    box_qty_text: {
        color: primary_color,
        // fontWeight: "600",
        // minWidth: 30,
        // textAlign: 'center',
        fontSize: 15
    },
    total_price: {
        flexDirection: "row",   
    },
    total_price_text: {
        fontWeight: "600"
    },
    total_price_value: {
        fontWeight: "600",
        color: primary_color
    },
    product_topping: {
        width: "100%",
        position: 'relative',
        alignItems: "flex-end",
        marginBottom: 10,
        marginRight: 10,
        gap: 10
    },
    product_topping_item: {
        flexDirection: "row",
        width: "80%",
        paddingHorizontal: 5,
        alignItems: 'center',
        borderRadius: 5
    },
    product_topping_item_text: {
        position: 'absolute',
        left: "5%",
        top: 0,
        color: primary_color,
        fontWeight: "600"
    },
    bder: {
        borderWidth: 1,
        borderColor: primary_color,
        borderStyle: 'dashed'
    },
    box_item: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
    },
    box_item_input: {
        padding: 10,
    },
    box_item_input_value: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: primary_color,
        fontFamily: SF_Pro,
        fontSize: 15,
        minHeight: 50,
        color: primary_color,
        wordWrap: 'wrap'
    },
    box_item_text: {
        fontFamily: SF_Pro
    },
    box_item_value: {
        flex: 1,
        textAlign: "right",
        color: "#808080",
        fontFamily: SF_Pro
    },
    icon: {
        width: 20,
        marginTop: 1
    },
    box_item_payment: {
        width: '100%',
        alignItems: 'center'
    },
    box_item_payment_header: {
        width: '90%',
        fontFamily: SF_Pro_DISPLAY_BOLD,
        fontSize: 18,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginBottom: 5
    },
    box_item_payment_info: {
        width: "100%"
    },
    box_item_payment_item: {
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    box_item_payment_item_text: {
        fontFamily: SF_Pro_DISPLAY_BOLD,
    },
    box_item_payment_item_value: {
        fontFamily: SF_Pro_DISPLAY_BOLD,
    },
    color_primary: {
        color: primary_color
    },
    payment: {
        width: "99%",
        backgroundColor: primary_color,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5
    },
    payment_text: {
        textAlign: 'center',
        color: "#fff",
        fontFamily: SF_Pro_DISPLAY_BOLD
    }
})
export default Cart;    