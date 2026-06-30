import { primary_color, SF_Pro_DISPLAY_BOLD } from "@/constants/const";
import { changePassword } from "@/services/UserService";
import { toast } from "@/utils/toast";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Modal from 'react-native-modal';
interface IMODAL {
  modalVisible: boolean,
  setModalVisible: (v: boolean) => void,
}

const UpdatePasswordModal = ({ modalVisible, setModalVisible}: IMODAL) => {
    const [password, setPassword] =  useState("");
    const [confirmPassword, setConfirmPassword] =  useState("");
    const [statusPassword, setStatusPassword] =  useState("");
    const [statusConfirm, setStatusConfirm] =  useState("");
    const [viewPassword, setViewPassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    
    const handleUpdate = async () => {
         if(password != confirmPassword){
            alert("Mật khẩu không khớp!")
            return;
        }
        setLoading(true)
          const data = await changePassword({password})
          if(data){
            toast("Cập nhật thành công")
            setModalVisible(false)
            setLoading(false)
          }   
    }
    useEffect(() => {
        if(password != confirmPassword){
            setStatusConfirm("Mật khẩu không khớp!")
        }else{
          setStatusConfirm("Mật khẩu trùng khớp")
        }
    }, [password, confirmPassword])
    function checkPasswordStrength() {
      let score = 0;

      if (!password) return { score: 0, label: "Quá ngắn" };
      if (password.length < 6) return { score: 0, label: "Quá ngắn" };

      // Tiêu chí 1: Có độ dài từ 8 ký tự trở lên
      if (password.length >= 8) score++;

      // Tiêu chí 2: Có chứa cả chữ hoa và chữ thường
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;

      // Tiêu chí 3: Có chứa chữ số
      if (/\d/.test(password)) score++;

      // Tiêu chí 4: Có chứa ký tự đặc biệt (!@#$%^&*)
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

      // Đánh giá dựa trên số điểm đạt được
      switch (score) {
          case 0:
              return { score, label: "Yếu", color: "#ff4d4d" };
          case 1:
              return { score, label: "Yếu", color: "#ff4d4d" };
          case 2:
              return { score, label: "Trung bình", color: "#ffa500" };
          case 3:
              return { score, label: "Mạnh", color: "#2ecc71" };
          case 4:
              return { score, label: "Rất mạnh", color: "#1abc9c" };
          default:
              return { score: 0, label: "Yếu", color: "#ff4d4d" };
      }
}
    useEffect(() => {
        setStatusPassword(checkPasswordStrength().label)
    }, [password])
    useEffect(() => {
        setLoading(false),
        setPassword("")
        setConfirmPassword("")
        setStatusConfirm("")
        setStatusPassword("")
    },[modalVisible])
    return (
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.container}>
            <View style={styles.box}>
                <View style={styles.header}>
                  <Text style={styles.header_text}>Đổi mật khẩu</Text>
                </View>
                <View style={styles.hr}></View>
                <View style={styles.body}>
                      <View style={styles.body_item}>
                        <MaterialIcons name="password" size={24} color="black" />
                        <TextInput style={styles.input}
                          value={password} 
                          onChangeText={setPassword} 
                          secureTextEntry={viewPassword === false ? true: false}
                          placeholder="Nhập mật khẩu mới"
                        />
                         {viewPassword === false ?
                        <Ionicons name="eye-off-outline" size={24} color="black" onPress={() => setViewPassword(true)}/> :
                        <Ionicons name="eye-outline" size={24} color="black" onPress={() => setViewPassword(false)}/>}
                      </View>
                      {password !== "" && 
                      <View style={styles.body_item}>
                        <Text style={styles.status_password_text}>Độ mạnh: </Text>
                        <Text style={[styles.status_password_value, statusPassword === "Trung bình" && styles.warning, (statusPassword === "Mạnh" || statusPassword === "Rất mạnh") && styles.success]}>{statusPassword}</Text>
                      </View>}
                      <View style={styles.body_item}>
                        <MaterialIcons name="password" size={24} color="black" />
                        <TextInput style={styles.input}
                          value={confirmPassword} 
                          onChangeText={setConfirmPassword} 
                          secureTextEntry={viewPassword === false ? true: false}
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </View>
                      {confirmPassword !== "" && 
                      <View style={styles.body_item}>
                        <Text style={styles.status_password_text}></Text>
                        <Text style={[styles.status_password_value, statusConfirm === "Mật khẩu trùng khớp" && styles.success]}>{statusConfirm}</Text>
                      </View>}
                </View>
                <View style={styles.footer}>
                  <Pressable style={[styles.btn, styles.btn_text_left]} onPress={() => setModalVisible(false)}>
                      <Text style={styles.btn_text}>Hủy</Text>
                  </Pressable>
                  <Pressable style={styles.btn} onPress={() => handleUpdate()}>
                    <Text style={styles.btn_text}>{loading ===  true ? <ActivityIndicator size="small" color="#0000ff" /> : "Cập nhật"}</Text>
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
    minHeight: 300,
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
  status_password_text: {
    fontFamily: SF_Pro_DISPLAY_BOLD
  },
  status_password_value: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    color: primary_color
  },
  input: {
    flex: 1
  },
  success: {
    color: "green"
  },
  warning: {
    color: "orange"
  }
})
export default UpdatePasswordModal;