import React, { useEffect, forwardRef } from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '~/components/BasesComponents/Icon';
import Button from '~/components/BasesComponents/Button';
import { COLOR } from '~/utils/Values';
import { scale } from 'react-native-size-matters';
import { useUpdateLayoutEffect } from '~/utils/hooks';

const SelectFromScreen = ({
  style,
  placeholder,
  placeholderStyle,
  value,
  fieldName,
  onChange,
  screenName,
  disabled,
  filterFields,
  onAffterChange,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  // console.log({ filterFields });

  useUpdateLayoutEffect(() => {
    // console.log(formStore);
    onChange?.(route.params?.[fieldName]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.[fieldName]]);

  useEffect(() => {
    onAffterChange?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.[fieldName]]);

  const onPress = () => {
    if (screenName) {
      navigation.navigate(screenName, {
        initialValue: value,
        previousScreen: route.name,
        fieldName,
        ...filterFields,
      });
    }
  };

  return (
    <Button disabled={disabled} onPress={onPress} style={style}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          opacity: disabled ? 0.5 : 1,
        }}>
        <Text style={placeholderStyle} numberOfLines={1}>
          {value?.name || placeholder}
        </Text>
        {!disabled && (
          <Icon
            type="FontAwesome"
            name="angle-right"
            size={scale(18)}
            color={COLOR.ROOT_COLOR_SMOOTH}
          />
        )}
      </View>
    </Button>
  );
};

const Element = (props, ref) => {
  return <SelectFromScreen {...props} innerRef={ref} />;
};
export default forwardRef(Element);
