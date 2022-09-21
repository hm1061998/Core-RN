/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useRef,
  forwardRef,
  useEffect,
  useCallback,
} from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import Icon from '~/components/BasesComponents/Icon';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { COLOR } from '~/utils/Values';
import Button from '~/components/BasesComponents/Button';
import SelectFromScreen from '~/components/BasesComponents/SelectFromScreen';
import { Form, FormItem, useForm } from '~/lib/RN-hook-form';

const Options = ({ onChange, values = [], maxLength = 10 }) => {
  const [form, setFormRef] = useForm();
  const [list, setList] = useState(values);
  const index = useRef(-9999);

  useEffect(() => {
    const subscription = form?.watch((value, { name, type }) => {
      if (name) {
        const itemIndex = name?.substr(name.length - 1);
        const itemKey = name?.split('-').shift();
        const itemValue = value[name];

        const newList = values.map((item, index) => {
          if (Number(itemIndex) === index) {
            return {
              ...item,
              [itemKey]: itemValue,
            };
          }
          return item;
          // console.log({ itemIndex, itemKey, itemValue });
        });
        onChange(newList);
      }

      // console.log(value, name, type),
    });
    return () => subscription?.unsubscribe();
  }, [form, onChange, values]);

  // useEffect(() => {
  //   setList(values);
  // }, [values]);

  const handleSubmit = useCallback(form?.handleSubmit(() => {}));

  const addItem = () => {
    const checkValidate = values.find(item => !item.name || !item.propertiesId);
    if (checkValidate) {
      handleSubmit();
      return;
    }
    const newItem = {
      id: index.current,
    };

    const newList = [...values, newItem];
    // setList(newList);
    index.current += 1;
    onChange(newList);
  };

  const onDeleteItem = id => {
    const newList = values.filter(item => item.id !== id);
    // setList(newList);
    onChange(newList);
  };

  const handleDelete = id => {
    Alert.alert(
      'Xóa',
      'Bạn có chắc chắn KHÔNG muốn theo dõi thuộc tính của hàng hóa này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          style: 'destructive',
          onPress: () => {
            onDeleteItem(id);
          },
        },
      ],
    );
  };

  const defaultValues = {};
  values.map((item, index) => {
    defaultValues[`name-${index}`] = item.name;
    defaultValues[`propertiesId-${index}`] = item.propertiesId;
  });
  return (
    <Form ref={setFormRef} style={{ flex: 1 }} defaultValues={defaultValues}>
      <View
        style={[styles.list, values?.length === 0 && { borderBottomWidth: 0 }]}>
        {values?.map((item, index) => (
          <View style={styles.item} key={item.id}>
            <Button
              onPress={() => {
                handleDelete(item.id);
              }}>
              <Icon
                type="AntDesign"
                name="minuscircleo"
                size={scale(16)}
                color={COLOR.ROOT_COLOR_RED}
                style={{ marginRight: 8 }}
              />
            </Button>
            <View style={{ flex: 1 }}>
              <FormItem
                name={`propertiesId-${index}`}
                style={{ flex: 1 }}
                handleChange="onChange"
                rules={{
                  required: {
                    value: true,
                    message: 'Vui lòng nhập thông tin',
                  },
                }}>
                <SelectFromScreen
                  screenName="SelectProperties"
                  fieldName={`propertiesId-${index}`}
                  placeholder="Chọn thuộc tính"
                  style={styles.select}
                />
              </FormItem>
            </View>

            <View style={{ flex: 1 }}>
              <FormItem
                name={`name-${index}`}
                style={{ flex: 1 }}
                rules={{
                  required: {
                    value: true,
                    message: 'Vui lòng nhập thông tin',
                  },
                }}>
                <TextInput placeholder="Giá trị" style={styles.input} />
              </FormItem>
            </View>
          </View>
        ))}
      </View>
      {values.length < maxLength && (
        <Button style={[styles.container]} onPress={addItem}>
          <Icon
            type="AntDesign"
            name="pluscircleo"
            size={scale(16)}
            color={COLOR.THEME}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.label]}>Thêm thuộc tính</Text>
        </Button>
      )}
    </Form>
  );
};

const styles = ScaledSheet.create({
  container: {
    paddingVertical: '10@vs',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: '14@s',
    fontFamily: 'Roboto_medium',
    color: COLOR.THEME,
  },
  list: {
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginLeft: '10@s',
    width: '100@s',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.BLACK,
    height: '40@vs',
    paddingLeft: '5@s',
    fontSize: '13@s',
  },
  select: {
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.BLACK,
    height: '40@vs',
    paddingVertical: '10@vs',
    paddingLeft: '5@s',
  },
});

const Element = (props, ref) => {
  return <Options {...props} innerRef={ref} />;
};

export default forwardRef(Element);
