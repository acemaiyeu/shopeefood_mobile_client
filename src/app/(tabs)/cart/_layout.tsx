import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Màn hình danh sách đơn */}
      <Stack.Screen name="index" options={{ title: 'Giỏ hàng' }} />
    
    </Stack>
  );
}