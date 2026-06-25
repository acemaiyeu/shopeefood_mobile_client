import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from 'react-native-modal';
// import Fontisto from '@expo/vector-icons/Fontisto';
interface IMODAL {
  modalVisible: boolean,
  setModalVisible: (v: boolean) => void,
  cart: any,
  updateCart: (params: object) => void
}

const PaymentCartModal = ({ modalVisible, setModalVisible, cart, updateCart}: IMODAL) => {
    const [param, setParam] = useState<any>({});
    const handleUpdateCart = (value: string) => {
      updateCart({type_payment: value})
  } 
    return (
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.container}>
          {modalVisible == true &&
            <View style={styles.box}>
                <View style={styles.header}>
                  <Text style={styles.header_text}>Phương thức thanh toán</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.payment_item} onPress={() => handleUpdateCart('cash')}>Thanh toán khi nhận hàng</Text>
                    <Text style={styles.payment_item} onPress={() => handleUpdateCart('bank')}>Chuyển khoản qua ngân hàng</Text>
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
    width: "70%",
    height: 200,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
    marginBottom: 30,
    alignItems: 'center',
    // justifyContent: "center"
  },
  header_text: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: SF_Pro_DISPLAY_BOLD
  },
  body: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 10
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
  payment_item: {
    padding: 10,
    color: primary_color,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontFamily: SF_Pro,
    fontSize: 12
  }
})
export default PaymentCartModal;