import { primary_color, SF_Pro } from "@/constants/const";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Modal from 'react-native-modal';
// import Fontisto from '@expo/vector-icons/Fontisto';
interface IMODAL {
  modalVisible: boolean,
  setModalVisible: (v: boolean) => void,
  data: any,
  setQty: (param: object) => void
}
const QtyProductCartModal = ({ modalVisible, setModalVisible, data, setQty}: IMODAL) => {
    const [param, setParam] = useState<any>({});
    return (
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.container}>
            <View style={styles.box}>
                <View style={styles.header}>
                  <Text style={styles.header_text}></Text>
                </View>
                <View style={styles.body}>
                    <TextInput keyboardType="numeric" value={data.qty} style={styles.input} onChangeText={(v) => setParam({product_id: data.product_id, qty: v, toppings: data.list_toppings ?? null})}/>
                </View>
                <View style={styles.footer}>
                    <Pressable style={styles.btn} onPress={() => setModalVisible(false) }>
                      <Text style={styles.btn_text}>Hủy</Text>
                    </Pressable>
                    <Pressable style={styles.btn} onPress={() => setQty(param)}>
                      <Text style={styles.btn_text}>Cập nhật</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: 'center'
  },
  box: {
    backgroundColor: "#fff",
    width: "70%",
    height: 200,
    borderRadius: 10,
    padding: 10,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: "space-between"
  },
  header_text: {
    fontSize: 20,
    textAlign: "center"
  },
  body: {
    width: "100%",
    alignItems: 'center'
  },
  header: {
      width: "90%",
      borderBottomWidth: 1,
      borderColor: "#ccc"
  },
  input: {
      borderWidth: 1,
      borderColor: "#ccc",
      width: "90%",
      textAlign: 'center'
  },
  hr: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 5
  },
  product_infos: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  products: {
    flexDirection: "row",
    gap: 10
  },
  qty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: SF_Pro
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: primary_color,
  },
  footer: {
    flexDirection: "row",
    gap: 1
  },
  btn: {
    width: "50%",
    fontSize: 15,
    backgroundColor: primary_color,
    padding: 10,
    borderRadius: 5
  },
  btn_text: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center"
  },
  list_topping: {
    gap: 5
  },
  topping_item: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    marginVertical: 5
  },
  topping_item_name: {
    fontFamily: SF_Pro
  },
  topping_header: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: SF_Pro
  },
  topping_container: {
    maxHeight: 400
  }
})
export default QtyProductCartModal;