import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import { SIZES, COLOR } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';

import SelectFromScreen from '~/components/BasesComponents/SelectFromScreen';
import NumeicInput from '~/components/BasesComponents/NumeicInput';
import CustomDatePicker from '~/components/BasesComponents/CustomDatePicker';
import BarcodeInput from '~/components/AddOrEditMedicine/BarcodeInput';
// import SelectSuppliers from '~/components/common/Suppliers/SelectSuppliers';
import SelectProducers from '~/components/common/Producers';
import SelectMedTypes from '~/components/common/MedTypes';
import SelectGroupMedicines from '~/components/common/GroupMedicines';
import SelectPackages from '~/components/common/Packages';
import SelectUnits from '~/components/common/Units';
import Units from '~/components/AddOrEditMedicine/Units';
import Loading from '~/lib/RN-root-loading';
import Toast from '~/lib/RN-root-toast';
import _ from 'lodash';
import {
  formatNumber,
  getExtensionFile,
  getInfoFile,
  getLinkImg,
  convertPriceToString,
} from '~/utils/utils';
import UploadImage from '~/lib/UploadImage';
import { Form, FormItem, WrapFormItem, useForm } from '~/lib/RN-hook-form';
import Switch from '~/lib/Switch';
import { UPLOAD_IMAGE_SINGLE, IMAGE_PROJECT, IMAGE_SERVER_NEW } from '@env';
import Auth from '~/utils/Auth';
import { medicines } from '~/queryHooks';
import Text from '~/utils/StyledText';
import DiscountValue from '~/components/DiscountValue';
import tw from '~/lib/tailwind';

const AddOrEditService = ({ navigation, route }) => {
  // console.log({ superClusterClusters });
  const [form, setFormRef] = useForm();

  // useEffect(() => {
  //   form?.setValue('medicinesUnits', dataUnits);
  // }, [dataUnits, form]);

  // console.log({ dataMedicine });

  const onSubmit = async values => {
    // console.log({ data });
    Keyboard.dismiss();
    navigation.navigate({
      name: 'ListServiceClinicReceipt',
      params: {
        addMedicine: { id: '1', name: '2' },
      },
      merge: true,
    });
  };

  // if (dataMedicine?.id && !isReadyPage) {
  //   return (
  //     <View
  //       style={[
  //         styles.container,
  //         { alignItems: 'center', justifyContent: 'center' },
  //       ]}>
  //       <ActivityIndicator color={tw.color('THEME')} size={'large'} />
  //     </View>
  //   );
  // }

  // return null;
  return (
    <View style={tw`flex-1 bg-THEME pt-status-bar`}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backbtn}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon
            type="FontAwesome"
            name="angle-left"
            size={scale(24)}
            color={COLOR.BLACK}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm dịch vụ</Text>
        {/* <View style={styles.headerRight}>
          <TouchableOpacity onPress={form?.handleSubmit(onSubmit)}>
            <Text style={styles.saveTxt}>Lưu</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={styles.bodyPage}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Form ref={setFormRef} defaultValues={{}} style={tw`mt-2.5`}>
            <View style={[styles.section]}>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Loại dịch vụ</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name="types"
                    handleChange="onChange"
                    style={{ flex: 1 }}
                    // rules={{
                    //   required: {
                    //     value: true,
                    //     message: 'Vui lòng chọn loại dịch vụ',
                    //   },
                    // }}
                  >
                    <SelectMedTypes
                      placeholder="Chọn loại dịch vụ"
                      style={[styles.detailContent]}
                    />
                  </FormItem>
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Tên dịch vụ</Text>
                <FormItem
                  name="groupMedicines"
                  style={{ flex: 1 }}
                  handleChange="onChange">
                  <SelectGroupMedicines
                    placeholder="Chọn dịch vụ"
                    style={styles.detailContent}
                  />
                </FormItem>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Gói dịch vụ</Text>
                <FormItem
                  name="packages"
                  style={{ flex: 1 }}
                  handleChange="onChange">
                  <SelectPackages
                    placeholder="Chọn gói dịch vụ"
                    style={styles.detailContent}
                  />
                </FormItem>
              </View>

              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Bác sĩ</Text>
                <FormItem
                  name="producers"
                  style={{ flex: 1 }}
                  handleChange="onChange">
                  <SelectProducers
                    placeholder="Chọn bác sĩ"
                    style={styles.detailContent}
                  />
                </FormItem>
              </View>
            </View>

            <View style={styles.section}>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Đơn giá</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name="price"
                    style={styles.detailContent}
                    onChangeFormatter={convertPriceToString}
                    valueFormatter={formatNumber}
                    // rules={{
                    //   required: {
                    //     value: true,
                    //     message: 'Vui lòng nhập giá',
                    //   },
                    // }}
                  >
                    <TextInput
                      keyboardType="numeric"
                      selectTextOnFocus={true}
                      selectionColor={COLOR.READDING_MODE}
                    />
                  </FormItem>
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Số lượng</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name="quantitiesReceived"
                    style={styles.detailContent}
                    onChangeFormatter={convertPriceToString}
                    valueFormatter={formatNumber}
                    // rules={{
                    //   required: {
                    //     value: true,
                    //     message: 'Vui lòng nhập số lượng',
                    //   },
                    // }}
                  >
                    <NumeicInput />
                  </FormItem>
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Giảm giá</Text>
                <View style={tw`flex-1 flex-row`}>
                  <FormItem
                    name="discount"
                    style={styles.detailContent}
                    onChangeFormatter={convertPriceToString}
                    valueFormatter={formatNumber}>
                    <TextInput
                      keyboardType="numeric"
                      selectTextOnFocus={true}
                      selectionColor={COLOR.READDING_MODE}
                    />
                  </FormItem>

                  <DiscountValue />
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>VAT</Text>
                <View style={tw`flex-1 flex-row`}>
                  <FormItem
                    name="vat"
                    style={styles.detailContent}
                    onChangeFormatter={convertPriceToString}
                    valueFormatter={formatNumber}>
                    <TextInput
                      keyboardType="numeric"
                      selectTextOnFocus={true}
                      selectionColor={COLOR.READDING_MODE}
                    />
                  </FormItem>
                  <DiscountValue />
                </View>
              </View>
            </View>
          </Form>
        </ScrollView>
        <TouchableHighlight
          underlayColor={tw.color('gray-400')}
          onPress={form?.handleSubmit(onSubmit)}
          style={tw`w-full bg-THEME shadow-xl`}>
          <View
            style={tw`w-full items-center py-5 shadow-xl flex-row justify-between px-5`}>
            <Text style={tw`text-xl text-WHITE`}>
              Thành tiền: {formatNumber(30000)} Đ
            </Text>
            <Icon type="AntDesign" name="right" color="white" size={25} />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '20@s',
    paddingVertical: '6@vs',
  },
  backbtn: {
    width: '35@s',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
    // width: '70@s',
    // justifyContent: 'space-between',
  },
  saveTxt: {
    color: COLOR.THEME,
    fontSize: '14@s',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: '18@s',
    fontWeight: '500',
    flex: 1,
  },
  bodyPage: {
    flex: 1,
    backgroundColor: COLOR.BG,
  },

  section: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    paddingBottom: '10@vs',
    borderRadius: '15@s',
    marginBottom: '10@vs',
    width: '100%',
  },
  groupImage: {
    paddingVertical: '10@vs',
    paddingLeft: '15@vs',
  },
  sectionTitle: {
    fontWeight: '500',
    color: COLOR.ROOT_COLOR_SMOOTH,
    fontSize: '13@s',
    paddingLeft: '15@s',
    paddingVertical: '10@vs',
  },
  productDetailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    width: '100@s',
    fontSize: '13@s',
    marginRight: '15@s',
  },
  detailContent: {
    flex: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    paddingVertical: '10@vs',
  },
  detailContentTxt: {
    fontSize: '13@s',
    marginRight: '5@s',
  },
  txtThemeColor: {
    color: COLOR.THEME,
  },
  typeTxt: {
    fontSize: '14@s',
    fontWeight: '500',
  },
  description: {
    height: '50@vs',
  },
});

export default AddOrEditService;
