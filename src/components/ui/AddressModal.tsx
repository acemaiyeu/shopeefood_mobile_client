import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { createAddress, getCities, getDistricts, getWards, updateAddress } from "@/services/AddressService";
import { toast } from "@/utils/toast";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import { useDispatch } from "react-redux";
interface IMODAL {
  modalVisible: boolean,
  setModalVisible: (v: boolean) => void,
  address: any,
  updateParent: (v: boolean) => void,
  router: string
}
const AddressModal = ({ modalVisible, setModalVisible, address = null, updateParent, router = "address"}: IMODAL) => {
    const [model, setModel] =  useState<any>({
      default: 0
    });
    const [selectedOption, setSelectedOption] = useState('');
    const [loading, setLoading] = useState<boolean>(false)
    const [statusPhone, setStatusPhone] = useState<string>("")
    const [cities, setCities] = useState<any>([])
    const [districts, setDistricts] = useState<any>([])
    const [wards, setWards] = useState<any>([])

    const dispatch = useDispatch();
    useEffect(() => {
      if(address){
        setModel(address)
      }
      setLoading(false)
    },[])
    const getDataCities = async () => {
        const data: any= await getCities();
        if(data){
          setCities(data.data)
        }
    }
    const getDataDistricts = async () => {
        const data: any= await getDistricts(model.city_id);
        if(data){
          setDistricts(data.data)
        }
    }
    const getDataWards = async () => {
        const data: any= await getWards(model.district_id);
        if(data){
          setWards(data.data)
        }
    }
    useEffect(() => {
      getDataCities()
    },[])
    useEffect(() => {
      if(address){
        setModel(address)
      }
    }, [modalVisible,address])
    useEffect(() => {
      if(model.city_id){
        getDataDistricts()
      }
    },[model.city_id])
    useEffect(() => {
      if(model?.district_id){
        getDataWards()
      }
    },[model.district_id])
    function validateVietnamesePhoneNumber() {
        // Regex này kiểm tra các đầu số: 3, 5, 7, 8, 9 (Ví dụ: 090, 034, 086...)
        const regex = /^(03|05|07|08|09)\d{8}$/;
        
        return regex.test(model.phone);
    }
    useEffect(() => {
      if(validateVietnamesePhoneNumber()){
          setStatusPhone("")
      }else{
        setStatusPhone("SĐT sai định dạng")
      }
    }, [model.phone])
const handleUpdate = async () => {
          if (model?.phone && model.phone.includes('*')) {
            setModel({...model,phone: ""})
          }
          if(model.phone != "" && validateVietnamesePhoneNumber() === false){
              alert("SĐT sai định dạng")
              return;
          }
            setLoading(true)
            let data = undefined;
            let message = ""
          if(!model.id){
              data = await createAddress(model)
              message = "Tạo mới"
          }
          if(model.id){
              data = await updateAddress(model)
              message = "Cập nhật"
          }
        //       const data = await updateProfile({...model})
              if(data){
                toast(message + " thành công")
                setModalVisible(false)
                setLoading(false)
                updateParent(true)
              }   
        }

    return (
        <Modal isVisible={modalVisible}  style={styles.container}>
            <View style={styles.box}>
                <View style={styles.header}>
                  <Text style={styles.header_text}>{model?.id ? "Cập nhật địa chỉ" : "Tạo mới địa chỉ"}</Text>
                </View>
                <View style={styles.hr}></View>
                <ScrollView style={styles.body}>
                      <View style={styles.body_item}>
                        <TextInput style={styles.input} value={model.phone} placeholder="Số điện thoại (Bắt buộc)" onChangeText={(v) => setModel({...model, phone: v})}/>
                      </View>
                      
                          <View style={styles.pickerContainer}>
                              <Picker
                                selectedValue={model.city_id}
                                onValueChange={(itemValue) => setModel({city_id: itemValue})}
                                style={styles.pickerCustom} // Cực kỳ quan trọng để căn chỉnh chiều cao
                                mode="dropdown" // Để hiện danh sách dạng thả xuống trên Android
                              >
                                {/* Mục mặc định hiển thị ban đầu */}
                                <Picker.Item label="Chọn thành phố (Bắt buộc)" value="" color="#aaa"  style={styles.pickerCustomText}/>
                                {cities && cities.length > 0 && cities.map((c: any) => {
                                  return <Picker.Item label={c.name} value={c.id} style={styles.pickerCustomText} key={c.id}/>
                                })}
                              </Picker>
                            </View>
                             <View style={styles.pickerContainer}>
                              <Picker
                                selectedValue={model.district_id}
                                onValueChange={(itemValue) => setModel({...model,district_id: itemValue})}
                                style={styles.pickerCustom} // Cực kỳ quan trọng để căn chỉnh chiều cao
                                mode="dropdown" // Để hiện danh sách dạng thả xuống trên Android
                              >
                                {/* Mục mặc định hiển thị ban đầu */}
                                <Picker.Item label="Chọn quận/huyện (Bắt buộc)" value="" color="#aaa"  style={styles.pickerCustomText}/>
                                 {districts && districts.length > 0 && districts.map((d: any) => {
                                  return <Picker.Item label={d.name} value={d.id} style={styles.pickerCustomText} key={d.id}/>
                                })}
                              </Picker>
                            </View>
                            <View style={styles.pickerContainer}>
                              <Picker
                                selectedValue={model.ward_id}
                                onValueChange={(itemValue) => setModel({...model,ward_id: itemValue})}
                                style={styles.pickerCustom} // Cực kỳ quan trọng để căn chỉnh chiều cao
                                mode="dropdown" // Để hiện danh sách dạng thả xuống trên Android
                              >
                                {/* Mục mặc định hiển thị ban đầu */}
                                <Picker.Item label="Chọn phường/xã (Bắt buộc)" value="" color="#aaa"  style={styles.pickerCustomText}/>
                                {wards && wards.length > 0 && wards.map((w: any) => {
                                  return <Picker.Item label={w.name} value={w.id} style={styles.pickerCustomText} key={w.id}/>
                                })}
                              </Picker>
                            </View>
                     
                      <View style={styles.body_item}>
                        <TextInput style={styles.input} value={model.street} placeholder="Đường (Ví dụ: Nguyễn Văn Linh)" onChangeText={(v) => setModel({...model, street: v})}/>
                      </View>
                      <View style={styles.body_item}>
                        <TextInput style={styles.input} value={model.note_address} placeholder="Chi tiết (Bắt buộc): Số nhà ..., hẻm ..." onChangeText={(v) => setModel({...model, note_address: v})}/>
                      </View>
                      <TouchableOpacity style={styles.default} onPress={() => setModel({...model, default: ((model.defaut == 0 || !model.default) ? 1 : 0)})}>
                        {(!model.default || model?.default === 0) ? <Ionicons name="checkbox-outline" size={20} color="#ccc" /> : <Ionicons name="checkbox-outline" size={20} color={primary_color} />}
                        <Text style={styles.default_text}>Mặc định</Text>
                      </TouchableOpacity>

                      
                </ScrollView>
                <View style={styles.footer}>
                  {router === "address" && <Pressable style={[styles.btn, styles.btn_text_left]} onPress={() => setModalVisible(false)}>
                      <Text style={styles.btn_text}>Hủy</Text>
                  </Pressable> }
                  <Pressable style={styles.btn} onPress={() => handleUpdate()}>
                    <Text style={styles.btn_text}>{loading ===  true ? <ActivityIndicator size="small" color={primary_color} /> : "Cập nhật"}</Text>
                  </Pressable>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    // alignItems: 'flex-end'
  },
  box: {
    backgroundColor: "#fff",
    width: "100%",
    height: '80%',
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
    height: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10
  },
  body: {
    flex: 1,
    width: "100%",
    // alignItems: 'center',
    overflow: 'hidden',
    overflowY: 'scroll',
    gap: 10,
    paddingBottom: 10
  },
  body_item: {
      width: "90%",
      flexDirection: "row",
      gap: 5,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      alignItems: 'center',
      paddingHorizontal: 10,
      marginHorizontal: 'auto',
      marginBottom: 5
  },
  footer: {
    width: "100%",
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: "#ccc",  
    height: 50  
  },
  btn: {
    flex: 1,
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
  input: {
    flex: 1,
    fontSize: 13
  },
  status_phone: {
    color: primary_color,
    fontWeight: '600'
  },
  pickerContainer: {
    width: "90%",
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center', // Giúp Picker nằm giữa khung,
    alignItems: 'center',
    padding: 5,
    marginHorizontal: 'auto',
    marginBottom: 5
  },
  // Style ép cho bản thân cái Picker hiển thị đúng chiều cao
  pickerCustom: {
    width: '100%',
    height: 50, // Định hình chiều cao cố định cho ô picker giống ô input trên
    
  },
  pickerCustomText: {
    fontFamily: SF_Pro,
    fontSize: 13
  },
  default: {
    width: "90%",
    flexDirection: "row",
    gap: 10,
    marginHorizontal: "auto",
    alignItems: 'center'
  },
  default_text:{
    fontFamily: SF_Pro,
    fontSize: 13
  }
})
export default AddressModal;