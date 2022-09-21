import {
  TouchableOpacity,
  View,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';

const AndroidButton = ({ children, onPress, ...props }) => {
  return (
    <TouchableNativeFeedback {...props} onPress={onPress}>
      <View {...props}>{children}</View>
    </TouchableNativeFeedback>
  );
};

const Button = Platform.OS === 'android' ? AndroidButton : TouchableOpacity;

export default Button;
