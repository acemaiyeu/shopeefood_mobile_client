import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Màn hình danh sách đơn */}
      <Stack.Screen name="index" options={{ title: 'Cá nhân' }} />
      {/* Màn hình chi tiết đơn */}
      <Stack.Screen name="setting_dynamic" options={{ title: 'Cài đặt dynamic', header: () => null }} />
      <Stack.Screen name="address" options={{ title: 'Địa chỉ' }} />
      <Stack.Screen name="tos" options={{ title: 'Điều khoản dịch vụ' }} />
      <Stack.Screen name="drp" options={{ title: 'Tranh chấp, khiếu nại' }} />
      <Stack.Screen name="about" options={{ title: 'Thông tin về chúng tôi' }} />
    </Stack>
  );
}