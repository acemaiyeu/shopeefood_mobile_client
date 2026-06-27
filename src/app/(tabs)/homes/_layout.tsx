import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
      <Stack screenOptions={{ headerShown: true }} initialRouteName='home'>
        {/* Màn hình chi tiết đơn */}
        <Stack.Screen name="home" options={{ title: 'Trang chủ' }} />
        <Stack.Screen name="store" options={{ title: 'Cửa hàng' }} />
        <Stack.Screen name="product_detail" options={{ title: 'Thông tin sản phẩm' }} />
      </Stack>
  );
}