import { primary_color, SF_Pro, SF_Pro_DISPLAY_BOLD } from '@/constants/const';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
// Định nghĩa kiểu dữ liệu cho Props nhận vào
interface QRCodeCountdownProps {
  expiredAt: number | string | undefined | null;
  qr: string;
}

const QRCodeCountdown: React.FC<QRCodeCountdownProps> = ({ expiredAt, qr }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const viewShotRef = useRef<any>(null);
      
  
          const saveQR = async () => {
          const uri = await viewShotRef.current.capture();
  
          await Sharing.shareAsync(uri);
          }
  useEffect(() => {
    if (!expiredAt) {
      setTimeLeft('');
      return;
    }

    let timer: ReturnType<typeof setInterval>;

    const calculateTime = (): void => {
      const expiryTime: number = typeof expiredAt === 'number' 
        ? expiredAt * 1000 
        : new Date(expiredAt).getTime();
        
      const difference: number = expiryTime - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft('Mã QR đã hết hạn');
        if (timer) clearInterval(timer);
        return;
      }

      const minutes: number = Math.floor((difference / 1000 / 60) % 60);
      const seconds: number = Math.floor((difference / 1000) % 60);

      const strMinutes: string = String(minutes).padStart(2, '0');
      const strSeconds: string = String(seconds).padStart(2, '0');

      setTimeLeft(`${strMinutes}:${strSeconds}`);
    };

    calculateTime();
    timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [expiredAt]);

  if (!expiredAt) return null;

  return (
    <View style={styles.container}>
      {timeLeft === 'Mã QR đã hết hạn' ? (
        <View style={styles.qr_expired}>
          <View style={styles.qr_expired_modal}></View>
          <QRCode
                                                    value={qr}
                                                    size={220}
                                                />
          <Text style={styles.expiredText}>
            {timeLeft}
          </Text>
        </View>
      ) : (
        <View style={styles.qr_box}>
            <ViewShot  ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
                                                <QRCode
                                                    value={qr}
                                                    size={220}
                                                />
                                            </ViewShot>
                                            <View style={styles.timer}>
                                              <Text style={styles.timerText}>
          Thời gian còn lại: 
        </Text>
        <Text style={styles.timerValue}>{timeLeft}</Text>
                                              </View>
                                            <Text style={styles.download} onPress={() => saveQR()}>Tải về</Text>
                                            </View>
        
      )}
    </View>
  );
};

// Định nghĩa giao diện bằng StyleSheet thay vì CSS class thông thường
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  expiredText: {
    color: primary_color,
    fontWeight: 'bold',
    fontSize: 16,
    zIndex: 110,
    textAlign: 'center',
    padding: 10
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5
  },
  timerText: {
    color: '#333',
    fontSize: 16,
    fontFamily: SF_Pro
  },
  timerValue: {
    fontFamily: SF_Pro_DISPLAY_BOLD,
    color: primary_color,
    fontSize: 15,
    paddingTop: 2
  },
  qr_box: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    download: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: primary_color,
        paddingTop: 10
    },
    qr_expired: {
      position: 'relative'
    },
    qr_expired_modal: {
      width: 220,
      height: "100%",
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100,
      backgroundColor: "#cccccc41"
    }
});

export default QRCodeCountdown;
