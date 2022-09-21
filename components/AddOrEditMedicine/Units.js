import React, {
  useState,
  useRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from '~/components/BasesComponents/Icon';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import { COLOR } from '~/utils/Values';
import Button from '~/components/BasesComponents/Button';
import { Form, FormItem, useForm } from '~/lib/RN-hook-form';
import CustomPicker from '~/components/BasesComponents/CustomPicker';
import { formatNumber, convertPriceToString } from '~/utils/utils';

const Units = ({ onChange, values = [], maxLength = 10 }) => {
  // const [list, setList] = useState(values);
  const index = useRef(-9999);
  const [form, setFormRef] = useForm();

  useEffect(() => {
    const subscription = form?.watch((value, { name, type }) => {
      if (name) {
        const itemIndex = name?.substr(name.length - 1);
        const itemKey = name?.split('-').shift();
        const itemValue = value[name];

        const newList = values.map((item, _index) => {
          if (Number(itemIndex) === _index) {
            return {
              ...item,
              [itemKey]: itemValue,
            };
          }
          return item;
          // console.log({ itemIndex, itemKey, itemValue });
        });
        onChange(newList);
        // console.log({ newList });
      }

      // console.log(value, name, type),
    });
    return () => subscription?.unsubscribe();
  }, [form, onChange, values]);

  // console.log({ values });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSubmit = useCallback(form?.handleSubmit(() => {}));

  const addItem = () => {
    const checkValidate = values.find(item => !item.unitsId);
    // console.log({ checkValidate });
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

  const defaultValues = useMemo(() => {
    let obj = {};
    values?.map((item, index) => {
      obj[`unitsId-${index}`] = item.units?.value;
      obj[`coefficient-${index}`] = item.coefficient || 0;
      obj[`retailPrice-${index}`] = item.retailPrice || 0;
      obj[`wholesalePrice-${index}`] = item.wholesalePrice || 0;
    });
    return obj;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listUnits = useMemo(
    () => values?.map(item => item.units)?.filter(item => !!item) || [],
    [values],
  );

  // console.log({ defaultValues });
  return (
    <Form ref={setFormRef} style={{ flex: 1 }} defaultValues={defaultValues}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View
          style={[
            styles.list,
            values?.length === 0 && { borderBottomWidth: 0 },
          ]}>
          {values?.map((item, index) => (
            <View
              style={[
                styles.item,
                index === values.length - 1 && { borderBottomWidth: 0 },
              ]}
              key={`${item.id}`}>
              <View style={styles.itemRow}>
                <Button
                  disabled={Number(item.id) > 0}
                  onPress={() => {
                    Alert.alert(
                      'Xóa',
                      'Bạn có chắc chắn muốn xóa đơn vị tính này?',
                      [
                        { text: 'Hủy', style: 'cancel' },
                        {
                          text: 'Đồng ý',
                          style: 'destructive',
                          onPress: () => {
                            onDeleteItem(item.id);
                          },
                        },
                      ],
                    );
                  }}
                  style={{
                    top: verticalScale(10),
                    opacity: Number(item.id) > 0 ? 0.2 : 1,
                    marginRight: 8,
                  }}>
                  <Icon
                    type="AntDesign"
                    name="minuscircleo"
                    size={scale(16)}
                    color={COLOR.ROOT_COLOR_RED}
                  />
                </Button>
                <Text style={styles.labelItem}>Tên đơn vị tính</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name={`unitsId-${index}`}
                    style={{ flex: 1 }}
                    handleChange="onChange"
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng nhập thông tin',
                      },
                    }}>
                    {/* <TextInput placeholder="Tên đơn vị" style={[styles.input]} /> */}
                    <CustomPicker
                      disabled={Number(item.id) > 0}
                      data={listUnits}
                      placeholder="Chọn đơn vị"
                      containerStyle={[
                        styles.input,
                        {
                          justifyContent: 'center',
                        },
                      ]}
                    />
                  </FormItem>
                </View>
              </View>

              <View style={styles.itemRow}>
                <View
                  style={{
                    width: scale(16),
                    marginRight: 8,
                  }}
                />
                <Text style={styles.labelItem}>Tỉ lệ quy đổi</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name={`coefficient-${index}`}
                    style={{ flex: 1 }}
                    defaultValue="0"
                    onChangeFormatter={convertPriceToString}
                    valueFormatter={formatNumber}
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng nhập thông tin',
                      },
                    }}>
                    <TextInput
                      style={[styles.input]}
                      keyboardType="numeric"
                      selectTextOnFocus={true}
                      selectionColor={COLOR.READDING_MODE}
                      editable={Number(item.id) < 0}
                    />
                  </FormItem>
                </View>
              </View>
              <View style={styles.itemRow}>
                <View
                  style={{
                    width: scale(16),
                    marginRight: 8,
                  }}
                />
                <Text style={styles.labelItem}>Giá bán lẻ</Text>

                <View style={{ flex: 1 }}>
                  <FormItem
                    name={`retailPrice-${index}`}
                    style={{ flex: 1 }}
                    defaultValue="0"
                    onChangeFormatter={convertPriceToString}
                    valueFormatter={formatNumber}
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng nhập thông tin',
                      },
                    }}>
                    <TextInput
                      style={[styles.input]}
                      keyboardType="numeric"
                      selectTextOnFocus={true}
                      selectionColor={COLOR.READDING_MODE}
                    />
                  </FormItem>
                </View>
              </View>
              <View style={styles.itemRow}>
                <View
                  style={{
                    width: scale(16),
                    marginRight: 8,
                  }}
                />
                <Text style={[styles.labelItem, { borderBottomWidth: 0 }]}>
                  Giá bán sỉ
                </Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name={`wholesalePrice-${index}`}
                    style={{ flex: 1 }}
                    defaultValue="0"
                    onChangeFormatter={convertPriceToString}
                    valueFormatter={formatNumber}
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng nhập thông tin',
                      },
                    }}>
                    <TextInput
                      style={[styles.input, { borderBottomWidth: 0 }]}
                      keyboardType="numeric"
                      selectTextOnFocus={true}
                      selectionColor={COLOR.READDING_MODE}
                    />
                  </FormItem>
                </View>
              </View>
            </View>
          ))}
        </View>
        {listUnits.length > 0 && listUnits.length < maxLength && (
          <Button style={[styles.container]} onPress={addItem}>
            <Icon
              type="AntDesign"
              name="pluscircleo"
              size={scale(16)}
              color={COLOR.THEME}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.label]}>Thêm đơn vị</Text>
          </Button>
        )}
      </KeyboardAvoidingView>
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
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  itemRow: {
    flexDirection: 'row',
  },
  input: {
    marginLeft: '10@s',
    flex: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    height: '40@vs',
    paddingLeft: '5@s',
    fontSize: '13@s',
  },
  labelItem: {
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    // flex: 1,
    width: '150@s',
    height: '40@vs',
    paddingVertical: '10@vs',
    paddingLeft: '5@s',
  },
});

const Element = (props, ref) => {
  return <Units {...props} innerRef={ref} />;
};

export default forwardRef(Element);
