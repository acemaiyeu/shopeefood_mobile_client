import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Màn hình danh sách đơn */}
      <Stack.Screen name="index" options={{ title: 'Đơn hàng của tôi' }} />
      {/* Màn hình chi tiết đơn */}
      <Stack.Screen name="detail" options={{ title: 'Chi tiết đơn hàng' }} />
    </Stack>
  );
}