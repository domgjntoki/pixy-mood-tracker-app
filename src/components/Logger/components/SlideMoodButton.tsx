import { Dimensions, Platform, Pressable, useColorScheme, View, Text } from 'react-native';
import { Check } from 'react-native-feather';
import useHaptics from '@/hooks/useHaptics';
import { LogItem, RATING_EMOJI_MAPPING } from '@/hooks/useLogs';
import useScale from '@/hooks/useScale';
import { t } from "@/helpers/translation"; 

const SCREEN_HEIGHT = Dimensions.get('screen').height;


export const SlideMoodButton = ({
  rating, selected, onPress
}: {
  rating: LogItem['rating'];
  selected: boolean;
  onPress: () => void;
}) => {
  const haptics = useHaptics();
  const scale = useScale();
  const colorScheme = useColorScheme();

  const height = Math.max(80, SCREEN_HEIGHT * 0.58 / 7);
  const width = height * 3;

  return (
    <Pressable
      onPress={async () => {
        await haptics.selection();
        onPress();
      }}
      style={({ pressed }) => ({
        backgroundColor: scale.colors[rating].background,
        borderWidth: Platform.OS === 'android' && colorScheme === 'dark' ? 0 : 1,
        borderColor: colorScheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        marginBottom: 8,
        width,
        height,
        opacity: pressed ? 0.8 : 1,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <View style={{
        //flex: 1,
        alignItems: 'center',
        //justifyContent: 'center',
      }}>
        <Check
          color={selected ? scale.colors[rating].text : 'transparent'}
          width={24}
          height={24} />
         <Text style={{ fontSize: 24 }}>{RATING_EMOJI_MAPPING[rating]}</Text>

        <Text
          style={{
            color: scale.colors[rating].text,
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 2, // Pequeno espaçamento entre emoji e texto
            marginBottom: 20,
          }}
        >
          {t(`ratings.${rating}`)}
        </Text>
      </View>
    </Pressable>
  );
};
