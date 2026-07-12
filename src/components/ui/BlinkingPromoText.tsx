import { primary_color, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface PromoTextProps {
  title: string;
  promotions?: any[]; 
}

export default function BlinkingPromoText({ title, promotions = [] }: PromoTextProps) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const navigation: any = useNavigation();

  useEffect(() => {
    // Hiệu ứng nhấp nháy mượt mà
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 700 }), 
      -1, 
      true 
    );

    // Co giãn nhẹ tạo nhịp đập (Pulse)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        
        {/* Khối bên trái: Icon lửa nhấp nháy + Tên CTKM */}
        <Pressable style={styles.promoContent} onPress={() => navigation.navigate("promotion_list",{promotions: JSON.stringify(promotions), promotion: JSON.stringify(promotions[0])})}>
          <Animated.View style={[styles.badgeIcon, animatedStyle]}>
            <Text style={styles.iconText}>🔥</Text>
          </Animated.View>
          
          <Text style={styles.promoText} numberOfLines={1}>
            {title}
          </Text>
        </Pressable>

        {/* Khối bên phải: Nút Xem thêm (Chỉ hiện khi promotions > 1) */}
        {promotions.length > 1 && (
          <TouchableOpacity 
            style={styles.seeMoreButton} 
            onPress={() => navigation.navigate("promotion_list",{promotions: JSON.stringify(promotions)})} // Bỏ dấu gạch chéo đầu nếu dùng navigation của Native Stack
            activeOpacity={0.6}
          >
            <Text style={styles.seeMoreText}>Xem thêm ›</Text>
          </TouchableOpacity>
        )}
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 16, // Tạo khoảng cách với 2 bên mép màn hình điện thoại
    paddingVertical: 8,
  },
  container: {
    width: '100%',
    flexDirection: 'row', // Chuyển sang hàng ngang để quản lý diện tích tốt hơn
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFF5F5', // Nền hồng đỏ cực nhẹ giúp nổi bật text
    borderRadius: 12, // Bo góc mềm mại kiểu modern UI
    borderWidth: 1,
    borderColor: '#FFE0E0', // Viền mảnh tinh tế
    // Đổ bóng đổ khối cho Card (Dành cho iOS & Android)
    shadowColor: '#FF0033',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Chiếm trọn không gian bên trái
    marginRight: 12,
  },
  badgeIcon: {
    backgroundColor: '#FFDE00', // Nền vàng neon cho quả lửa
    padding: 5,
    borderRadius: 8,
    marginRight: 8,
  },
  iconText: {
    fontSize: 14,
  },
  promoText: {
    fontSize: 12, 
    color: '#D32F2F', // Màu đỏ đậm sang trọng, không bị bệt màu
    fontFamily: SF_Pro_DISPLAY_BOLD,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flex: 1,
  },
  seeMoreButton: {
    // backgroundColor: '#DN_THAY_THE_NEU_CAN', // Có thể để trong suốt hoặc thêm nền
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 10
  },
  seeMoreText: {
    fontSize: 10,
    color: primary_color, // Dùng màu chủ đạo của app bạn
    fontFamily: SF_Pro_DISPLAY_BOLD, // Đồng bộ font chữ thương hiệu
  },
});