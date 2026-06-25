import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Modal from 'react-native-modal';
// import Fontisto from '@expo/vector-icons/Fontisto';
interface IMODAL {
  modalVisible: boolean,
  setModalVisible: (v: boolean) => void,
  data: any,
  addToCart: (params: object) => void
}
const QtyProductToppingCartModal = ({ modalVisible, setModalVisible, data, addToCart}: IMODAL) => {
    const [param, setParam] = useState<any>({});
    const handleAddToCart = () => {
      const toppings = param.toppings ?? null;
      if(toppings){
          const new_param = {...param, toppings: param.toppings.map((i: any) => ({product_id: i.id, product_name: i.name, qty: i.qty}))}
          addToCart(new_param)
          return;
      }
        addToCart(param)
    }
    return (
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.container}>
          {modalVisible == true &&
            <View style={styles.box}>
                <View style={styles.header}>
                  <Text style={styles.header_text}>{data.product_toppings[data.index_topping].name}</Text>
                  <Text style={styles.header_text_notes}>(Món thêm không được nhiều hơn món chính)</Text>
                </View>
                <View style={styles.body}>
                    <TextInput keyboardType="numeric" value={data.product_toppings[data.index_topping].qty} style={styles.input} placeholder="Nhập số lượng vào đây" onChangeText={(v) => {
                        console.log(v > data.qty)
                      setParam({product_id: data.product_id, qty: data.qty, toppings: data.product_toppings.map((i: any, index: number) => index !== data.index_topping ? i : {...i, qty: ((v == "" || v == "0") ? 1 : (v > data.qty ? data.qty : v)) })})
                    }}/>
                </View>
                <View style={styles.footer}>
                    <Pressable style={[styles.btn, styles.btn_text_left]} onPress={() => setModalVisible(false) }>
                      <Text style={styles.btn_text}>Hủy</Text>
                    </Pressable>
                    <Pressable style={styles.btn} onPress={() => handleAddToCart()}>
                      <Text style={styles.btn_text}>Cập nhật</Text>
                    </Pressable>
                </View>
            </View> 
          }
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
    width: "80%",
    height: 200,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: "space-between"
  },
  header_text: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: SF_Pro_DISPLAY_BOLD
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
    width: "100%",
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: "#ccc",  
    height: 50  
  },
  btn: {
    width: "50%",
    backgroundColor: 'transparent',
    padding: 10,
    paddingBottom: 5
  },
  btn_text: {
    textAlign: 'center',
    fontFamily: SF_Pro_DISPLAY_BOLD,
    color: primary_color,
    flex: 1,
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 10
  },
  btn_text_left: {
    borderColor: "#ccc",
    borderRightWidth: 1
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
  },
  header_text_notes: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    fontSize: 10,
    textAlign: 'center',
    color: primary_color
  }
})
export default QtyProductToppingCartModal;