import { SF_Pro } from "@/constants/const"
import { StyleSheet, Text, View } from "react-native"

const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.item}>
                {/* <Text style={styles.item_header}></Text> */}
                <Text style={styles.item_value}>- Với mục đích giúp các quán ăn nhỏ lẻ hoặc quán ăn gia đình, những người buôn bán tại gia có người giao hàng riêng hoặc tự đi giao hàng có thể buôn bán với mức chi phí app nhỏ để được nhiều lợi nhuận. Đồng thời cũng
                    giúp cho người dùng mua sản phẩm với mức chi phí thấp hơn, hỗ trợ cuộc sống tốt hơn
                </Text>
            </View>
            <View style={styles.item}>
                <Text style={styles.item_value}>- Mục đích cuối cùng của phần mềm này là cùng giúp nhau để phát triển, cửa hàng đỡ chi phí hơn, người dùng có thể mua sản phẩm rẻ hơn và giúp chúng tôi tiếp cận với nhiều khách hàng hơn</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 10
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    item_value: {
        fontFamily: SF_Pro
    }
})
export default AboutScreen;