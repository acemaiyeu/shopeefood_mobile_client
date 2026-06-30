import { primary_color, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Modal from 'react-native-modal';

import { updateProfile } from "@/services/UserService";
import { updatePublic } from "@/store/features/PublicSlice";
import { toast } from "@/utils/toast";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useDispatch } from "react-redux";
interface IMODAL {
  modalVisible: boolean,
  setModalVisible: (v: boolean) => void,
  profile: any,
}
const UpdateProfileModal = ({ modalVisible, setModalVisible, profile}: IMODAL) => {
    const [model, setModel] =  useState<any>({});
    const [loading, setLoading] = useState<boolean>(false)
    const [statusPhone, setStatusPhone] = useState<string>("")
    const dispatch = useDispatch();
    useEffect(() => {
      setModel({phone: "", fullname: profile.fullname}),
      setLoading(false)
    },[])
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
          if(model.phone != "" && validateVietnamesePhoneNumber() === false){
              alert("SĐT sai định dạng")
              return;
          }
            setLoading(true)
              const data = await updateProfile({...model})
              if(data){
                toast("Cập nhật thành công")
                setModalVisible(false)
                setLoading(false)
                dispatch(updatePublic({profile: {...profile, phone: (model.phone !== "" ? model.phone : profile.phone), fullname: model.fullname}}))
              }   
        }

    return (
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.container}>
            <View style={styles.box}>
                <View style={styles.header}>
                  <Text style={styles.header_text}>Cập nhật thông tin</Text>
                </View>
                <View style={styles.hr}></View>
                <View style={styles.body}>
                      <View style={styles.body_item}>
                        <MaterialCommunityIcons name="rename" size={24} color="black" />
                        <TextInput style={styles.input} value={model.fullname} onChangeText={(v) => setModel({...model, fullname: v})}/>
                      </View>
                      <View style={styles.body_item}>
                        <FontAwesome name="phone" size={24} color="black" />
                        <TextInput style={styles.input} placeholder="SĐT mới" onChangeText={(v) => setModel({...model, phone: v})}/>
                      </View>
                      {model.phone != "" && 
                      <View style={styles.body_item}>
                        <Text style={styles.status_phone}>{statusPhone}</Text>
                      </View>}
                          
                </View>
                <View style={styles.footer}>
                  <Pressable style={[styles.btn, styles.btn_text_left]} onPress={() => setModalVisible(false)}>
                      <Text style={styles.btn_text}>Hủy</Text>
                  </Pressable>
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
    minHeight: 250,
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
    // flex: 1,
    width: "100%",
    alignItems: 'center',
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
      paddingHorizontal: 10
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
  input: {
    flex: 1
  },
  status_phone: {
    color: primary_color,
    fontWeight: '600'
  }
})
export default UpdateProfileModal;