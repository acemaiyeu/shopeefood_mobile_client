import { primary_color } from "@/constants/const";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

const LoaddingModal = () => {
    const {loadding} = useSelector((state: any) => state.public)
    return <View style={[styles.container, loadding === true && styles.active]}>
            <View style={styles.item}>
                 <ActivityIndicator size="small" color={primary_color} />
                <Text>Đang tải....</Text>
            </View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#cccccc41",
        left: -100,
        top: -100
    },
    active: {
        height: '100%',
        width: '100%',
        left: 0,
        top: 0
    },
    item: {
        backgroundColor: "white",
        width: 200,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: "0px 0px 12px 0px gray",
        borderRadius: 5
    }
})  
export default LoaddingModal;