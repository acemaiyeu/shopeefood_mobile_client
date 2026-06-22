import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Màn hình danh sách đơn */}
      <Stack.Screen name="index" options={{ title: 'Cá nhân' }} />
      {/* Màn hình chi tiết đơn */}
      <Stack.Screen name="info" options={{ title: 'Thông tin tài khoản' }} />
      <Stack.Screen name="address" options={{ title: 'Địa chỉ' }} />
      <Stack.Screen name="password" options={{ title: 'Mật khẩu' }} />
      <Stack.Screen name="tos" options={{ title: 'Điều khoản dịch vụ' }} />
      <Stack.Screen name="drp" options={{ title: 'Tranh chấp, khiếu nại' }} />
      <Stack.Screen name="about" options={{ title: 'Thông tin về chúng tôi' }} />
    </Stack>
  );
}