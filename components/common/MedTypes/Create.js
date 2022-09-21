import React, {
  useState,
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
import { Form, FormItem, useForm } from '~/lib/RN-hook-form';
import { suppliers } from '~/queryHooks';
import Loading from '~/lib/RN-root-loading';
import Toast from '~/lib/RN-root-toast';
import dayjs from 'dayjs';
import tw from '~/lib/tailwind';
import { RootSiblingParent } from 'react-native-root-siblings';
import ScreenAnimModal from '~/components/BasesComponents/ScreenAnimModal';
import { createFormPickerStyles as styles } from '~/utils/styles';

const CreateOrEditSuppliers = forwardRef((props, ref) => {
  // console.log({ superClusterClusters });
  const [visible, setVisible] = useState(false);
  const [form, setFormRef] = useForm();
  const modalRef = useRef();
  const create = suppliers.useAddData();
  const update = suppliers.useUpdateData();
  const [dataEditId, setDataEditId] = useState(null);
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
            {data?.id ? 'Sửa loại thuốc' : 'Thêm nhanh loại thuốc'}
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

                status: data?.status || 1,
              }}>
              <View style={[styles.section]}>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Tên loại thuốc</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="customersName"
                      style={styles.detailContent}
                      rules={{
                        required: {
                          value: true,
                          message: 'Vui lòng nhập thông tin',
                        },
                      }}>
                      <TextInput
                        placeholder="Tên loại thuốc"
                        // onSubmitEditing={() =>
                        //   form?.setFocus('customersCompanyName')
                        // }
                      />
                    </FormItem>
                  </View>
                </View>
              </View>
            </Form>
          </ScrollView>
        </View>
      </RootSiblingParent>
    </ScreenAnimModal>
  );
});

export default CreateOrEditSuppliers;
