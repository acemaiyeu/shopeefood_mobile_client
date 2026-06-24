import { primary_color, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { getDiscountClientAll } from "@/services/DiscountService";
import Octicons from '@expo/vector-icons/Octicons';
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Modal from 'react-native-modal';
// import Fontisto from '@expo/vector-icons/Fontisto';
interface IMODAL {
  modalVisible: boolean,
  setModalVisible: (v: boolean) => void,
  cart: any,
  setCart: (param: object) => void
}
interface IDISCOUNT {
  id: number,
  type: string
}
const DiscountModal = ({ modalVisible, setModalVisible, cart, setCart}: IMODAL) => {
    const [param, setParam] = useState<any>({});
    const navigation: any = useNavigation();
    const [discounts, setDiscounts] = useState([]);
    const [applyDiscounts, setApplyDiscounts] = useState<IDISCOUNT[]>([]);
    const getDataDiscount = async () => {
      const data = await getDiscountClientAll(1, 100, {slug: cart.details[0].product.store.slug});
      if(data){
          setDiscounts(data);
      }
    }
    const handleClickDiscount = (discount: any) => {
        const check = applyDiscounts.findIndex((i: any) => i.type == discount.type);
        if(check == -1){
            const ob = {
              id: discount.id,
              type: discount.type
            }
            setApplyDiscounts([...applyDiscounts, ob])
            return;
        }
        const new_apply_discounts = [...applyDiscounts];
        if(new_apply_discounts[check].id == discount.id){
            new_apply_discounts.splice(check,1)
        }else{
            new_apply_discounts[check].id = discount.id
        }
        setApplyDiscounts(new_apply_discounts);
        
        
    }
    useEffect(() => {
        if((discounts?.length === 0 || !discounts) && cart){
          getDataDiscount()
        }
    },[modalVisible, cart])
    return (
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.container}>
            <View style={styles.box}>
                <View style={styles.header}>
                  <Text style={styles.header_text}>Mã giảm giá</Text>
                </View>
                <View style={styles.hr}></View>
                <View style={styles.body}>
                      {discounts && discounts.length > 0 && discounts.map((discount: any) => {
                        return (
                          <Pressable style={[styles.discount_item, (discount.is_apply === false || applyDiscounts.findIndex((i: any) => i.id == discount.id) >= 0) && styles.none_apply]} onPress={() => handleClickDiscount(discount)}>
                            <View style={styles.thumbnail}>
                              <Text>{discount.type === 'product' ? 'ĐỒ ĂN' : 'VẬM CHUYỂN'}</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.discount_title}>{discount.name}</Text>
                                <Text style={styles.time}>{discount.start_time} - {discount.end_time}</Text>
                            </View>
                            <View style={styles.apply}>
                                <Pressable>
                                  {(discount.is_apply === true && applyDiscounts.findIndex((i: any) => i.id == discount.id) >= 0) ? 
                                  <Octicons name="dot-fill" size={24} color="black" /> 
                                  : <Octicons name="dot" size={24} color="black" /> }
                                  
      {/* <Octicons name="dot-fill" size={24} color="black" /> */}
                                </Pressable>
                                <Text style={styles.condition} onPress={() => navigation.navigate('discount_condition', discount)}>Điều kiện</Text>
                            </View>
                        </Pressable>
                        )
                      })}
                </View>
                <View style={styles.footer}>
                  <View style={styles.btn}>
                      <Text style={styles.btn_text}>Hủy</Text>
                  </View>
                  <View style={styles.btn}>
                    <Text style={styles.btn_text}>Áp dụng</Text>
                  </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    // alignItems: 'flex-end'
  },
  box: {
    backgroundColor: "#fff",
    width: "100%",
    height: 700,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: "space-between",
    overflow: 'hidden',
    overflowY: 'scroll',
    gap: 5
  },
  header_text: {
    fontSize: 20,
    textAlign: "center"
  },
  header: {
      width: "90%",
      height: 40,
      alignItems: 'center',
      justifyContent: 'center'
  },
  hr: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10
  },
  body: {
    flex: 1,
    width: "100%",
    alignItems: 'center',
    overflow: 'hidden',
    overflowY: 'scroll'
  },
  discount_item: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 100,
    height: 50,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    flex: 1,
    flexDirection: "column"
    // justifyContent: 'space-between'
  },
  apply: {
    width: 80,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  condition: {
    color: primary_color
  },
  time: {
    color: primary_color
  },
  none_apply: {
      backgroundColor: '#ccc'
  },
  footer: {
    width: "100%",
    flexDirection: 'row',    
  },
  btn: {
    width: "50%",
    backgroundColor: primary_color,
    paddingVertical: 5,
    borderRadius: 10
  },
  btn_text: {
    textAlign: 'center',
    fontFamily: SF_Pro_DISPLAY_BOLD,
    color: "#fff"
  }
})
export default DiscountModal;