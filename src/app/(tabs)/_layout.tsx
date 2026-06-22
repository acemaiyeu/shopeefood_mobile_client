import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { primary_color } from '@/constants/const';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Splash screen hiển thị trước khi vào tabs */}
      <AnimatedSplashOverlay />
      
      <Tabs screenOptions={{ 
        tabBarActiveTintColor: primary_color, 
        tabBarInactiveTintColor: '#999',
        headerShown: false, // Thường ẩn header ở đây để tự design header riêng
      }}
      >
        <Tabs.Screen 
          name="homes" 
          options={{ 
            title: 'Trang chủ',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
          }} 
        />
        <Tabs.Screen 
          name="my-orders" 
          options={{ 
            title: 'Đơn hàng',
            tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />
          }} 
        />
        <Tabs.Screen 
          name="accounts" 
          options={{ 
            title: 'Cá nhân',
            tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
          }} 
        />
      </Tabs>
    </ThemeProvider>
  );
}