import { Image, Pressable, StyleSheet } from "react-native";
import Modal from 'react-native-modal';
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IMODAL {
    modalVisible: boolean,
    setModalVisible: (v: boolean) => void,
    img_url: string
}
const ShowImageModal = ({ modalVisible, setModalVisible, img_url}: IMODAL) => {
    return (
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.container}>
            <Image source={{uri: img_url}} style={{width: "100%", height: "100%"}}/>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default ShowImageModal;