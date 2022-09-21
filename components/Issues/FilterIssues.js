import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import { SIZES, COLOR } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import { Form, FormItem, useForm } from '~/lib/RN-hook-form';
import tw from '~/lib/tailwind';
import ScreenAnimModal from '~/components/BasesComponents/ScreenAnimModal';
import Button from '~/components/BasesComponents/Button';
import Text from '~/utils/StyledText';

const ListStatus = React.forwardRef(({ value = [], onChange, type }, ref) => {
  const onPress = id => {
    onChange?.(id);
  };

  const statusList = [
    { id: 'all', name: 'Tất cả' },
    { id: 1, name: 'Hoàn thành' },
    { id: -1, name: 'Đã hủy' },
    { id: 0, name: 'Phiếu tạm' },
  ];
  return (
    <View style={[styles.row]}>
      {statusList.map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onPress(item.id)}
          style={[styles.btnType, value === item.id && styles.backgroundTheme]}>
          <Text style={[styles.typeName, value === item.id && styles.txtWhite]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const FilterIssues = forwardRef(({ defaultValues, value, onChange }, ref) => {
  const [form, setFormRef] = useForm();
  const modalRef = useRef();
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () =>
      requestAnimationFrame(() => {
        setVisible(true);
      }),
    hide: () => {
      setVisible(false);
    },
  }));

  const onSubmit = data => {
    onChange?.(data);
  };

  return (
    <ScreenAnimModal
      ref={modalRef}
      visible={visible}
      onClose={() => setVisible(false)}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backbtn}
          onPress={() => {
            modalRef.current?.close();
          }}>
          <Icon
            type="FontAwesome"
            name="angle-left"
            size={scale(24)}
            color={COLOR.BLACK}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lọc phiếu bán</Text>
      </View>
      <View style={styles.bodyPage}>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <Form ref={setFormRef} defaultValues={defaultValues}>
            <Text style={styles.sectionTitle}>Theo</Text>
            <View style={[styles.section]}>
              <FormItem name="warehouseInOutCode">
                <TextInput
                  placeholder="Mã phiếu bán"
                  style={styles.textInput}
                />
              </FormItem>
              <FormItem name="productsCode">
                <TextInput placeholder="Mã hàng" style={styles.textInput} />
              </FormItem>
              <FormItem name="productsName">
                <TextInput placeholder="Tên hàng" style={styles.textInput} />
              </FormItem>
              <FormItem name="suppliersSearch">
                <TextInput
                  placeholder="Tên hoặc mã NCC"
                  style={styles.textInput}
                />
              </FormItem>
            </View>

            <Text style={styles.sectionTitle}>Trạng thái</Text>
            <View
              style={[
                styles.section,
                {
                  paddingVertical: verticalScale(10),
                },
              ]}>
              <FormItem
                name="status"
                handleChange="onChange"
                defaultValue={'all'}>
                <ListStatus />
              </FormItem>
            </View>
          </Form>
        </ScrollView>

        <View style={tw`flex-row px-5 bg-WHITE shadow-lg py-5`}>
          <Button
            style={tw`flex-1 border border-THEME items-center justify-center mr-3 rounded-lg py-3`}>
            <Text style={tw`text-THEME font-medium text-[16px]`}>
              Xóa bộ lọc
            </Text>
          </Button>
          <Button
            style={tw`flex-1 bg-THEME items-center justify-center rounded-lg py-3`}>
            <Text style={tw`text-WHITE font-medium text-[16px]`}>Áp dụng</Text>
          </Button>
        </View>
      </View>
    </ScreenAnimModal>
  );
});

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '10@vs',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  backgroundTheme: {
    backgroundColor: COLOR.THEME,
  },
  txtWhite: {
    color: COLOR.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '20@s',
    paddingVertical: '6@vs',
  },
  backbtn: {
    width: '40@s',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '18@s',
    fontWeight: '500',
    flex: 1,
  },
  submitText: {
    fontWeight: '500',
    fontSize: '17@s',
    color: COLOR.THEME,
  },
  bodyPage: {
    flex: 1,
    backgroundColor: COLOR.BG,
  },
  section: {
    backgroundColor: COLOR.WHITE,
    borderRadius: '15@s',
    width: '100%',
    paddingHorizontal: '15@s',
  },
  sectionTitle: {
    fontWeight: '500',
    fontSize: '13@s',
    marginVertical: '8@vs',
    paddingHorizontal: '15@s',
    color: COLOR.ROOT_COLOR_SMOOTH,
  },

  txtThemeColor: {
    color: COLOR.THEME,
  },

  btnType: {
    borderColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    borderWidth: 0.7,
    borderRadius: '24@s',
    paddingVertical: '5@vs',
    paddingHorizontal: '10@s',
    marginRight: '5@s',
    marginVertical: '4@vs',
  },
  typeName: {
    fontSize: '13@s',
    color: COLOR.ROOT_COLOR_SMOOTH,
  },
  label: {
    fontSize: '13@s',
  },
  textInput: {
    height: '40@vs',
    borderBottomWidth: 0.7,
    fontSize: '13@s',
    fontWeight: '500',
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    marginBottom: '10@vs',
  },
});

export default FilterIssues;
