import React, { forwardRef } from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { COLOR } from '~/utils/Values';

const TextField = props => {
  const { errorText, value, style, inputStyle, innerRef, ...restOfProps } =
    props;

  let color = errorText ? '#B9C4CA' : '#B00020';

  return (
    <View style={style}>
      <TextInput
        ref={innerRef}
        {...restOfProps}
        style={[
          styles.input,
          {
            borderColor: color,
          },
          inputStyle,
        ]}
        value={value}
      />

      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
};

const styles = ScaledSheet.create({
  input: {
    paddingVertical: '10@vs',
    paddingHorizontal: 0,
    fontSize: '14@s',
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN,
  },

  error: {
    marginTop: '4@vs',
    marginLeft: '12@s',
    fontSize: '12@s',
    color: 'red',
  },
});

const AnimatedInput = forwardRef((props, ref) => (
  <TextField {...props} innerRef={ref} />
));

export default AnimatedInput;
