import { primary_color, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import { updateImage } from '@/services/ImageService';
import { ratingOrder } from '@/services/OrderService';
import { toast } from '@/utils/toast';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

// Định nghĩa kiểu dữ liệu cho object quản lý từng bức ảnh
interface ImageItem {
    id: string;          // Khóa duy nhất để định danh (dùng timestamp hoặc local uri)
    previewUri: string;   // Dùng hiển thị ảnh local lập tức
    publicUrl: string | null;  // Lưu link do server trả về sau khi upload xong
    isUploading: boolean; // Trạng thái upload riêng của từng ảnh
}

const RatingOrderScreen = () => {
    const param: any = useLocalSearchParams();
    const navigation: any = useNavigation();
    let order = null;
    try {
        order = param.p_order ? JSON.parse(param.p_order) : {};
    } catch (e) {
        console.log("Error parsing p_order", e);
    }

    const [ratingQtyOrder, setRatingQtyOrder] = useState<number>(0);
    const [ratingQtyShipper, setRatingQtyShipper] = useState<number>(0);
    const [ratingNoteOrder, setRatingNoteOrder] = useState<string>("");
    const [ratingNoteShipper, setRatingNoteShipper] = useState<string>("");
    
    // --- KHAI BÁO STATE QUẢN LÝ MẢNG 3 ẢNH ---
    const [imagesList, setImagesList] = useState<ImageItem[]>([]); 
    const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

    // HÀM 1: CHỌN ẢNH VÀ TỰ ĐỘNG UPLOAD LÊN SERVER
    const selectAndUploadImage = async () => {
        // Kiểm tra nếu đã đủ 3 ảnh thì không cho chọn thêm
        if (imagesList.length >= 3) {
            Alert.alert("Thông báo", "Bạn chỉ được phép tải lên tối đa 3 hình ảnh!");
            return;
        }

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập thư viện ảnh!");
            return;
        }

        // Tính toán số lượng ảnh tối đa còn lại có thể chọn trong một lần bấm mở gallery
        const maxImagesLeft = 3 - imagesList.length;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images', 
            allowsEditing: maxImagesLeft === 1, // Chỉ bật cắt ảnh nếu chọn duy nhất 1 tấm cuối
            allowsMultipleSelection: true,     // Cho phép chọn nhiều ảnh cùng lúc
            selectionLimit: maxImagesLeft,      // Giới hạn số lượng chọn đúng bằng số slot còn trống
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            // Duyệt qua danh sách các file ảnh vừa được chọn từ Thư viện
            for (const asset of result.assets) {
                const imageId = asset.uri + Date.now(); // Tạo ID tạm thời không trùng lặp
                
                // 1. Tạo object ảnh mới với trạng thái ban đầu là đang upload
                const newImageItem: ImageItem = {
                    id: imageId,
                    previewUri: asset.uri,
                    publicUrl: null,
                    isUploading: true
                };

                // Thêm ảnh mới vào danh sách hiển thị lập tức dưới UI
                setImagesList(prev => [...prev, newImageItem]);

                // 2. Tiến hành đóng gói và upload độc lập tấm ảnh này
                const formData = new FormData();
                const fileUri = Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', '');
                
                formData.append('image', {
                    uri: fileUri,
                    type: asset.mimeType || 'image/jpeg',
                    name: asset.fileName || `upload_rating_${Date.now()}.jpg`,
                } as any);

                // Khởi chạy tiến trình gọi API song song
                updateImage(formData)
                    .then((response) => {
                        const responseData = response.data ? response.data : response;
                        if (responseData && responseData.image_url) {
                            // Cập nhật lại publicUrl cho riêng tấm ảnh này khi backend phản hồi thành công
                            setImagesList(currentList => 
                                currentList.map(img => 
                                    img.id === imageId 
                                        ? { ...img, publicUrl: responseData.image_url, isUploading: false } 
                                        : img
                                )
                            );
                        }
                    })
                    .catch((error) => {
                        console.error('Lỗi upload tấm ảnh:', error);
                        // Nếu lỗi, xóa ảnh đó khỏi danh sách hiển thị
                        setImagesList(currentList => currentList.filter(img => img.id !== imageId));
                        Alert.alert('Lỗi', 'Có tấm ảnh tải lên thất bại, vui lòng thử lại.');
                    });
            }
        }
    };

    // HÀM XÓA ẢNH KHI USER BẤM NÚT X
    const handleRemoveImage = (id: string) => {
        setImagesList(prev => prev.filter(img => img.id !== id));
    };

    // HÀM 2: GỬI ĐÁNH GIÁ
    const handleSubmit = async () => {
        if (ratingQtyOrder === 0 || ratingQtyShipper === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn số sao đánh giá!");
            return;
        }

        // Kiểm tra xem có tấm ảnh nào đang trong trạng thái upload dở dang hay không
        const hasImageUploading = imagesList.some(img => img.isUploading);
        if (hasImageUploading) {
            Alert.alert("Thông báo", "Vui lòng đợi tất cả hình ảnh được tải lên hoàn tất!");
            return;
        }

        setIsSubmittingForm(true);

        // Lọc và gom toàn bộ các link public URL thành một mảng chuỗi (Array of Strings) để gửi lên DB
        const finalImagesUrls = imagesList
            .map(img => img.publicUrl)
            .filter((url): url is string => url !== null);

        const requestBody = {
            id: order.id,
            rate_order: ratingQtyOrder,
            message_order: ratingNoteOrder,
            rate_shipper: ratingQtyShipper,
            message_shipper: ratingNoteShipper,
            // Gửi mảng chứa từ 0 đến tối đa 3 link ảnh (Ví dụ: ["https://...", "https://..."])
            images: finalImagesUrls 
        };

        try {
            const response: any = await ratingOrder(requestBody);
            if(response){
                toast("Cảm ơn bạn đã đánh giá");
                navigation.navigate("index")
            }
        } catch (error) {
            console.error('Lỗi gửi form đánh giá:', error);
            Alert.alert('Thất bại', 'Đã có lỗi xảy ra khi gửi đánh giá.');
        } finally {
            setIsSubmittingForm(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>VUI LÒNG CHO CHÚNG TÔI BIẾT CẢM NGHĨ CỦA BẠN</Text>
            </View>

            {/* ĐÁNH GIÁ ĐƠN HÀNG */}
            <View style={styles.box}>
                <Text style={styles.box_title}>Đánh giá đơn hàng</Text>
                <View style={styles.box_star}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesome
                            key={star}
                            name={ratingQtyOrder >= star ? "star" : "star-o"}
                            size={24}
                            color={ratingQtyOrder >= star ? primary_color : "black"}
                            onPress={() => setRatingQtyOrder(star)}
                        />
                    ))}
                </View>

                <TextInput 
                    style={styles.input} 
                    placeholder="Vui lòng viết đánh giá (tối đa 200 kí tự)" 
                    maxLength={200} 
                    value={ratingNoteOrder} 
                    onChangeText={(v) => setRatingNoteOrder(v)}
                /> 

                {/* KHU VỰC QUẢN LÝ DANH SÁCH HÌNH ẢNH */}
                <View style={styles.box_images}>
                    <Text style={styles.box_images_title}>Hình ảnh ({imagesList.length}/3): </Text>
                    
                    {/* Render vòng lặp danh sách ảnh đang có trong mảng State */}
                    {imagesList.map((item) => (
                        <View key={item.id} style={styles.imageWrapper}>
                            <Image source={{ uri: item.previewUri }} style={styles.previewImage} />
                            
                            {/* Nút Xóa ảnh (Chỉ cho xóa khi đã upload xong để tránh lỗi tiến trình) */}
                            {!item.isUploading && (
                                <Pressable style={styles.removeBtn} onPress={() => handleRemoveImage(item.id)}>
                                    <FontAwesome name="times-circle" size={18} color="red" />
                                </Pressable>
                            )}

                            {/* Loading xoay tròn riêng biệt trên từng tấm hình đang tải lên */}
                            {item.isUploading && (
                                <View style={styles.loadingOverlay}>
                                    <ActivityIndicator size="small" color="#fff" />
                                </View>
                            )}
                        </View>
                    ))}

                    {/* NÚT UP ẢNH: Sẽ ẩn đi hoàn toàn nếu danh sách đã đủ 3 ảnh */}
                    {imagesList.length < 3 && (
                        <Pressable style={styles.sendImage} onPress={selectAndUploadImage}>
                            <FontAwesome name="cloud-upload" size={24} color={primary_color} />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* ĐÁNH GIÁ SHIPPER */}
            <View style={styles.box}>
                <Text style={styles.box_title}>Đánh giá người giao hàng</Text>
                <View style={styles.box_star}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesome
                            key={star}
                            name={ratingQtyShipper >= star ? "star" : "star-o"}
                            size={24}
                            color={ratingQtyShipper >= star ? primary_color : "black"}
                            onPress={() => setRatingQtyShipper(star)}
                        />
                    ))}
                </View>
                <TextInput 
                    style={styles.input} 
                    placeholder="Vui lòng viết đánh giá (tối đa 200 kí tự)" 
                    maxLength={200} 
                    value={ratingNoteShipper} 
                    onChangeText={(v) => setRatingNoteShipper(v)}
                /> 
            </View>

            {/* NÚT GỬI ĐÁNH GIÁ */}
            <View style={styles.box}>
                <Text 
                    style={[styles.btn, (isSubmittingForm || imagesList.some(i => i.isUploading)) && { opacity: 0.5 }]} 
                    onPress={(!isSubmittingForm && !imagesList.some(i => i.isUploading)) ? handleSubmit : undefined}
                >
                    {isSubmittingForm ? "Đang gửi đánh giá..." : "Gửi đánh giá"}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
    box: { width: "100%", marginBottom: 20 },
    box_title: { fontSize: 14, fontFamily: SF_Pro_DISPLAY_BOLD, textAlign: "center" },
    box_star: { flexDirection: 'row', gap: 5, width: "100%", justifyContent: 'center', paddingVertical: 10 },
    input: { width: "80%", marginHorizontal: 'auto', borderColor: primary_color, borderStyle: 'dashed', borderWidth: 1, fontSize: 12, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 5 },
    btn: { borderWidth: 1, borderColor: primary_color, color: primary_color, paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 'auto', borderRadius: 5, fontFamily: SF_Pro_DISPLAY_BOLD, fontSize: 14, textAlign: 'center' },
    title: { fontFamily: SF_Pro_DISPLAY_BOLD, fontSize: 13, textAlign: 'center', padding: 10 },
    box_images: { width: "80%", marginHorizontal: 'auto', marginVertical: 10, minHeight: 80, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, padding: 8, flexDirection: "row", flexWrap: 'wrap', gap: 12, alignItems: "center" },
    box_images_title: { fontFamily: SF_Pro_DISPLAY_BOLD, fontSize: 13, width: '100%', marginBottom: 5 },
    sendImage: { borderStyle: "dashed", borderWidth: 1, borderColor: primary_color, width: 55, height: 55, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
    imageWrapper: { width: 55, height: 55, position: 'relative' },
    previewImage: { width: 55, height: 55, borderRadius: 5, resizeMode: 'cover' },
    loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
    removeBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: '#fff', borderRadius: 10, zIndex: 1 }
});

export default RatingOrderScreen;