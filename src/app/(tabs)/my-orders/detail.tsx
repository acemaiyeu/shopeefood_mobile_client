import { formatMoney, primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { updatePublic } from "@/store/features/PublicSlice";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
const Detail = () => {
    const param: any = useLocalSearchParams();
    const order = JSON.parse(param.order);
    const router = useRouter();
    const dispatch = useDispatch();
    const navigation: any = useNavigation();
    useEffect(() => {
        if(order){
            if(order.status === "CONFIRMED" && order.type_payment === "bank"){
                dispatch(updatePublic({order}))
                router.replace('/(tabs)/cart/payment_cart')
            }
        }
    }, [])
const checkRatingStatus = (dateRatingStr: string) => {
    if (!dateRatingStr) return { canRating: false, message: "Không tìm thấy thời hạn đánh giá", result: false};

    // Thay khoảng trắng bằng 'T' và cộng thêm múi giờ +07:00 của Việt Nam
    const formattedStr = dateRatingStr.replace(' ', 'T') + "+07:00";

    const deadlineDate = new Date(formattedStr);
    const nowDate = new Date();

    console.log("Now TS:", nowDate.getTime(), " | Deadline TS:", deadlineDate.getTime());
    // Giờ đây nowDate luôn là THỜI GIAN THỰC TẠI của thiết bị, 
    // và deadlineDate đã được neo đúng theo múi giờ +07.

    if (nowDate.getTime() < deadlineDate.getTime()) {
        const diffMs = deadlineDate.getTime() - nowDate.getTime();
        const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return {
            canRating: true,
            message: `Còn ${hoursLeft} giờ ${minutesLeft} phút để đánh giá`,
            result: true
        };
    } else {
        return {
            canRating: false,
            message: "Đã hết hạn đánh giá đơn hàng này!",
            result: false
        };
    }
};
// --- CÁCH SỬ DỤNG TRONG COMPONENT ---

    return (
        <ScrollView style={styles.container}>
            {!order.id ? <Text style={styles.container_text}>Giỏ hàng của bạn đang trống!</Text> : 
            <>
                <View style={styles.box}>
                    <View style={styles.order_code}>
                        <Text style={styles.order_code_text}>Mã đơn: </Text>
                        <Text style={styles.order_code_value}>{order.code}</Text>
                    </View>
                </View>
                <View style={styles.box}>
                    <View style={styles.status}>
                        <Text style={styles.order_status_title}>Trạng thái: </Text>
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
                    </View>
                </View>  
                 <View style={styles.box}>
                    <Text style={styles.info_item_title}>Thông tin khách hàng</Text>
                    <View style={styles.info_item}>
                        <Text style={styles.info_item_text}>Tên khách hàng:</Text>
                        <Text style={styles.info_item_value}>{order.user_name}</Text>
                    </View>
                    <View style={styles.info_item}>
                        <Text style={styles.info_item_text}>SĐT:</Text>
                        <Text style={styles.info_item_value}>{order.user_phone}</Text>
                    </View>
                    <View style={styles.info_item}>
                        <Text style={styles.info_item_text}>Địa chỉ:</Text>
                        <Text style={styles.info_item_value} numberOfLines={2}>{order.address}</Text>
                    </View>
                </View>  
                {order.status !== "COMPLETED" && order.status !== "CANCELLED" && order.status !== "SHIPPED" && 
                <View style={styles.box}>
                    <Text style={styles.info_item_title}>Thông tin người giao hàng</Text>
                    <View style={styles.info_item}>
                        <Text style={styles.info_item_text}>Tên người giao hàng:</Text>
                        <Text style={styles.info_item_value}>{order.shipper_name}</Text>
                    </View>
                    <View style={styles.info_item}>
                        <Text style={styles.info_item_text}>SĐT:</Text>
                        <Text style={styles.info_item_value}>{order.shipper_phone}</Text>
                    </View>
                </View>  }
                <View style={styles.box}>    
                    {order.details && order.details.length > 0 && order.details.map((detail: any, detail_index: number) => {
                        return(
                        <View style={styles.product_item} key={detail.id}>
                            <View style={styles.product_detail_item}>
                                <Image source={{ uri: detail.product.thumbnail }}  style={{width: 50, height: 50, borderRadius: 5}} />
                                <View style={styles.product_info}>
                                    <Text style={styles.product_name}>{detail.product_name}</Text>
                                    <Text style={styles.product_price}>{formatMoney(detail.product_price) + ""}</Text>
                                </View>
                                <View style={styles.product_qty}>
                                        <View style={styles.box_qty}> 
                                            <Text  style={styles.box_qty_text}>x{detail.qty} </Text>
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
                                            <Pressable style={[styles.product_topping_item, styles.bder]} key={pro.id}>
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

            <View style={styles.box}> 
                <View style={styles.box_item_input}>
                        <Text style={styles.box_item_text}>Ghi chú: </Text>
                        <TextInput style={styles.box_item_input_value} value={order.notes}/>
                        
                </View>
            </View>

            <View style={styles.box}> 
                <View style={styles.box_item_payment}>
                        <Text style={styles.box_item_payment_header}>THANH TOÁN</Text>
                        <View style={styles.box_item_payment_info}> 
                            {order.info && order.info.length > 0 && order.info.map((info: any, info_index: number) => {
                                return (
                                    <View style={styles.box_item_payment_item} key={info.code}>
                                    <Text style={[styles.box_item_payment_item_text,(info_index <= 1 || info_index == order.info.length - 1) && styles.color_primary]}>{info.title} </Text>
                                    <Text style={[styles.box_item_payment_item_value,(info_index <= 1 || info_index == order.info.length - 1) && styles.color_primary]}>{info.value_text}</Text>
                                </View>
                                )
                            })}  
                        </View>
                        
                </View>
            </View>
            </>}
            {checkRatingStatus(order.date_rating).result === true && order.status === "COMPLETED" && 
            <Pressable style={styles.box} onPress={() => navigation.navigate("rating_order", {p_order: JSON.stringify(order)})}>
                <View style={styles.rating_box}>
                    <MaterialIcons name="star-rate" size={20} color={primary_color} /> 
                    <Text style={styles.rating}>Đánh giá đơn hàng</Text> 
                    <MaterialIcons name="star-rate" size={20} color={primary_color} />
                </View>
            </Pressable>}
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
        justifyContent: 'center'
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
        width: "100%",
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
    },
    order_status: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    fontSize: 15
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
  },
  status: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  order_status_title: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    fontSize: 15
  },
  order_code_value: {
    color: primary_color,
    fontSize: 20,
    fontFamily: SF_Pro_DISPLAY_BOLD, 
    textAlign: 'center'
  },
  order_code_text: {
    fontSize: 20,
    fontFamily: SF_Pro_DISPLAY_BOLD, 
    textAlign: 'center'
  },
  order_code: {
    flexDirection: "row",
    justifyContent: 'center'
  },
  info_item_title: {
    textAlign: 'center',
    fontFamily: SF_Pro_DISPLAY_BOLD
  },
  info_item: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    gap: 5
  },
  info_item_text: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    fontSize: 12
  },
  info_item_value: {
    fontFamily: SF_Pro,
    fontSize: 12,
    flex: 1,
    paddingRight: 5
    // borderWidth: 1
  },
  rating_box: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
  },
  rating: {
    color: primary_color,
    fontFamily: SF_Pro_DISPLAY_BOLD,
    textAlign: 'center',
    padding: 10,
    fontSize: 15
  }
})
export default Detail;    