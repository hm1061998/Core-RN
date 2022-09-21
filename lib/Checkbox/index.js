import React from 'react';
import Icon from '~/components/BasesComponents/Icon';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const CheckBox = ({ onValueChange, value, containerStyle, disabled }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        if (onValueChange) {
          onValueChange(!value);
        }
      }}
      style={[styles.container, containerStyle, value && styles.checked]}>
      <Icon
        type="MaterialCommunityIcons"
        name="check"
        size={24}
        color="#FFFFFF"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 24,
    height: 24,
    borderWidth: 0.7,
    borderColor: '#C7CAD9',
    borderRadius: 2,
  },
  checked: {
    backgroundColor: '#2EB5BF',
    borderRadius: 4,
  },
});

CheckBox.defaultProps = {
  value: false,
  size: 24,
};

CheckBox.propTypes = {
  onValueChange: PropTypes.func,
  value: PropTypes.bool,
  containerStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

export default CheckBox;
