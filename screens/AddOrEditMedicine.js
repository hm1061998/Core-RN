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
  Platform,
  KeyboardAvoidingView,
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

const AddOrEditMedicine = ({ navigation, route }) => {
  // console.log({ superClusterClusters });
  const [form, setFormRef] = useForm();
  const indexRef = useRef(-9999);
  const indexRef2 = useRef(-9999);
  const create = medicines.useAddData();
  const update = medicines.useUpdateData();
  const [dataUnits, setDataUnits] = useState([]);
  const uploadRef = useRef();
  const [dataPackagesUnits, setDataPackagesUnits] = useState([]);
  const [isReadyPage, setIsReadyPage] = useState(false);
  const { data, isLoading } = medicines.useInfo(
    {
      key: `medicines-${route.params?.productId}`,
      id: route?.params?.productId,
    },
    { enabled: !!route?.params?.productId },
  );

  const { dataMedicine } = route.params || {};

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      if (dataMedicine?.id) {
        getDataUnits();
      }
      setIsReadyPage(true);
    });
  }, [dataMedicine, getDataUnits]);

  // useEffect(() => {
  //   form?.setValue('medicinesUnits', dataUnits);
  // }, [dataUnits, form]);

  // console.log({ dataMedicine });

  const onSubmit = async values => {
    // console.log({ data });
    Keyboard.dismiss();
    navigation.navigate({
      name: 'CreateOrEditReceipt',
      params: {
        addMedicine: { id: '1', name: '2' },
      },
      merge: true,
    });
  };

  const configOption = {
    headers: {
      'x-auth-key': Auth.token,
      'x-auth-project': IMAGE_PROJECT,
    },
    method: 'POST',
  };

  const configUrl = UPLOAD_IMAGE_SINGLE;

  const getDataUnits = useCallback(() => {
    if (!dataMedicine) {
      setDataUnits([]);

      return;
    }
    const _dataPackagesUnits =
      dataMedicine?.medicinesUnits?.length > 0
        ? dataMedicine?.medicinesUnits
        : dataMedicine?.packagesUnits;

    const dataPackagesUnits0 = (_dataPackagesUnits || []).map(
      item => item.units?.id,
    );

    setDataPackagesUnits(dataPackagesUnits0);

    if (!dataPackagesUnits0 || dataPackagesUnits0.length === 0) {
      const newDataUnits = [
        {
          id: indexRef.current,
          unitsId: dataMedicine.unitsId,
          units: {
            value: dataMedicine.units?.id,
            label: dataMedicine.units?.name,
          },
          retailPrice: dataMedicine.retailPrice || 0,
          wholesalePrice: dataMedicine.wholesalePrice || 0,
          coefficient: '1',
        },
      ];

      setDataUnits(newDataUnits);
      indexRef.current += 1;
    } else {
      let unitDefault =
        _dataPackagesUnits.filter(
          item => item.unitsId === dataMedicine.unitsId,
        ) || [];
      unitDefault =
        (unitDefault?.length > 0 &&
          unitDefault.map(item => ({
            ...item,
            idcheck: item.id,
            coefficient:
              Number(item.coefficient) === Number(0)
                ? 1
                : Number(item.coefficient),
          }))) ||
        [];
      let medicinesUnits =
        _dataPackagesUnits.filter(
          item => item.unitsId !== dataMedicine.unitsId,
        ) || [];
      medicinesUnits =
        (medicinesUnits?.length > 0 &&
          medicinesUnits.map((item, index) => ({
            ...item,
            id:
              Number(item.id) === Number(0)
                ? indexRef2.current + index
                : Number(item.id),
            idcheck: item.id,
            coefficient:
              Number(item.coefficient) === Number(0)
                ? 1
                : Number(item.coefficient),
          }))) ||
        [];
      const dataUnitsItem1 = unitDefault.concat(medicinesUnits);
      let dataUnitsItem2 = [];
      let units = {};
      dataUnitsItem1.map(item => {
        units = { value: item.units?.id, label: item.units?.name };
        dataUnitsItem2 = [...dataUnitsItem2, { ...item, units }];
      });
      setDataUnits(dataUnitsItem2);

      indexRef2.current += 1;
    }
  }, [dataMedicine]);

  if (dataMedicine?.id && !isReadyPage) {
    return (
      <View
        style={[
          styles.container,
          { alignItems: 'center', justifyContent: 'center' },
        ]}>
        <ActivityIndicator color={tw.color('THEME')} size={'large'} />
      </View>
    );
  }

  const packagesUnits =
    dataMedicine?.packagesUnits?.length > 0 && dataMedicine.packagesUnits[0];
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
        <Text style={styles.headerTitle}>Thêm thuốc vào phiếu</Text>
        {/* <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              uploadRef.current.handleUpload();
            }}>
            <Text style={styles.saveTxt}>Lưu</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={styles.bodyPage}>
        <KeyboardAvoidingView
          style={tw`flex-1`}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <Form
              ref={setFormRef}
              defaultValues={{
                name: dataMedicine?.name || '',
                registrationNumber: dataMedicine?.registrationNumber || '',
                typesId: dataMedicine?.typesId,
                types: {
                  id: dataMedicine?.typesId,
                  name: dataMedicine?.types?.name,
                },
                groupMedicinesId: dataMedicine?.groupMedicinesId,
                groupMedicines: {
                  id: dataMedicine?.groupMedicinesId,
                  name: dataMedicine?.groupMedicines?.name,
                },
                packagesId: {
                  id: dataMedicine?.packagesId,
                  name: dataMedicine?.packages?.name,
                },
                packages: {
                  id: dataMedicine?.packagesId,
                  name: dataMedicine?.packages?.name,
                },
                activeElementName: dataMedicine?.activeElementName,
                concentrations: dataMedicine?.concentrations,
                standard: dataMedicine?.standard,
                producersId: {
                  id: dataMedicine?.producersId,
                  name: dataMedicine?.producers?.name,
                },

                producers: {
                  id: dataMedicine?.producersId,
                  name: dataMedicine?.producers?.name,
                },
                madeIn: dataMedicine?.madeIn,
                unitsId:
                  dataMedicine?.unitsId || packagesUnits?.unitsId || undefined,
                units: {
                  id:
                    dataMedicine?.unitsId ||
                    packagesUnits?.unitsId ||
                    undefined,
                  name: dataMedicine?.units?.name || packagesUnits?.name,
                },
                medicinesUnits: dataUnits,
                price: 0,
                vat: 0,
                discount: 0,
                quantitiesReceived: 1,
                manufacturingDate: new Date(),
                expiredDate: new Date(),
              }}>
              <View style={styles.groupImage}>
                <FormItem
                  name="images"
                  handleChange="onChange"
                  valuePropsName="values">
                  <UploadImage
                    ref={uploadRef}
                    mediaType="image"
                    maxLength={5}
                    configOption={configOption}
                    configUrl={configUrl}
                    // autoUpload={false}
                  />
                </FormItem>
              </View>
              <View style={[styles.section]}>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Tên thuốc</Text>
                  <FormItem name="name" style={styles.detailContent}>
                    <TextInput
                      placeholder="Tên thuốc"
                      editable={!dataMedicine?.id}
                    />
                  </FormItem>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Số đăng ký</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="registrationNumber"
                      style={styles.detailContent}
                      rules={{
                        required: {
                          value: true,
                          message: 'Vui lòng nhập số đăng ký',
                        },
                      }}>
                      <TextInput
                        placeholder="Số đăng ký"
                        editable={!dataMedicine?.id}
                      />
                    </FormItem>
                  </View>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Tiêu chuẩn</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem name="standard" style={styles.detailContent}>
                      <TextInput placeholder="Tiêu chuẩn" />
                    </FormItem>
                  </View>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Loại thuốc</Text>
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
                      <SelectMedTypes
                        placeholder="Chọn loại thuốc"
                        style={[styles.detailContent]}
                      />
                    </FormItem>
                  </View>
                </View>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Quy cách bào chế</Text>
                  <FormItem
                    name="groupMedicines"
                    style={{ flex: 1 }}
                    handleChange="onChange">
                    <SelectGroupMedicines
                      placeholder="Chọn quy cách bào chế"
                      style={styles.detailContent}
                    />
                  </FormItem>
                </View>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Quy cách đóng gói</Text>
                  <FormItem
                    name="packages"
                    style={{ flex: 1 }}
                    handleChange="onChange">
                    <SelectPackages
                      placeholder="Chọn quy cách đóng gói"
                      style={styles.detailContent}
                    />
                  </FormItem>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Nhà sản xuất</Text>
                  <FormItem
                    name="producers"
                    style={{ flex: 1 }}
                    handleChange="onChange">
                    <SelectProducers
                      placeholder="Chọn nhà sản xuất"
                      style={styles.detailContent}
                    />
                  </FormItem>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Quốc gia sản xuất</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem name="madeIn" style={styles.detailContent}>
                      <TextInput placeholder="Quốc gia sản xuất" />
                    </FormItem>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Mã vạch</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem name="bardcode" style={styles.detailContent}>
                      <TextInput placeholder="Mã vạch" />
                    </FormItem>
                  </View>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Số lô</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem name="lotNumber" style={styles.detailContent}>
                      <TextInput placeholder="Số lô" />
                    </FormItem>
                  </View>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Ngày sản xuất</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="manufacturingDate"
                      handleChange="onChange"
                      style={{ flex: 1 }}>
                      <CustomDatePicker
                        placeholder="Ngày sản xuất"
                        style={styles.detailContent}
                      />
                    </FormItem>
                  </View>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Hạn sử dụng</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="expiredDate"
                      handleChange="onChange"
                      style={{ flex: 1 }}>
                      <CustomDatePicker
                        placeholder="Hạn sử dụng"
                        style={styles.detailContent}
                      />
                    </FormItem>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Đơn vị cơ bản</Text>
                  <FormItem
                    name="units"
                    style={{ flex: 1 }}
                    handleChange="onChange">
                    <SelectUnits
                      placeholder="Chọn đơn vị cơ bản"
                      style={styles.detailContent}
                      // onChange={rec => {
                      //   console.log({ rec });
                      // }}
                    />
                  </FormItem>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Đơn vị nhập</Text>
                  <WrapFormItem shouldUpdate={['units']}>
                    {({ units }) => {
                      // console.log({ units });
                      const tdataUnits = dataUnits.map(item => item.unitsId);
                      const tdataUnitsObject = dataUnits.map(item => ({
                        id: item.unitsId,
                        name: item.units && item.units.label,
                      }));
                      return (
                        <FormItem
                          name="receiptsUnits"
                          style={{ flex: 1 }}
                          handleChange="onChange">
                          <SelectUnits
                            placeholder="Chọn đơn vị nhập"
                            dataPackagesUnits={tdataUnits}
                            dataPackagesUnitsObject={tdataUnitsObject}
                            style={styles.detailContent}
                          />
                        </FormItem>
                      );
                    }}
                  </WrapFormItem>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Giá nhập</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="price"
                      style={styles.detailContent}
                      onChangeFormatter={convertPriceToString}
                      valueFormatter={formatNumber}
                      rules={{
                        required: {
                          value: true,
                          message: 'Vui lòng nhập giá',
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
                  <Text style={[styles.detailLabel]}>Số lượng nhập</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="quantitiesReceived"
                      style={styles.detailContent}
                      onChangeFormatter={convertPriceToString}
                      valueFormatter={formatNumber}
                      rules={{
                        required: {
                          value: true,
                          message: 'Vui lòng nhập số lượng',
                        },
                      }}>
                      {/* <TextInput
                      keyboardType="numeric"
                      selectTextOnFocus={true}
                      selectionColor={COLOR.READDING_MODE}
                    /> */}
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

              <View style={[styles.section]}>
                <View
                  style={[
                    {
                      paddingVertical: verticalScale(10),
                    },
                  ]}>
                  <FormItem name="description">
                    <TextInput
                      placeholder="Hoạt chất - Hàm lượng"
                      multiline
                      style={styles.description}
                    />
                  </FormItem>
                </View>
              </View>

              <View style={styles.section}>
                <FormItem
                  name="medicinesUnits"
                  handleChange="onChange"
                  valuePropsName="values">
                  <Units />
                </FormItem>
              </View>
            </Form>
          </ScrollView>
        </KeyboardAvoidingView>
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

export default AddOrEditMedicine;
