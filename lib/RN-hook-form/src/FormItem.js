import React, { cloneElement, Children } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const FormItem = ({
  name,
  children,
  renderLabel,
  valuePropsName,
  handleChange,
  shouldUnregister,
  rules,
  errorTextStyle,
  defaultValue,
  label,
  labelStyle,
  style,
  valueFormatter,
  onChangeFormatter,
  errorBorderColor,
}) => {
  const { control } = useFormContext();

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue,
    name,
    rules,
    shouldUnregister,
  });

  const _renderLabel = () => {
    if (renderLabel) {
      return renderLabel();
    }
    return label ? <Text style={labelStyle}>{label}</Text> : null;
  };
  // console.log(name, shouldUpdate);
  const renderFormItem = () => {
    return (
      <>
        <View
          style={[
            StyleSheet.flatten(style || {}),
            error && { borderColor: errorBorderColor },
          ]}>
          {_renderLabel()}
          {cloneElement(Children.only(children), {
            [valuePropsName]: valueFormatter(field.value),
            [handleChange]: e => {
              field.onChange(onChangeFormatter(e));
              children.props[handleChange]?.(onChangeFormatter(e));
            },
            ref: children.ref || field.ref,
          })}
        </View>
        {error ? (
          <Text style={[{ color: 'red', fontSize: 13 }, errorTextStyle]}>
            {error?.message}
          </Text>
        ) : null}
      </>
    );
  };

  return renderFormItem();
};

FormItem.defaultProps = {
  valuePropsName: 'value',
  handleChange: 'onChangeText',
  handeBlur: 'onBlur',
  errorBorderColor: '#f86168',
  shouldUnregister: true,
  valueFormatter: val => val,
  onChangeFormatter: val => val,
};
FormItem.propTypes = {
  name: PropTypes.string.isRequired,
  valuePropsName: PropTypes.string,
  handleChange: PropTypes.string,
  handeBlur: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  rules: PropTypes.object,
  renderLabel: PropTypes.func,
  valueFormatter: PropTypes.func,
  onChangeFormatter: PropTypes.func,
  errorBorderColor: PropTypes.string,
};

export default FormItem;
