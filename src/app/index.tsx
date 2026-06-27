import { getItem } from '@/constants/const';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function SplashScreen() {
  const router = useRouter();
  const { login } = useSelector((state: any) => state.public);
  const [refreshing, setRefreshing] = useState(false);
  const isMounted = useRef(true);

  const checkAuthAndNavigate = useCallback(async () => {
    try {
      const [token] = await Promise.all([
        getItem('access_token'),
        delay(2000)
      ]);
      if (!isMounted.current) return;

      if (token) {
        router.replace('/(tabs)/homes');
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error("Lỗi SplashScreen:", error);
      if (!isMounted.current) return;
      router.replace('/(auth)/login');
    } finally {
      if (isMounted.current) {
        setRefreshing(false);
      }
    }
  }, [router, login]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkAuthAndNavigate();
  }, [checkAuthAndNavigate]);

  useEffect(() => {
    isMounted.current = true;
    checkAuthAndNavigate();

    return () => {
      isMounted.current = false;
    };
  }, [login, checkAuthAndNavigate]);
  useEffect(() => {
  },[login])

  return (
    <View style={styles.outerContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView
        // THAY ĐỔI 1: Ép Android luôn cho phép kéo tuột xuống
        overScrollMode="always" 
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        // Style của ScrollView phải cho phép co giãn flex: 1
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF4500']} // Màu mũi tên xoay bên trong vòng tròn (Android)
            tintColor="#ffffff"  // iOS
            progressBackgroundColor="#ffffff" // Màu nền của vòng tròn chứa mũi tên (Android)
          />
        }
      >
        {/* Ảnh nền phủ kín cấu trúc tuyệt đối */}
        <Image
          source={require('../../assets/images/logo3.jpg')}
          style={styles.logoAbsolute}
          resizeMode="cover"
        />

        {/* THAY ĐỔI 2: Tạo một View con ẩn dụ kích thước lớn hơn màn hình 1px để đánh lừa Android */}
        <View style={styles.androidTrigger} />

        {/* Vòng xoay mặc định ở đáy */}
        {!refreshing && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FF4500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Đảm bảo chiều cao tối thiểu bằng màn hình
    minHeight: SCREEN_HEIGHT, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidTrigger: {
    // Thao tác mấu chốt: Cao hơn màn hình 1 pixel giúp kích hoạt bộ scroll của hệ điều hành Android
    height: SCREEN_HEIGHT + 1, 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent', // Để suốt để không đè lên logo
  },
  logoAbsolute: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
    zIndex: 2,
  },
});