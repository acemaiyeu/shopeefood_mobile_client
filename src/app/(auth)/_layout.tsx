import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }} initialRouteName='login'>
      {/* Màn hình chi tiết đơn */}
      <Stack.Screen name="login" options={{ title: 'Đăng nhập', header: () => null }}/>
      <Stack.Screen name="register" options={{ title: 'Đăng ký', header: () => null }}/>
      <Stack.Screen name="forgot_password" options={{ title: 'Quên mật khẩu', header: () => null }}/>
    
    </Stack>
  );
}