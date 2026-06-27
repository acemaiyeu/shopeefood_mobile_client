// import { Stack, useRouter, useSegments } from 'expo-router';
// import { useEffect } from 'react';

// export default function RootLayout() {
//   const isLogin = false; // Trạng thái đăng nhập thực tế của bạn
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => {
//     // Kiểm tra xem người dùng hiện tại có đang nằm trong thư mục (auth) không
//     const inAuthGroup = segments[0] === '(auth)';

//     if (!isLogin && !inAuthGroup) {
//       // Nếu CHƯA đăng nhập và KHÔNG ở cụm auth -> Mới ép về login
//       router.replace('/(auth)/login');
//     } else if (isLogin && inAuthGroup) {
//       // Nếu ĐÃ đăng nhập mà lại đi lạc vào cụm auth -> Đẩy vào trang chủ bên trong tabs
//       router.replace('/(tabs)/homes');
//     }
//   }, [isLogin, segments]);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" />
//       <Stack.Screen name="(auth)" />
//     </Stack>
//   );
// }

import SoundNotify from '@/components/ui/SoundNotify';
import { store } from '@/store/store';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

export default function RootLayout() {
  return (
    <Provider store={store}>
       
        <Stack screenOptions={{ headerShown: false }}>
        {/* File index ngoài cùng sẽ mặc định chạy trước */}
        <Stack.Screen name="index" /> 
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <SoundNotify />
        </Stack>
        <Toast /> 
    </Provider>
  );
}