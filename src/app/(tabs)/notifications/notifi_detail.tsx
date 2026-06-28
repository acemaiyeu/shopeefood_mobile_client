import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const DetailScreen = () => {
    const param: any = useLocalSearchParams();
    const notification = JSON.parse(param.noti);
    

    return (
        <ScrollView>
            {/* {notification ?   */}
                                <Pressable style={styles.item_notification}>
                                    <View style={styles.info_notification}>
                                        <View style={styles.info_notification_box}>
                                            <View style={styles.info_notification_title}>
                                                <Text style={styles.info_notification_title_text}>{notification.title}</Text>
                                            </View>
                                            <Text style={styles.info_notification_content}>- {notification.content}</Text>
                                        </View>
                                        <Text style={styles.info_notification_created_at}>27/06/2026 15:00</Text>
                                    </View>
                                </Pressable>
             {/* : <Text style={styles.container_text}>Bạn không có thông báo</Text> } */}
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
    list_notifications: {
        width: "100%"
    },
    item_notification: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 5,
        paddingRight: 15,
        borderBottomWidth: 1,
        borderColor: "#ccc"
    },
    info_notification: {
        flex: 1,
         paddingHorizontal: 5,
    },
    info_notification_box: {
        
       
        // height: 50,
        overflow: 'hidden'
    },
    info_notification_title: {
        flexDirection: 'row'
    },
    info_notification_title_text: {
        fontSize: 14,
        fontFamily: SF_Pro_DISPLAY_BOLD,
        color: primary_color
    },
    info_notification_content: {
        fontSize: 14,
        fontFamily: SF_Pro,
    },
    icon: {
        marginTop: 7,
        paddingRight: 5
    },
    active: {
        backgroundColor: "#e413591f"
    },
    item_notification_first: {
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    item_notification_last: {
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomWidth: 0
    },
    info_notification_created_at: {
        color: "#a19d9d",
        height: 20,
        fontSize: 10
    }
})
export default DetailScreen;    