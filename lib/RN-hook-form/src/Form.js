import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useForm, FormProvider } from 'react-hook-form';

const Form = ({ children, style, defaultValues, innerRef, ...otherProps }) => {
  const form = useForm({
    defaultValues,
    ...otherProps,
  });

  // console.log({ innerRef });
  const setValues = (value, val) => {
    if (typeof value === 'object') {
      for (const property in value) {
        form.setValue(property, value[property]);
      }
    } else if (typeof value === 'string') {
      form.setValue(value, val);
    }
  };

  const resetFields = (values, options) => {
    form.reset(values || defaultValues, options);
  };

  useImperativeHandle(innerRef, () => ({
    ...form,
    setValues,
    resetFields,
  }));

  return (
    <FormProvider {...form}>
      <View style={style}>{children}</View>
    </FormProvider>
  );
};

Form.defaultProps = {
  defaultValues: {},
};
Form.propTypes = {
  defaultValues: PropTypes.object,
};

const WrapForm = forwardRef((props, ref) => {
  return <Form {...props} innerRef={ref} />;
});
export default WrapForm;
