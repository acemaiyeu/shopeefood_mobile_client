import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const NoNetworkScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🌐</Text>
        <Text style={styles.title}>Mất kết nối mạng</Text>
        <Text style={styles.subtitle}>
          Vui lòng kiểm tra lại kết nối Wi-Fi hoặc dữ liệu di động của bạn.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default NoNetworkScreen;