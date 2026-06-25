import { formatMoney, primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { addCart } from "@/services/CartService";
import { updatePublic } from "@/store/features/PublicSlice";
import { toast } from "@/utils/toast";
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Modal from 'react-native-modal';
import { useDispatch } from "react-redux";
// import Fontisto from '@expo/vector-icons/Fontisto';
interface IMODAL {
  modalVisible: boolean,
  setModalVisible: (v: boolean) => void,
  product: any
}
interface toppingC {
  id: number,
  product_id: number,
  qty: number
}
interface IdataAddCart {
  product_id: number | undefined,
  qty: number
}
const StoreModal = ({ modalVisible, setModalVisible, product }: IMODAL) => {
  const [toppingChoose, setToppingChoose] = useState<toppingC[]>([]);
  const [dataAddCart, setDataAddCart] = useState<IdataAddCart>({
    product_id: undefined,
    qty: 1
  });
  const dispatch = useDispatch();
  useEffect(() => {
    setDataAddCart({
      product_id: product.id,
      qty: 1
    })
    
  }, [product.id])
  useEffect(() => {
    setToppingChoose([])
  }, [modalVisible])
  const addToCart = async () => {
    const data: any = await addCart({...dataAddCart, toppings: toppingChoose});
    if(data){
        dispatch(updatePublic({total_cart: data.total_cart, refresh_cart: true}))
        toast("Thêm giỏ hàng thành công!")
        setModalVisible(false)
    }
  }
    return (
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.container}>
            <View style={styles.box}>
                <View>
                  {/* <Text style={styles.header_text}>Bạn đang muốn?</Text> */}
                </View>
                <View style={styles.hr}></View>
                <View style={styles.body}>
                  <View style={styles.product_infos}>
                    <View style={styles.products}>
                      <Image source={{uri: product.thumbnail}} style={{width: 100, height: 50, borderRadius: 5}} />
                      <View>
                        <Text style={styles.name}>{product.name}</Text>
                        <Text style={styles.price}>{formatMoney(product.price)}</Text>
                      </View>
                    </View>
                    <View style={styles.qty}>
                      <AntDesign name="minus-circle" size={24} color={primary_color} onPress={() => {if(dataAddCart.qty > 1){setDataAddCart({...dataAddCart, qty: dataAddCart.qty - 1})}}}/>
                      <TextInput 
                        style={styles.input} 
                        value={String(dataAddCart?.qty || '1')}
                        keyboardType="numeric" 
                        onChangeText={(v) => {
                          // Only update if the string is numeric or empty (to allow clearing the field)
                            setDataAddCart({ ...dataAddCart, qty: Number(v) });
                        }}
                      />
                      <AntDesign name="plus-circle" size={24} color={primary_color} onPress={() => setDataAddCart({...dataAddCart, qty: dataAddCart.qty + 1})}/>
                    </View>
                  </View>
                  <ScrollView style={styles.topping_container}>
                      {product.toppings && product.toppings.length > 0 && product.toppings.map((topping: any) => {
                        if(topping.details && topping.details.length > 0){
                            return (
                              <View key={topping.id}>
                                  <Text style={styles.topping_header}>
                                      {topping.name}:
                                  </Text>
                                  <ScrollView style={styles.list_topping}>
                                      {topping.details.map((detail: any) => {
                                          return (
                                            <View style={styles.topping_item} key={detail.id}>
                                                <Text style={styles.topping_item_name}>{detail.product.name}</Text>
                                                {toppingChoose.findIndex((i: any) => i.id === detail.id) >= 0 ? 
                                                <Fontisto name="checkbox-active" size={24} color={primary_color} 
                                                onPress={() => {
                                                  const check_exists = toppingChoose.findIndex((i: any) => i.id === detail.id);
                                                    if(check_exists >= 0){
                                                      const new_toppings = toppingChoose.filter((item) => item.id !== detail.id);
                                                      setToppingChoose(new_toppings)
                                                    }
                                                }}/>  :

                                                <Fontisto name="checkbox-passive" size={24} color={primary_color} onPress={() => {
                                                    const check_exists = toppingChoose.findIndex((i: any) => i.id === detail.id);
                                                    if(check_exists === -1){
                                                      const ob = {
                                                        id: detail.id,
                                                        product_id: detail.product.id,
                                                        qty: 1
                                                      }
                                                      setToppingChoose([...toppingChoose, ob])
                                                    }
                                                }}/> }
                                                {/* <Fontisto name="checkbox-active" size={24} color={primary_color} /> */}
                                            </View>
                                          )
                                      })}
                                  </ScrollView>
                              </View>
                            )
                        }
                        
                      })}
                  </ScrollView>
                </View>
                 <View style={styles.footer}>
                  <Pressable style={[styles.btn, styles.btn_text_left]} onPress={() => setModalVisible(false) }>
                                        <Text style={styles.btn_text}>Hủy</Text>
                                      </Pressable>
                  <Pressable style={styles.btn} onPress={() => addToCart()}>
                      <Text style={styles.btn_text} >Thêm vào giỏ hàng</Text>
                  </Pressable>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
  },
  box: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
    marginBottom: 30,
  },
  header_text: {
    fontSize: 20,
    textAlign: "center"
  },
  hr: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 5
  },
  body: {
    paddingVertical: 5,
    gap: 10
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
  input: {
    minWidth: 10,
    color: primary_color,
    // borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5
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
      paddingBottom: 0
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
  }
})
export default StoreModal;