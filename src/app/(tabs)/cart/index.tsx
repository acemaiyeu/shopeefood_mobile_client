import DiscountModal from "@/components/ui/DiscountModal";
import PaymentCartModal from "@/components/ui/PaymentCartModal";
import QtyProductCartModal from "@/components/ui/QtyProductCartModal";
import QtyProductToppingCartModal from "@/components/ui/QtyProductToppingCartModal";
import { formatMoney, primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { addCart, getMyCart, updateToCart } from "@/services/CartService";
import { pushNotifiToStore } from "@/services/NotifyService";
import { createOrder } from "@/services/OrderService";
import { updatePublic } from "@/store/features/PublicSlice";
import { useWS } from "@/store/socket/WebSocketProvider";
import { toast } from "@/utils/toast";
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import { router, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
const Cart = () => {
    const {refresh_cart} = useSelector((state: any) => state.public)
    const [cart, setCart] = useState<any>({});
    const navigation: any = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const timeoutSearch: any = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalDiscountVisible, setModalDiscountVisible] = useState(false);
    const [modalPaymentVisible, setModalPaymentVisible] = useState(false);
    const [modalToppingVisible, setModalToppingVisible] = useState(false);
    const { connect, disconnect, isConnected } = useWS();
    const dispatch = useDispatch();
    const [dataModel, setDataModal] = useState({});
    const [dataToppingModel, setDataToppingModal] = useState({});
    const getCart = async() => {
        const data: any = await getMyCart();
        if(data){
            setCart({...data.data})
        }
    }

    const fetchData = async () => {
        setRefreshing(true);
        // Fetch your updated API data here
            await getCart()
        // setData(newData);
        setRefreshing(false);
    };
    
    useEffect(() => {
        getCart()
    }, [refresh_cart])

    const handleAddToCart = async (param: object) => {
        const data: any = await addCart(param);
        if(data){
           getCart() 
            dispatch(updatePublic({total_cart: data.total_cart}))
            setModalVisible(false)
            setModalToppingVisible(false)
        }
    }

     const handleChangeQty = (index: number, detail: any, new_qty: number) => {
            setCart({...cart, details: cart.details.map((i: any, i_index: number) => i_index !== index ? i : {...i, qty: new_qty} )})
            if (timeoutSearch.current) {
                clearTimeout(timeoutSearch.current);
            }
            if(new_qty > 0){
                 // Set the new timeout and store its ID in the ref
            timeoutSearch.current = setTimeout(() => {
                const obj = {product_id: detail.product_id, qty: new_qty, toppings: detail.list_toppings}
                handleAddToCart(obj)

            }, 1000);
            }       
    };

    const updateCart = async (params: object) => {
        const data: any = await updateToCart(params);
        if(data){
            await getCart()
            setModalPaymentVisible(false)
        }
    }

    const handleCreateOrder = async () => {
        console.log("👉 HÀM HANDLE_CREATE_ORDER VỪA BỊ KÍCH HOẠT!");
        const data: any = await createOrder();
            if(data){
                toast("Đặt hàng thành công!")
                dispatch(updatePublic({refest_order: true, order: data.data}))
                pushNotifiToStore(cart.details[0].product.store.slug, "Có đơn hàng mới");
                fetchData();
                dispatch(updatePublic({total_cart: 0}))
                if(data.data.code){
                    connect(data.data.code.toString())
                }
                
                if(data.data.type_payment === 'cash'){
                    router.replace('/(tabs)/my-orders');
                }
                if(data.data.type_payment === 'bank'){
                    navigation.navigate("payment_cart")
                }
                
            }
    }
    return (
        <ScrollView style={styles.container} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }>            
            {!cart.id ? <Text style={styles.container_text}>Giỏ hàng của bạn đang trống!</Text> : 
            <>
                <QtyProductCartModal modalVisible={modalVisible} setModalVisible={setModalVisible} data={dataModel}  setQty={handleAddToCart} />
                <DiscountModal modalVisible={modalDiscountVisible} setModalVisible={setModalDiscountVisible} cart={cart}/>
                <PaymentCartModal modalVisible={modalPaymentVisible} setModalVisible={setModalPaymentVisible} cart={cart} updateCart={updateCart} />
                <QtyProductToppingCartModal modalVisible={modalToppingVisible} setModalVisible={setModalToppingVisible} data={dataToppingModel} addToCart={handleAddToCart}/>
                <View style={styles.box}>    
                    {cart.details && cart.details.length > 0 && cart.details.map((detail: any, detail_index: number) => {
                        return(
                        <View style={styles.product_item} key={detail.id}>
                            <Pressable style={styles.product_item_x} onPress={() => handleAddToCart({product_id: detail.product_id, qty: 0})}>
                                <Feather name="x-square" size={24} color={primary_color} />
                            </Pressable>
                            <View style={styles.product_detail_item}>
                                <Image source={{ uri: detail.product.thumbnail }}  style={{width: 50, height: 50, borderRadius: 5}} />
                                <View style={styles.product_info}>
                                    <Text style={styles.product_name}>{detail.product_name}</Text>
                                    <Text style={styles.product_price}>{formatMoney(detail.product_price) + ""}</Text>
                                </View>
                                <View style={styles.product_qty}>
                                        <View style={styles.box_qty}>
                                            <AntDesign name="minus-square" size={15}  color={primary_color} onPress={() => handleChangeQty(detail_index,detail, detail.qty - 1)}/>
                                            <Text  style={styles.box_qty_text} onPress={() => {setDataModal(detail); setModalVisible(true)}}>{detail.qty + ""} </Text>
                                            {/* <AntDesign name="plus" size={15} color="white" /> */}
                                            <AntDesign name="plus-square" size={15} color={primary_color} onPress={() => handleChangeQty(detail_index, detail, detail.qty + 1)}/>
                                        </View>
                                        <View style={styles.total_price}>
                                                <Text style={styles.total_price_text}>Tổng tiền: </Text>
                                                <Text style={styles.total_price_value}>{formatMoney(detail.total_price).toString()}</Text>
                                        </View>
                                </View>
                            </View>
                            {detail.product_toppings && detail.product_toppings.length > 0 && 
                                <View style={styles.product_topping}>
                                    {detail.product_toppings.map((pro: any, pro_index: number) => {
                                        return(
                                            <Pressable style={[styles.product_topping_item, styles.bder]} key={pro.id} onPress={() => {setDataToppingModal({...detail, index_detail: detail_index, index_topping: pro_index}); setModalToppingVisible(true)}}>
                                                    <View style={styles.product_info}>
                                                        <View style={styles.product_name_topping}>
                                                            <Text style={styles.product_name_topping_name}>{pro.name} </Text> 
                                                            <Text style={styles.product_name_topping_price}>({formatMoney(pro.price).toString()})</Text>
                                                        </View>
                                                        {/* <Text style={styles.product_price}>{formatMoney(pro.price)}</Text> */}
                                                    </View>
                                                    <View style={styles.product_qty}>
                                                            <View style={styles.box_qty_topping}>
                                                                <Text style={styles.box_qty_text_topping}>x{(pro.qty??1)}</Text>
                                                                {/* <AntDesign name="plus" size={15} color="white" /> */}
                                                                <View style={styles.total_price_topping}>
                                                                    <Text style={styles.total_price_topping_text}>Tổng tiền: </Text>
                                                                    <Text style={styles.total_price_topping_value}>{formatMoney(pro.price * (pro.qty??1))}</Text>
                                                                </View>
                                                            </View> 
                                                    </View>
                                            </Pressable>
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

            <Pressable style={styles.box} onPress={() => setModalPaymentVisible(true)}> 
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

            <Pressable style={styles.payment} onPress={() => handleCreateOrder()}> 
                    <Text style={styles.payment_text}>Đặt hàng</Text> 
                    <Text style={styles.payment_text} onPress={() => handleNotify()}>test</Text> 
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
        marginHorizontal: 'auto'
    },
    box_qty_topping: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly'
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
        fontSize: 15,
        fontWeight: "600"
    },
    product_name_topping: {
        flexDirection: "row",
        alignItems: 'center'
    },
    product_name_topping_name: {
        fontFamily: SF_Pro_DISPLAY_BOLD,
        fontSize: 12,
        fontWeight: "600"
    },
    product_name_topping_price: {
        fontFamily: SF_Pro_DISPLAY_BOLD,
        fontSize: 12,
        fontWeight: "600",
        color: primary_color
    },
    total_price_topping_text: {
        fontSize: 12,
        fontFamily: SF_Pro,
    },
    total_price_topping_value: {
        fontSize: 12,
        color: primary_color,
        fontWeight: "600",
        fontFamily: SF_Pro_DISPLAY_BOLD
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
        fontSize: 15,
        // width: "100%",
        textAlign: "center"
    },
    box_qty_text_topping: {
        color: primary_color,
        // fontWeight: "600",
        // minWidth: 30,
        // textAlign: 'center',
        fontSize: 12,
        width: "100%",
        textAlign: "center"
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
    total_price_topping: {
        flexDirection: 'row'
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
        width: "90%",
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
        maxWidth: "65%"
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