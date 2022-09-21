import React, {
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { SIZES, COLOR } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import { Form, FormItem, useForm, WrapFormItem } from '~/lib/RN-hook-form';
import { suppliers } from '~/queryHooks';
import Loading from '~/lib/RN-root-loading';
import Toast from '~/lib/RN-root-toast';
import SelectFromScreen from '~/components/BasesComponents/SelectFromScreen';
import dayjs from 'dayjs';
import tw from '~/lib/tailwind';
import { RootSiblingParent } from 'react-native-root-siblings';
import ScreenAnimModal from '~/components/BasesComponents/ScreenAnimModal';
import { createFormPickerStyles as styles } from '~/utils/styles';

const CreateOrEditSuppliers = forwardRef((props, ref) => {
  // console.log({ superClusterClusters });
  const [visible, setVisible] = useState(false);
  const [form, setFormRef] = useForm();
  const create = suppliers.useAddData();
  const update = suppliers.useUpdateData();
  const [dataEditId, setDataEditId] = useState(null);

  const modalRef = useRef();
  const { data, isLoading } = suppliers.useInfo(
    {
      key: `suppliers-${dataEditId}`,
      id: dataEditId,
    },
    { enabled: !!dataEditId },
  );

  useImperativeHandle(ref, () => ({
    show: id => {
      setDataEditId(id);
      setVisible(true);
    },
    hide: () => {
      modalRef.current?.close();
    },
  }));

  // console.log({ data });

  const onSubmit = async values => {
    // console.log({ values });
    const params = {
      workUnitsId: '5',
      dateUpdated: dayjs(),
      ...values,
    };

    delete params.province;
    delete params.district;
    delete params.ward;

    params.wardsId = values.ward?.id;

    if (data?.id) {
      // return;
      const loading = Loading.show('Đang cập nhật nhà cung cấp');
      const res = await update.mutateAsync({ params, id: data.id });
      Loading.hide(loading);
      // console.log({ res });
      if (res?.success) {
        // navigation.goBack();
        modalRef.current?.close();
        Toast.show('Sửa nhà cung cấp thành công!', {
          duration: 1000,
          position: Toast.positions.CENTER,
        });
      } else {
        Toast.show(res?.error?.message || 'Đã xảy ra lỗi', {
          duration: 1000,
          position: Toast.positions.CENTER,
        });
      }
    } else {
      // return;
      const loading = Loading.show('Đang thêm nhà cung cấp');
      const res = await create.mutateAsync(params);
      Loading.hide(loading);
      // console.log({ res });
      if (res?.success) {
        modalRef.current?.close();
        Toast.show('Thêm nhà cung cấp thành công!', {
          duration: 1000,
          position: Toast.positions.CENTER,
        });
      } else {
        Toast.show(res?.error?.message || 'Đã xảy ra lỗi', {
          duration: 1000,
          position: Toast.positions.CENTER,
        });
      }
    }
  };

  if (dataEditId && isLoading) {
    return (
      <View
        style={[
          styles.container,
          { alignItems: 'center', justifyContent: 'center' },
        ]}>
        <ActivityIndicator color={'green'} size={'large'} />
      </View>
    );
  }

  return (
    <ScreenAnimModal
      ref={modalRef}
      visible={visible}
      onClose={() => setVisible(false)}>
      <RootSiblingParent>
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
          <Text style={styles.headerTitle}>
            {data?.id ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
          </Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={form?.handleSubmit(onSubmit)}>
              <Text style={styles.saveTxt}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bodyPage}>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <Form
              ref={setFormRef}
              defaultValues={{
                customersCode: data?.customersCode || '',
                customersName: data?.customersName || '',
                customersCompanyName: data?.customersCompanyName || '',
                mobile: data?.mobile || '',
                email: data?.email || '',
                address: data?.address || '',
                province: data?.id
                  ? {
                      id: data?.wards?.districts?.provinces?.id,
                      name: data?.wards?.districts?.provinces?.provinceName,
                    }
                  : null,
                district: data?.id
                  ? {
                      id: data?.wards?.districts?.id,
                      name: data?.wards?.districts?.districtName,
                    }
                  : null,
                ward: data?.id
                  ? { id: data?.wards?.id, name: data?.wards?.wardName }
                  : null,
                customersTaxNumber: data?.customersTaxNumber || '',
                customersOrSuplliers: data?.customersOrSuplliers || 1,
                note: data?.note || '',
                status: data?.status || 1,
              }}>
              <Text style={styles.label}>Thông tin nhà cung cấp</Text>
              <View style={[styles.section]}>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Mã NCC</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem name="customersCode" style={styles.detailContent}>
                      <TextInput
                        placeholder="Mã NCC tự động"
                        onSubmitEditing={() => form?.setFocus('customersName')}
                      />
                    </FormItem>
                  </View>
                </View>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Tên NCC</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="customersName"
                      style={styles.detailContent}
                      rules={{
                        required: {
                          value: true,
                          message: 'Vui lòng nhập tên NCC',
                        },
                      }}>
                      <TextInput
                        placeholder="Tên NCC"
                        onSubmitEditing={() =>
                          form?.setFocus('customersCompanyName')
                        }
                      />
                    </FormItem>
                  </View>
                </View>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Công ty</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="customersCompanyName"
                      style={styles.detailContent}>
                      <TextInput
                        placeholder="Công ty"
                        onSubmitEditing={() => form?.setFocus('mobile')}
                      />
                    </FormItem>
                  </View>
                </View>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Điện thoại</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem name="mobile" style={styles.detailContent}>
                      <TextInput
                        placeholder="Điện thoại"
                        onSubmitEditing={() => form?.setFocus('email')}
                      />
                    </FormItem>
                  </View>
                </View>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Email</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem name="email" style={styles.detailContent}>
                      <TextInput
                        placeholder="Email"
                        onSubmitEditing={() => form?.setFocus('address')}
                      />
                    </FormItem>
                  </View>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Địa chỉ</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem name="address" style={styles.detailContent}>
                      <TextInput
                        placeholder="Địa chỉ NCC"
                        onSubmitEditing={() => form?.setFocus('address')}
                      />
                    </FormItem>
                  </View>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Tỉnh/thành phố</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="province"
                      handleChange="onChange"
                      rules={{
                        required: {
                          value: true,
                          message: 'Bạn chưa chọn tỉnh/tp',
                        },
                      }}>
                      <SelectFromScreen
                        placeholder="Chọn tỉnh/tp"
                        screenName="SelectProvinces"
                        fieldName="province"
                        style={[styles.detailContent]}
                        onAffterChange={() => {
                          form?.setValues({
                            district: null,
                            ward: null,
                          });
                        }}
                      />
                    </FormItem>
                  </View>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Quận/huyện</Text>
                  <View style={{ flex: 1 }}>
                    <WrapFormItem shouldUpdate={['province']}>
                      {({ province }) => (
                        <FormItem
                          name="district"
                          handleChange="onChange"
                          rules={{
                            required: {
                              value: true,
                              message: 'Bạn chưa chọn quận/huyện',
                            },
                          }}>
                          <SelectFromScreen
                            placeholder="Chọn quận/huyện"
                            screenName="SelectDistricts"
                            fieldName="district"
                            style={[styles.detailContent]}
                            filterFields={{
                              provincesId: province?.id,
                            }}
                            disabled={!province?.id}
                            onAffterChange={() => {
                              form?.setValues({
                                ward: null,
                              });
                            }}
                          />
                        </FormItem>
                      )}
                    </WrapFormItem>
                  </View>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Xã/phường</Text>
                  <View style={{ flex: 1 }}>
                    <WrapFormItem shouldUpdate={['province', 'district']}>
                      {({ district }) => (
                        <FormItem
                          name="ward"
                          handleChange="onChange"
                          rules={{
                            required: {
                              value: true,
                              message: 'Bạn chưa chọn xã/phường',
                            },
                          }}>
                          <SelectFromScreen
                            placeholder="Chọn xã/phường"
                            screenName="SelectWards"
                            fieldName="ward"
                            style={[styles.detailContent]}
                            filterFields={{
                              districtsId: district?.id,
                            }}
                            disabled={!district?.id}
                          />
                        </FormItem>
                      )}
                    </WrapFormItem>
                  </View>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Mã số thuế</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="customersTaxNumber"
                      style={styles.detailContent}>
                      <TextInput placeholder="Mã số thuế" />
                    </FormItem>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <FormItem name="note" style={styles.detailContent}>
                  <TextInput
                    placeholder="Ghi chú"
                    onSubmitEditing={form?.handleSubmit(onSubmit)}
                  />
                </FormItem>
              </View>
            </Form>
          </ScrollView>
        </View>
      </RootSiblingParent>
    </ScreenAnimModal>
  );
});

export default CreateOrEditSuppliers;
