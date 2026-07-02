import AddressModal from "@/components/ui/AddressModal";
import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { getMyAddress } from "@/services/AddressService";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";


const AddressHome = () => {
    const [address, setAddress] = useState<any>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [addressActive, setAddressActive] = useState<any>({})
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const getData = async () => {
        const data = await getMyAddress()
        if(data){
            setAddress(data.data)
        }
    }
    const updateParent = (status: boolean) => {
        if(status === true){
            getData()
        }
    }
    useEffect(() => {
        getData()
    },[])
        const fetchData = async () => {
        setRefreshing(true);
        // Fetch your updated API data here
            await getData()
        // setData(newData);
        setRefreshing(false);
    }; 
    const handleClick = (address: object) => {
        setAddressActive(address)
        setModalVisible(true)
    }
    return (
        <ScrollView style={styles.container} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
              }>
                <AddressModal modalVisible={modalVisible} setModalVisible={setModalVisible} address={addressActive} updateParent={updateParent} router="address"/>
            {address && address.length > 0 ? 
            <>
                {address.map((a: any) => {
                    return(
                        <TouchableOpacity style={styles.address_item} key={a.id} onPress={() => handleClick(a)}>
                            {a.default == 1 && <Text style={styles.address_default}>Mặc định</Text>}
                            <Text style={styles.address_item_text} 
                                numberOfLines={1} 
                                ellipsizeMode="tail">{a.phone} | {a.note_address && a.note_address + ","} {a.street && a.street + ","} {a.ward.name}, {a.district.name}, {a.city.name}</Text>
                        </TouchableOpacity>
                    )
                })}
            </>
            : <Text>Bạn chưa có địa chỉ nào</Text>}
            
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%"
    },  
    address_item: {
        width: "100%",
        flexDirection: "row",
        position: 'relative',
        paddingTop: 15,
        paddingBottom: 3,
        paddingHorizontal: 10,
        paddingRight: 15,
        borderColor: "#ccc",
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    address_default: {
        width: 50,
        fontSize: 10,
        color: primary_color,
        paddingVertical: 1,
        fontFamily: SF_Pro_DISPLAY_BOLD
    },
    address_item_text: {
        fontFamily: SF_Pro,
        fontSize: 13,
        flex: 1,
    },
    address_item_last: {
        borderBottomWidth: 1
    }
})
export default AddressHome;