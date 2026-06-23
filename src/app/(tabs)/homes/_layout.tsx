import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }} initialRouteName='index'>
      {/* Màn hình danh sách đơn */}
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      {/* Màn hình chi tiết đơn */}
      <Stack.Screen name="home" options={{ title: 'Trang chủ' }} />
      <Stack.Screen name="store" options={{ title: 'Cửa hàng' }} />
    
    </Stack>
  );
}