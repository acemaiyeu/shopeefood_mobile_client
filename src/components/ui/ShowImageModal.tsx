import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Modal from 'react-native-modal';
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IMODAL {
    modalVisible: boolean;
    setModalVisible: (v: boolean) => void;
    img_url: string;
}

const ShowImageModal = ({ modalVisible, setModalVisible, img_url }: IMODAL) => {
    return (
        <Modal 
            isVisible={modalVisible} 
            onBackdropPress={() => setModalVisible(false)} 
            style={styles.modalCentered}
            animationIn="fadeIn"
            animationOut="fadeOut"
            useNativeDriver
        >
            {/* Vùng bọc lớn: Bấm vào bất kỳ đâu ngoài nút X hoặc ảnh (vùng trống) cũng sẽ tắt */}
            <Pressable style={styles.container} onPress={() => setModalVisible(false)}>
                
                {/* Nút tắt (Dấu X) ở góc trên bên phải */}
                <Pressable 
                    style={styles.closeButton} 
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.closeText}>✕</Text>
                </Pressable>

                {/* Vùng hiển thị ảnh */}
                <View style={styles.imageWrapper}>
                    <Image 
                        source={{ uri: img_url }} 
                        style={styles.fullImage} 
                        resizeMode="contain" 
                    />
                </View>

            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalCentered: {
        margin: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Thêm nền đen mờ nhìn sẽ chuyên nghiệp hơn
    },
    container: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    imageWrapper: {
        width: '100%',
        height: '80%', // Giới hạn ảnh trong khoảng 80% chiều cao để chừa khoảng trống trên/dưới dễ bấm tắt
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 50, // Khoảng cách từ đỉnh màn hình xuống (tránh tai thỏ/dynamic island)
        right: 20, // Khoảng cách từ cạnh phải
        backgroundColor: 'rgba(255, 255, 255, 0.25)', // Nền trắng mờ tròn
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Đảm bảo luôn nằm trên cùng
    },
    closeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ShowImageModal;