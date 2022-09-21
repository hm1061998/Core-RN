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
import SelectUnits from '~/components/common/Units';
import _ from 'lodash';
import { Form, FormItem, WrapFormItem, useForm } from '~/lib/RN-hook-form';
import Text from '~/utils/StyledText';
import tw from '~/lib/tailwind';
import CustomDatePicker from '~/components/BasesComponents/CustomDatePicker';

const CreateOrEditClinicReceipt = ({ navigation, route }) => {
  const { dataId } = route.params || {};
  // console.log({ superClusterClusters });
  const [form, setFormRef] = useForm();

  const onSubmit = async values => {
    // console.log({ data });
    Keyboard.dismiss();
  };

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
        <Text style={styles.headerTitle}>
          {dataId ? 'Sửa phiếu thu dịch vụ' : 'Thêm phiếu thu dịch vụ'}
        </Text>
        {/* <View style={styles.headerRight}>
          <TouchableOpacity onPress={form?.handleSubmit(onSubmit)}>
            <Text style={styles.saveTxt}>Lưu</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={styles.bodyPage}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Form ref={setFormRef} defaultValues={{}}>
            <View style={[styles.section, { marginTop: 10 }]}>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Ngày tạo phiếu</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name="price"
                    style={{ flex: 1 }}
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng chọn ngày tạo phiếu',
                      },
                    }}>
                    <CustomDatePicker
                      style={styles.detailContent}
                      placeholder="Ngày tạo phiếu"
                    />
                  </FormItem>
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Số phiếu</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name="price"
                    style={styles.detailContent}
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng nhập số phiếu',
                      },
                    }}>
                    <TextInput editable={false} />
                  </FormItem>
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Số điện thoại</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name="price"
                    style={styles.detailContent}
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng nhập sdt',
                      },
                    }}>
                    <TextInput
                      keyboardType="numeric"
                      selectTextOnFocus={true}
                      selectionColor={COLOR.READDING_MODE}
                    />
                  </FormItem>
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Tên khách hàng</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name="price"
                    style={styles.detailContent}
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng nhập tên khách hàng',
                      },
                    }}>
                    <TextInput
                      selectTextOnFocus={true}
                      selectionColor={COLOR.READDING_MODE}
                    />
                  </FormItem>
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Ngày sinh</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name="birthday"
                    style={{ flex: 1 }}
                    handleChange="onChange"
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng chọn ngày sinh',
                      },
                    }}>
                    <CustomDatePicker
                      style={styles.detailContent}
                      placeholder="Ngày sinh"
                    />
                  </FormItem>
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Phương thức thanh toán</Text>
                <FormItem
                  name="units"
                  style={{ flex: 1 }}
                  handleChange="onChange">
                  <SelectUnits
                    placeholder="Chọn PTTT"
                    style={styles.detailContent}
                    // onChange={rec => {
                    //   console.log({ rec });
                    // }}
                  />
                </FormItem>
              </View>
            </View>

            <View style={[styles.section]}>
              <View
                style={[
                  {
                    paddingVertical: verticalScale(10),
                  },
                ]}>
                <FormItem name="description">
                  <TextInput
                    placeholder="Ghi chú"
                    multiline
                    style={styles.description}
                  />
                </FormItem>
              </View>
            </View>
          </Form>
        </ScrollView>
        <TouchableHighlight
          underlayColor={tw.color('gray-400')}
          onPress={() => {
            navigation.navigate('AddOrEditService');
          }}
          style={tw`w-full bg-THEME shadow-xl`}>
          <View
            style={tw`w-full items-center pb-5 pt-3 shadow-xl justify-center px-5`}>
            <Text style={tw`text-xl text-WHITE`}>Tiếp tục</Text>
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

export default CreateOrEditClinicReceipt;
