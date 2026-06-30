import { Asset } from 'expo-asset'; // Cài bằng: npx expo install expo-asset nếu chưa có
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';

export default function SoundNotify() {
    const {notification}  = useSelector((state: any) => state.public)
  const [playCount, setPlayCount] = useState(0);

  // 1. Thay vì import đầu file, ta dùng require trực tiếp ở đây. 
  // Hãy kiểm tra kỹ số lượng dấu "../" để trỏ đúng về thư mục assets từ vị trí file home.tsx
  const audioAsset = Asset.fromModule(require('../../../assets/audio/notifi.mp3'));
  
  // Lấy đường dẫn URI nội bộ mà Expo Go có thể đọc được
  const audioUrl = audioAsset.uri;

  const audioHtml = `
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <audio autoplay style="display:none;">
        <source src="${audioUrl}" type="audio/mp3">
      </audio>
      <script>
        var audio = document.querySelector('audio');
        audio.play().catch(function(error) {
          console.log("Lỗi phát audio:", error);
        });
      </script>
    </body>
    </html>
  `;

  const triggerNotificationSound = () => {
    setPlayCount(prev => prev + 1);
  };
  useEffect(() => {
    if(notification?.title){
        triggerNotificationSound()
    }
    
  },[notification])
  return (
    <View style={styles.container}>

      {/* WebView chạy ngầm */}
      {playCount > 0 && (
        <View style={styles.hiddenContainer} key={playCount}>
          <WebView
            source={{ html: audioHtml }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', position: 'absolute'},
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  button: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 30 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  hiddenContainer: { width: 0, height: 0, position: 'absolute', opacity: 0 },
});