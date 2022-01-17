import { Text } from "react-native";
import useColors from "../hooks/useColors";

export default function MenuListHeadline({ children }) {
  const colors = useColors();
  
  return (
    <Text style={{
      fontSize: 14,
      textTransform: 'uppercase',
      color: colors.textInputText,
      padding: 0,
      borderRadius: 10,
      width: '100%',
      marginTop: 20,
      paddingLeft: 20,
      marginBottom: 5,
      opacity: 0.5,
    }}>
      {children}
    </Text>
  )
}