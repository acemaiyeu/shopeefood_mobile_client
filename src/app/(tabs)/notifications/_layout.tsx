import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Màn hình danh sách đơn */}
      <Stack.Screen name="index" options={{ title: 'Thông báo' }} />
      <Stack.Screen name="notifi_detail" options={{ title: 'Thông báo chi tiết' }} />
    </Stack>
  );
}