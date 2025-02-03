import useColors from "@/hooks/useColors";
import useHaptics from "@/hooks/useHaptics";
import useScale from "@/hooks/useScale";
import { View, Text } from "react-native";
import ScaleButton from "./ScaleButton";
import { t } from "@/helpers/translation";

export const RatingAnswer = ({
  onPress
}: {
  onPress: (key: string) => void;
}) => {
  let { colors: scaleColors, labels } = useScale();
  const _labels = labels.slice().reverse();
  const haptics = useHaptics();
  const colors = useColors();

  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
          borderRadius: 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            paddingHorizontal: 12,
            backgroundColor: colors.logCardBackground,
            borderRadius: 12,
            paddingVertical: 8,
          }}
        >
          {Object.keys(scaleColors).reverse().map((key, index) => {
            return (
              <ScaleButton
                accessibilityLabel={_labels[index]}
                key={key}
                isFirst={index === 0}
                isLast={index === _labels.length - 1}
                onPress={async () => {
                  if (onPress) {
                    await haptics.selection();
                    onPress(key);
                  }
                }}
                backgroundColor={scaleColors[key].background}
                textColor={scaleColors[key].text} />
            );
          })}
        </View>
        <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 4,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  flex: 5,
                }}
              >{t('logger_mood_low')}</Text>
              <View style={{ flex: 5 }} />
              <View style={{ flex: 5 }} />
              <View style={{ flex: 5 }} />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  flex: 5,
                }}
              >{t('logger_mood_high')}</Text>
            </View>
          </View>
      </View>
    </View>
  );
};
