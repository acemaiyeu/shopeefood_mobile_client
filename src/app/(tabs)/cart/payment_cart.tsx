import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import * as Sharing from 'expo-sharing';
import { useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { useSelector } from "react-redux";
const paymentCart = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { order } = useSelector((state: any) => state.public) 
    
    const fetchData = async () => {
        setRefreshing(true);
        // Fetch your updated API data here
        // setData(newData);
        setRefreshing(false);
    };
    const viewShotRef = useRef<any>(null);
    

        const saveQR = async () => {
        const uri = await viewShotRef.current.capture();

        await Sharing.shareAsync(uri);
        };
        
    return (
        <ScrollView style={styles.container} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }>            
            {order?.code ? 
            <View style={styles.box}>
                    <View style={styles.box_item}>
                            <Text style={[styles.box_item_value, styles.title]}>BẠN ĐÃ ĐẶT HÀNG THÀNH CÔNG!</Text>
                    </View>
                    <View style={styles.box_item}>
                            <Text style={styles.box_item_text}>Mã đơn hàng: </Text>
                            <Text style={styles.box_item_value}>{order.code}</Text>
                    </View>
                    <View style={styles.box_item}>
                        
                        {(order.status === "PENDING" || order.status === "CONFIRMED") && 
                            <ActivityIndicator color={primary_color} /> 
                        }
                    </View>

                    <View style={styles.box_item}>
                            <Text style={styles.box_item_text}>Trạng thái: </Text>
                            
                            <Text style={styles.box_item_value}>{order.status_name}</Text> 
                            
                    </View>
                    <View style={styles.box_item}>
                        {order.status === "PENDING" && 
                            <Text style={styles.box_item_notes}>(Sau khi đơn được nhận sẽ tiến hành thanh toán)</Text>
                        }
                        {order.status === "CONFIRMED" && 
                            <Text style={styles.box_item_notes}>(Vui lòng quét mã QR bên dưới để thanh toán)</Text>
                        }
                    </View>
                     {order.status === "CONFIRMED" && 
                     <>
                     <View style={styles.box_item}>
                                <View style={styles.qr_box}>
                                    <ViewShot  ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
                                        <QRCode
                                            value={order.qr}
                                            size={220}
                                        />
                                    </ViewShot>
                                    <Text style={styles.download} onPress={() => saveQR()}>Tải về</Text>
                                    </View>
                     </View>
                      <View style={styles.box_item}>
                            <Text style={styles.box_item_text}>Người thụ hưởng: </Text>
                            <Text style={styles.box_item_value}>{order.store_name ?? "Mặc định"}</Text>
                    </View>
                     <View style={styles.box_item}>
                            <Text style={styles.box_item_text}>Giá trị cần thanh toán: </Text>
                            <Text style={styles.box_item_value}>{order.grand_total ?? "Mặc định"}</Text>
                    </View>
                    </>
                     }
                     
            </View> : <View style={styles.box}>
                    <View style={styles.box_item}>
                            <Text style={[styles.box_item_value, styles.title]}>KHÔNG TÌM THẤY ĐƠN HÀNG</Text>
                    </View>
                    </View>}
        </ScrollView>
            
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        paddingTop: 100,
    },
    box: {
        width: "95%",
        minHeight: 100,
        margin: 'auto'
    },
    box_item: {
        width: "100%",
        flexDirection: 'row',
        fontFamily: SF_Pro,
        fontSize: 14,
        justifyContent: 'center'
    },
    box_item_text: {
        textAlign: 'center',
        fontFamily: SF_Pro
    },box_item_value: {
        textAlign: 'center',
        color: primary_color,
        fontFamily: SF_Pro_DISPLAY_BOLD
    },
    title: {
        fontSize: 20,
    },
    box_item_notes: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    qr_box: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    download: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: primary_color,
        paddingTop: 15
    }
})
export default paymentCart;    