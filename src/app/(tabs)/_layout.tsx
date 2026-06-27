import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react'; // Cần thêm useEffect
import { useColorScheme } from 'react-native';
import { Provider, useSelector } from 'react-redux';
// Thay đổi import toast ở đây

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import WebSocketProvider from '@/store/socket/WebSocketProvider';
import { store } from '@/store/store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {total_cart} = useSelector((state: any) => state.public)
  const [loaded, error] = useFonts({
    [SF_Pro]: require('../../../assets/fonts/SF-Pro.ttf'),
    [SF_Pro_DISPLAY_BOLD]: require('../../../assets/fonts/SF-Pro-Display-Bold.otf'),
    
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync(); // Ẩn splash screen sau khi font load xong
    }
  }, [loaded, error]);

  if (!loaded && !error) return null; // Tránh render khi font chưa sẵn sàng

  return (
    <Provider store={store}>
      <WebSocketProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        
        <Tabs screenOptions={{ 
          tabBarActiveTintColor: primary_color, 
          tabBarInactiveTintColor: '#999',
          headerShown: false,
        }}>
          <Tabs.Screen name="homes" options={{ title: 'Trang chủ', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
          <Tabs.Screen 
              name="cart" 
              options={{ 
                title: 'Giỏ hàng', 
                tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
                tabBarBadge: total_cart > 0 ? total_cart : undefined, // Ẩn badge nếu giỏ hàng trống
                tabBarBadgeStyle: { backgroundColor: 'red', color: 'white' } // Tùy chỉnh màu sắc nếu muốn
              }} 
            />
          <Tabs.Screen name="my-orders" options={{ title: 'Đơn hàng', tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }} />
          <Tabs.Screen name="accounts" options={{ title: 'Cá nhân', tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
        </Tabs>

        {/* Cần đặt Toast ở cuối cùng để nó hiển thị đè lên trên cùng */}
        
      </ThemeProvider>
      </WebSocketProvider>
    </Provider>
  );
}