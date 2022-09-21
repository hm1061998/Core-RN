import { forwardRef, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import Icon from '~/components/BasesComponents/Icon';
import Button from '~/components/BasesComponents/Button';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { COLOR } from '~/utils/Values';
import { useNavigation, useRoute } from '@react-navigation/native';

const BarcodeInput = (
  { placeholder, onChangeText, containerStyle, value, fieldName, ...props },
  ref,
) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { dataScanner } = route.params || {};

  useEffect(() => {
    if (dataScanner) {
      onChangeText?.(dataScanner);
      navigation.setParams({ dataScanner: null });
    }
  }, [dataScanner, navigation, onChangeText]);
  // console.log({ dataScanner });
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...props}
        ref={ref}
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={styles.inputStyle}
        value={value}
      />
      <Button
        onPress={() => {
          navigation.navigate('ScaneQRCode', {
            initialValue: value,
            previousScreen: route.name,
            fieldName,
          });
        }}>
        <Icon
          type="MaterialCommunityIcons"
          name="barcode-scan"
          size={scale(20)}
          color={COLOR.ROOT_COLOR_SMOOTH}
        />
      </Button>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    paddingVertical: '10@vs',
    justifyContent: 'space-between',
  },
  inputStyle: {
    flex: 1,
    fontSize: '13@s',
  },
});

export default forwardRef(BarcodeInput);
