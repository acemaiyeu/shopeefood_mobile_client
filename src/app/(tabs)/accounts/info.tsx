import UpdatePasswordModal from '@/components/ui/UpdatePasswordModal';
import UpdateProfileModal from '@/components/ui/UpdateProfileModal';
import { primary_color, SF_Pro } from '@/constants/const';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import Zocial from '@expo/vector-icons/Zocial';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
export default function InfoAccount() {
  const { profile } = useSelector((state: any) => state.public)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false)
  
  return (
    <View style={styles.container}>
      <UpdateProfileModal modalVisible={modalVisible} setModalVisible={setModalVisible}  profile={profile} />
      <UpdatePasswordModal modalVisible={passwordModalVisible} setModalVisible={setPasswordModalVisible}/>
        <TouchableOpacity style={styles.item}>
            <Ionicons name="person-circle-outline" size={24} color="black" />
            <Text style={styles.item_text}>{profile.fullname}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
            <Foundation name="telephone" size={24} color="black" />
            <Text style={styles.item_text}>{profile.phone}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
            <Zocial name="email" size={24} color="black" />
            <Text style={styles.item_text}>{profile.email}</Text>
        </TouchableOpacity>
         <View style={styles.item} >
            <Text style={styles.changePassword} onPress={() => setModalVisible(true)}>Cập nhật thông tin</Text>
            <Text style={styles.changePassword} onPress={() => setPasswordModalVisible(true)}>Đổi mật khẩu</Text>
         </View>
        
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    
  },
  item: {
    flexDirection: "row",
    gap: 5,
    borderColor: "gray",
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center'
  },
  item_text: {
    flex: 1
  },
  changePassword: {
    fontFamily: SF_Pro,
    padding: 5,
    borderRadius: 5,
    margin: 'auto',
    borderColor: primary_color,
    color: primary_color,
    borderWidth: 1
  }
})