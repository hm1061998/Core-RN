import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import Text from '~/utils/StyledText';
import tw from '~/lib/tailwind';
import Icon from '~/components/BasesComponents/Icon';
import { Form, FormItem, WrapFormItem, useForm } from '~/lib/RN-hook-form';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import { COLOR, SIZES } from '~/utils/Values';
import Switch from '~/lib/Switch';
import SelectProducers from '~/components/common/Producers';
import { formatNumber } from '~/utils/utils';

const ConfirmReceipt = ({ navigation }) => {
  const [form, setFormRef] = useForm();
  return (
    <View style={tw`flex-1 bg-THEME pt-status-bar`}>
      <View
        style={tw`flex-row items-center justify-between bg-WHITE px-5 py-2`}>
        <TouchableOpacity
          style={tw`w-8 items-start`}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon
            type="FontAwesome"
            name="angle-left"
            size={24}
            color={tw.color('BLACK')}
          />
        </TouchableOpacity>
        <Text style={tw`text-[18px] flex-1`}>Xác nhận thanh toán</Text>
        {/* <View style={styles.headerRight}>
          <TouchableOpacity onPress={form?.handleSubmit(onSubmit)}>
            <Text style={styles.saveTxt}>Lưu</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={tw`flex-1 bg-BG pt-2.5`}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Form ref={setFormRef} defaultValues={{}}>
            <View style={[styles.section]}>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Mã phiếu</Text>
                <View style={{ flex: 1 }}>
                  <FormItem name="standard" style={styles.detailContent}>
                    <TextInput placeholder="Mã phiếu" />
                  </FormItem>
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Số hóa đơn</Text>
                <View style={{ flex: 1 }}>
                  <FormItem name="standard" style={styles.detailContent}>
                    <TextInput placeholder="Số hóa đơn" />
                  </FormItem>
                </View>
              </View>

              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Giao hàng</Text>
                <View style={{ flex: 1 }}>
                  <FormItem name="standard" style={styles.detailContent}>
                    <TextInput placeholder="Giao hàng" />
                  </FormItem>
                </View>
              </View>

              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Phương thức thanh toán</Text>
                <View style={{ flex: 1 }}>
                  <FormItem
                    name="types"
                    handleChange="onChange"
                    style={{ flex: 1 }}
                    rules={{
                      required: {
                        value: true,
                        message: 'Vui lòng chọn loại thuốc',
                      },
                    }}>
                    <SelectProducers
                      placeholder="Chọn PTTT"
                      style={[styles.detailContent]}
                    />
                  </FormItem>
                </View>
              </View>
              <View style={[styles.row, styles.productDetailItem]}>
                <Text style={[styles.detailLabel]}>Nhà cung cấp</Text>
                <FormItem
                  name="groupMedicines"
                  style={{ flex: 1 }}
                  handleChange="onChange">
                  <SelectProducers
                    placeholder="Chọn nhà cung cấp"
                    style={styles.detailContent}
                  />
                </FormItem>
              </View>
            </View>

            <View style={styles.section}>
              <View
                style={[
                  styles.row,
                  {
                    justifyContent: 'space-between',
                    paddingTop: verticalScale(10),
                  },
                ]}>
                <Text style={[styles.typeTxt]}>Công nợ</Text>
                <FormItem name="directSales" handleChange="onChange">
                  <Switch />
                </FormItem>
              </View>
            </View>

            <View style={tw`bg-WHITE px-5 pb-2.5 rounded-lg mb-2.5 w-full`}>
              <View style={tw`py-2.5`}>
                <FormItem name="description">
                  <TextInput
                    placeholder="Ghi chú"
                    multiline
                    style={tw`h-[50px]`}
                  />
                </FormItem>
              </View>
            </View>
          </Form>
        </ScrollView>
        <TouchableHighlight
          underlayColor={tw.color('gray-400')}
          onPress={() => {}}
          style={tw`w-full bg-THEME shadow-xl`}>
          <View
            style={tw`w-full items-center py-5 shadow-xl flex-row justify-between px-5`}>
            <Text style={tw`text-sm text-WHITE`}>
              Thành tiền: {formatNumber(30000)} Đ
            </Text>
            <View style={tw`flex-row`}>
              <Text style={tw`text-sm text-WHITE mr-4`}>Lưu lại</Text>
              <Icon type="AntDesign" name="right" color="white" size={20} />
            </View>
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
export default ConfirmReceipt;
