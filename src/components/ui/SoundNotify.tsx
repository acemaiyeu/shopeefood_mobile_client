import { useAudioPlayer } from 'expo-audio';
import { Text, View } from 'react-native';

const SoundNotify = () => {
   

    const player = useAudioPlayer(require('../../../assets/audio/notifi.mp3'));

    
    return (
        <View>
            <Text onPress={() => player.play()}>Test</Text>
        </View>
    )
};

export default SoundNotify;