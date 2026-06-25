import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { applyDiscount, getDiscountClientAll } from "@/services/DiscountService";
import { updatePublic } from "@/store/features/PublicSlice";
import Octicons from '@expo/vector-icons/Octicons';
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Modal from 'react-native-modal';
import { useDispatch } from "react-redux";
// import Fontisto from '@expo/vector-icons/Fontisto';
interface IMODAL {
  modalVisible: boolean,
  setModalVisible: (v: boolean) => void,
  cart: any,
  setCart: (param: object) => void
}
interface IDISCOUNT {
  id: number,
  type: string,
  code: string
}
const DiscountModal = ({ modalVisible, setModalVisible, cart, setCart}: IMODAL) => {
    const [param, setParam] = useState<any>({});
    const navigation: any = useNavigation();
    const dispatch = useDispatch();
    const [discounts, setDiscounts] = useState([]);
    const [applyDiscounts, setApplyDiscounts] = useState<IDISCOUNT[]>([]);
    const getDataDiscount = async () => {
      const data: any = await getDiscountClientAll(1, 100, {slug: cart.details[0].product.store.slug});
      if(data){
          setDiscounts(data);
      }
    }
    const handleClickDiscount = (discount: any) => {
        const check = applyDiscounts.findIndex((i: any) => i.type == discount.type);
        if(check == -1){
            const ob = {
              id: discount.id,
              type: discount.type,
              code: discount.code
            }
            setApplyDiscounts([...applyDiscounts, ob])
            return;
        }
        const new_apply_discounts = [...applyDiscounts];
        if(new_apply_discounts[check].id == discount.id){
            new_apply_discounts.splice(check,1)
        }else{
            new_apply_discounts[check].id = discount.id
            new_apply_discounts[check].code = discount.code
        }
        setApplyDiscounts(new_apply_discounts);
        
        
    }
    useEffect(() => {
        if((discounts?.length === 0 || !discounts) && cart){
          getDataDiscount()
          
        }
    },[modalVisible, cart])

    const handleApplyDiscount = async (param: any) => {
        const data = await applyDiscount({codes: param.map((item: any) => item.code).sort()});

          dispatch(updatePublic({refresh_cart: true}))
          setModalVisible(false)
    }
    return (
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.container}>
            <View style={styles.box}>
                <View style={styles.header}>
                  <Text style={styles.header_text}>Mã giảm giá</Text>
                </View>
                <View style={styles.hr}></View>
                <View style={styles.body}>
                      {discounts && discounts.length > 0 && discounts.map((discount: any, discount_index: number) => {
                        return (
                          <Pressable style={[styles.discount_item, discount_index === discount.length - 1 && styles.discount_item_last , (discount.is_apply === false) && styles.none_apply]} onPress={() => handleClickDiscount(discount)}>
                            <View style={[styles.thumbnail, discount.type === 'product' ? styles.food : styles.ship]}>
                              <Text style={styles.thumbnail_text}>{discount.type === 'product' ? 'ĐỒ ĂN' : 'VẬN CHUYỂN'}</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.discount_title}>{discount.name}</Text>
                                <Text style={styles.time}>{discount.start_time} - {discount.end_time}</Text>
                            </View>
                            <View style={styles.apply}>
                                <Pressable>
                                  {(discount.is_apply === true && applyDiscounts.findIndex((i: any) => i.id == discount.id) >= 0) ? 
                                  <Octicons name="dot-fill" size={24} color={primary_color} /> 
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
                  <Pressable style={[styles.btn, styles.btn_text_left]} onPress={() => setModalVisible(false)}>
                      <Text style={styles.btn_text}>Hủy</Text>
                  </Pressable>
                  <Pressable style={styles.btn} onPress={() => handleApplyDiscount(applyDiscounts)}>
                    <Text style={styles.btn_text}>Áp dụng</Text>
                  </Pressable>
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
    height: 500,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
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
  discount_title: {
    fontSize: 12,
    fontFamily: SF_Pro
  },
  discount_item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5
  },
  discount_item_last: {
    borderBottomWidth: 1,
    borderColor: "#ccc"
  },
  thumbnail: {
    width: 100,
    height: "100%",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  thumbnail_text: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    color: "#fff"
  },
  info: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 5
    // justifyContent: 'space-between'
  },
  apply: {
    width: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 5
  },
  condition: {
    color: primary_color,
    fontSize: 11,
    fontFamily: SF_Pro_DISPLAY_BOLD
  },
  time: {
    color: primary_color,
    fontFamily: SF_Pro_DISPLAY_BOLD,
    fontSize: 11
  },
  none_apply: {
      backgroundColor: '#ccc'
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
  food: {
    backgroundColor: primary_color
  },
  ship: {
    backgroundColor: "#179231"
  }
})
export default DiscountModal;