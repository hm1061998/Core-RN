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
import Switch from '~/lib/Switch';
import NumeicInput from '~/components/BasesComponents/NumeicInput';
import SelectUnits from '~/components/common/Units';
import Loading from '~/lib/RN-root-loading';
import Toast from '~/lib/RN-root-toast';
import _ from 'lodash';
import {
  formatNumber,
  getExtensionFile,
  convertPriceToString,
} from '~/utils/utils';
import { Form, FormItem, WrapFormItem, useForm } from '~/lib/RN-hook-form';
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

  const getListProductChild = ({
    listUnits = [],
    productsProperties = [],
    salePrice,
    quantity,
    importPrice,
    productsCode,
  }) => {
    let listPropertiesArr = [];

    const newData = productsProperties.map(pro => {
      const arr = listPropertiesArr.map(x => ({
        subName: `${x.subName} - ${pro.name}`,
        subProductsPropertiesId: `${x.subProductsPropertiesId}/${pro.id}`,
      }));
      if (arr?.length > 0) {
        return arr;
      }
      return {
        subName: pro.name,
        subProductsPropertiesId: pro.id,
      };
    });
    listPropertiesArr = [..._.flatten(newData)];

    const newListUnit = listUnits?.filter(x => x?.unitsName?.trim());

    // console.log({ newListUnit });

    let indexCode = 0;
    const dataAll = listPropertiesArr.map(item => {
      indexRef.current += 1;

      const defaultItem = {
        subName: item.subName,
        subProductsPropertiesId: item.subProductsPropertiesId?.toString(),
        productsCode:
          (productsCode &&
            (indexCode > 0 ? `${productsCode}-${indexCode}` : productsCode)) ||
          '',
        importPrice: importPrice || 0,
        salePrice: salePrice || 0,
        quantity: quantity || 0,
        id: indexRef.current,
      };
      // Ko c?? ????n v???
      if (newListUnit?.length === 0) {
        indexCode += 1;

        return defaultItem;
      }

      // C?? ????n v???
      const arr = newListUnit.map(unit => {
        const newItem = {
          ...defaultItem,
          unitsName: unit.unitsName,
          unitsId: unit.id,
          salePrice: unit.salePrice || defaultItem.salePrice,
          id: indexRef.current,
          productsCode:
            (productsCode &&
              (indexCode > 0
                ? `${productsCode}-${indexCode}`
                : productsCode)) ||
            '',
        };
        indexRef.current += 1;
        indexCode += 1;
        return newItem;
      });
      return arr;
    });
    const newDataAll = _.flatten(dataAll);
    // setData([...newDataAll]);

    // console.log({ newDataAll });
    return newDataAll;
  };

  const onSubmit = async values => {
    // console.log({ data });
    Keyboard.dismiss();
    const {
      brandsId,
      description,
      directSales,
      images,
      importPrice,
      listUnits,
      maxAmount,
      minAmount,
      noteTemplate,
      productGroupsId,
      productPlacementsId,
      productsCode,
      productsName,
      productsProperties,
      quantity,
      salePrice,
      status,
      weigh,
    } = values;

    const productChild = getListProductChild({
      listUnits,
      productsProperties,
      salePrice,
      quantity,
      importPrice,
      productsCode,
    });

    const newImages =
      (images?.length > 0 &&
        images
          .filter(item => item.status === 'done')
          .map(item => ({
            file: item.uri,
            extension: getExtensionFile(item.uri),
          }))) ||
      [];

    // Validate ????n v???
    let newProductsUnits = [];
    const listUnitsChild = listUnits?.filter(x => x.isCore === 0) || [];

    if (listUnitsChild?.length > 0) {
      const defaultUnit = listUnits?.find(x => x.isCore === 1) || {};
      if (!defaultUnit?.unitsName?.trim()) {
        Toast.show('B???n ch??a nh???p ????n v??? c?? b???n', {
          duration: 1500,
          position: Toast.positions.CENTER,
        });
        return;
      }
      let isCheckProductsUnits = true;
      let isSameProductCodeUnits = true;
      const arrCodeProductUnitsChild = [productsCode?.trim() || ''];
      newProductsUnits =
        listUnitsChild?.map(item => {
          if (isCheckProductsUnits && !item.unitsName?.trim()) {
            isCheckProductsUnits = false;

            Toast.show('B???n ch??a nh???p t??n ????n v???', {
              duration: 1500,
              position: Toast.positions.CENTER,
            });
          } else if (isCheckProductsUnits && !item.exchangeValue) {
            isCheckProductsUnits = false;

            Toast.show('Gi?? tr??? quy ?????i c???a thu???c t??nh ph???i l???n h??n > 0', {
              duration: 1500,
              position: Toast.positions.CENTER,
            });
          }
          // CHeck tr??ng m?? h??ng, check c??? vs m?? code cha (Ch??? check n???u ko c?? h??ng ho?? ph??n lo???i)
          if (
            newProductsProperties?.length === 0 &&
            isSameProductCodeUnits &&
            arrCodeProductUnitsChild.includes(item.productsCode)
          ) {
            isSameProductCodeUnits = false;
          } else {
            arrCodeProductUnitsChild.push(item.productsCode);
          }
          return {
            flag: 1,
            id: item.id,
            unitsName: item.unitsName?.trim(),
            directSales: Number(item.directSales),
            salePrice: item.salePrice || 0,
            exchangeValue: Number(item.exchangeValue),
            isCore: 0,
            productsCode:
              (newProductsProperties?.length === 0 && item.productsCode) || '',
          };
        }) || [];
      newProductsUnits = [
        {
          flag: 1,
          id: defaultUnit.id,
          unitsName: defaultUnit.unitsName?.trim(),
          directSales: Number(defaultUnit.directSales),
          exchangeValue: 0,
          isCore: 1,
          salePrice: defaultUnit.salePrice || 0,
        },
        ...newProductsUnits,
      ];
      if (!isCheckProductsUnits) {
        return;
      }
      if (!isSameProductCodeUnits) {
        Toast.show('M?? h??ng nh???p ??? ????n v??? t??nh b??? tr??ng', {
          duration: 1500,
          position: Toast.positions.CENTER,
        });
        return;
      }
    } else {
      newProductsUnits =
        listUnits
          ?.filter(x => x?.unitsName?.trim())
          ?.map(item => ({
            ...item,
            salePrice: salePrice || 0,
            exchangeValue: 0,
          })) || [];
    }

    // Validate m??  h??ng ho?? c??ng lo???i
    let isCheckProductChild = true;
    const arrCodeProductChild = [];
    const newProductChild =
      productChild?.map(item => {
        if (
          isCheckProductChild &&
          arrCodeProductChild.includes(item.productsCode)
        ) {
          isCheckProductChild = false;
        } else {
          arrCodeProductChild.push(item.productsCode);
        }

        return {
          flag: 1,
          id: item.id < 0 ? '0' : item.id,
          salePrice: item.salePrice || salePrice || 0,
          importPrice: item.importPrice || importPrice || 0,
          quantity: item.quantity || quantity || 0,
          subProductsPropertiesId: item.subProductsPropertiesId?.toString(),
          unitsId: item.unitsId,
          subName: `${item.subName} - ${item.unitsName}`,
          productsCode: item.productsCode,
        };
      }) || [];
    if (!isCheckProductChild) {
      Toast.show('M?? h??ng ho?? tr??ng nhau ??? danh s??ch h??ng ho?? c??ng lo???i', {
        duration: 1500,
        position: Toast.positions.CENTER,
      });
      return;
    }

    const newProductsProperties = productsProperties.map(item => ({
      id: item.id,
      name: item.name,
      flag: 1,
      propertiesId: item.propertiesId?.id,
    }));

    // return;

    const params = {
      workUnitsId: '5',
      brandsId: brandsId?.id,
      description,
      directSales: Number(directSales),
      images: newImages,
      importPrice,
      maxAmount,
      minAmount,
      noteTemplate,
      productGroupsId: productGroupsId?.id,
      productPlacementsId: productPlacementsId?.id,
      productsCode: productsCode?.trim(),
      productsName: productsName?.trim(),
      quantity,
      salePrice,
      status,
      weigh,
      productsCategories: 1,
      // insurance: [],
      // productIngredients: [],
    };

    if (!productGroupsId) {
      delete params.productGroupsId;
    }
    if (!brandsId) {
      delete params.brandsId;
    }
    if (!productPlacementsId) {
      delete params.productPlacementsId;
    }

    if (data?.id) {
      // console.log('edit');
      // Thu???c t??nh
      const oldProductproperties =
        data.productsProperties?.map(item => {
          const newItem = { ...item };
          delete newItem.propertiesName;
          return newItem;
        }) || [];

      const dataSuaproperties = _.intersectionBy(
        newProductsProperties,
        oldProductproperties,
        'id',
      );
      const dataXoaproperties = _.differenceBy(
        oldProductproperties,
        newProductsProperties,
        'id',
      );
      const dataThemproperties = _.differenceBy(
        newProductsProperties,
        dataSuaproperties,
        'id',
      );

      const dataProductproperties = [
        ...((dataXoaproperties.length > 0 &&
          dataXoaproperties.map(item => ({
            ...item,
            flag: -1,
          }))) ||
          []),
        ...((dataSuaproperties.length > 0 &&
          dataSuaproperties.map(item => ({
            ...item,
            flag: 1,
          }))) ||
          []),
        ...((dataThemproperties.length > 0 &&
          dataThemproperties.map(item => ({
            ...item,
            flag: 1,
          }))) ||
          []),
      ];
      // ????n v???
      const oldProductUnits = data.listUnits || [];

      const dataSuaProductUnit = _.intersectionBy(
        newProductsUnits,
        oldProductUnits,
        'id',
      );
      const dataXoaProductUnit = _.differenceBy(
        oldProductUnits,
        newProductsUnits,
        'id',
      );
      const dataThemProductUnit = _.differenceBy(
        newProductsUnits,
        dataSuaProductUnit,
        'id',
      );

      const dataProductProductUnit = [
        ...((dataXoaProductUnit.length > 0 &&
          dataXoaProductUnit.map(item => ({
            ...item,
            flag: -1,
          }))) ||
          []),
        ...((dataSuaProductUnit.length > 0 &&
          dataSuaProductUnit.map(item => ({
            ...item,
            flag: 1,
          }))) ||
          []),
        ...((dataThemProductUnit.length > 0 &&
          dataThemProductUnit.map(item => ({
            ...item,
            flag: 1,
          }))) ||
          []),
      ];

      const newParams = {
        ...params,
        productsProperties: dataProductproperties,
        listUnits: dataProductProductUnit,
      };
      // console.log({ newParams });
      const spinner = Loading.show('??ang c???p nh???t h??ng h??a');
      const res = await update.mutateAsync({ params: newParams, id: data?.id });
      Loading.hide(spinner);
      if (res?.success) {
        Toast.show('C???p nh???t h??ng h??a th??nh c??ng!', {
          duration: 1500,
          position: Toast.positions.CENTER,
        });
        navigation.goBack();
      } else {
        Toast.show(res?.error?.message || '???? x???y ra l???i', {
          duration: 1500,
          position: Toast.positions.CENTER,
        });
      }
    } else {
      // console.log('add');
      const spinner = Loading.show('??ang th??m h??ng h??a');
      const res = await create.mutateAsync({
        ...params,
        productsProperties: newProductsProperties,
        listUnits: newProductsUnits,
        productChild: newProductChild,
      });
      // console.log({ res });
      Loading.hide(spinner);
      if (res?.success) {
        Toast.show('Th??m h??ng h??a th??nh c??ng!', {
          duration: 1500,
          position: Toast.positions.CENTER,
        });
        navigation.goBack();
      } else {
        Toast.show(res?.error?.message || '???? x???y ra l???i', {
          duration: 1500,
          position: Toast.positions.CENTER,
        });
      }
    }
  };

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
        <Text style={styles.headerTitle}>Th??m thu???c v??o phi???u</Text>
        {/* <View style={styles.headerRight}>
          <TouchableOpacity onPress={form?.handleSubmit(onSubmit)}>
            <Text style={styles.saveTxt}>L??u</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={styles.bodyPage}>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <Form ref={setFormRef} defaultValues={{}}>
              <View style={[styles.section, { marginTop: 10 }]}>
                <Text>Thu???c ch???a ho T/H</Text>
                <View style={tw`flex-row`}>
                  <Text>T???n kho: </Text>
                  <Text>1 (Chai)</Text>
                </View>
                <View style={tw`flex-row`}>
                  <Text>Nh?? s???n xu???t: </Text>
                  <Text>C??ng ty CP D?????c VTYT Thanh H??a</Text>
                </View>
                <View style={tw`flex-row`}>
                  <Text>Xu???t s???: </Text>
                  <Text>US</Text>
                </View>
              </View>

              <View style={styles.section}>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>????n v??? t??nh</Text>
                  <FormItem
                    name="units"
                    style={{ flex: 1 }}
                    handleChange="onChange">
                    <SelectUnits
                      placeholder="Ch???n ????n v??? t??nh"
                      style={styles.detailContent}
                      // onChange={rec => {
                      //   console.log({ rec });
                      // }}
                    />
                  </FormItem>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Gi??</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="price"
                      style={styles.detailContent}
                      onChangeFormatter={convertPriceToString}
                      valueFormatter={formatNumber}
                      rules={{
                        required: {
                          value: true,
                          message: 'Vui l??ng nh???p gi??',
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
                  <Text style={[styles.detailLabel]}>S??? l?????ng</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="quantitiesReceived"
                      style={styles.detailContent}
                      onChangeFormatter={convertPriceToString}
                      valueFormatter={formatNumber}
                      rules={{
                        required: {
                          value: true,
                          message: 'Vui l??ng nh???p s??? l?????ng',
                        },
                      }}>
                      <NumeicInput />
                    </FormItem>
                  </View>
                </View>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Gi???m gi??</Text>
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

              <View style={styles.section}>
                <View
                  style={[
                    styles.row,
                    {
                      justifyContent: 'space-between',
                      paddingTop: verticalScale(10),
                    },
                  ]}>
                  <Text style={[styles.typeTxt]}>B??n l???</Text>
                  <FormItem name="directSales" handleChange="onChange">
                    <Switch />
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
                      placeholder="C??ch s??? d???ng/S??? l?????ng/u???ng"
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
            onPress={() => {}}
            style={tw`w-full bg-THEME shadow-xl`}>
            <View
              style={tw`w-full items-center py-5 shadow-xl flex-row justify-between px-5`}>
              <Text style={tw`text-xl text-WHITE`}>
                Th??nh ti???n: {formatNumber(30000)} ??
              </Text>
              <Icon type="AntDesign" name="right" color="white" size={25} />
            </View>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
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
