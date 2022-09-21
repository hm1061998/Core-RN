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
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import { SIZES, COLOR } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import Button from '~/components/BasesComponents/Button';
import SelectUnits from '~/components/common/Units';
import _ from 'lodash';
import { Form, FormItem, WrapFormItem, useForm } from '~/lib/RN-hook-form';
import Text from '~/utils/StyledText';
import tw from '~/lib/tailwind';
import { FlashList } from '@shopify/flash-list';
import { formatNumber } from '~/utils/utils';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Switch from '~/lib/Switch';
import { CommonActions } from '@react-navigation/native';

let row = [];
let prevOpenedRow;
const ListServiceClinicReceipt = ({ navigation, route }) => {
  const { dataId } = route.params || {};
  // console.log({ superClusterClusters });
  const [form, setFormRef] = useForm();

  useEffect(() => {
    navigation.dispatch(state => {
      // Remove the AddOrEditService route from the stack
      const routes = state.routes.filter(r => r.name !== 'AddOrEditService');

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
  }, [navigation]);

  const onSubmit = async values => {
    // console.log({ data });
    Keyboard.dismiss();
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      const closeRow = index => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
          prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
      };

      const renderRightActions = (_progress, _dragX) => {
        return (
          <View style={tw`flex-row`}>
            <Button
              style={tw`items-center justify-center w-13 bg-red-500 mb-1`}
              onPress={() => {
                Alert.alert(
                  'Xóa!',
                  'Bạn có chắc muốn xóa mặt hàng này khỏi phiếu?',
                  [
                    {
                      text: 'Hủy',
                      onPress: () => null,
                      style: 'cancel',
                    },
                    {
                      text: 'Xóa',
                      onPress: () => {},
                      style: 'default',
                    },
                  ],
                );
              }}>
              <Icon
                type="Feather"
                name="trash"
                size={scale(20)}
                color={COLOR.WHITE}
              />
            </Button>

            <Button
              style={tw`items-center justify-center w-13 bg-THEME mb-1`}
              onPress={() => {}}>
              <Icon
                type="MaterialIcons"
                name="mode-edit"
                size={scale(20)}
                color={COLOR.WHITE}
              />
            </Button>
          </View>
        );
      };
      return (
        <Swipeable
          renderRightActions={renderRightActions}
          onSwipeableOpen={() => closeRow(index)}
          ref={ref => (row[index] = ref)}
          rightOpenValue={-100}>
          <Button
            onPress={() =>
              navigation.navigate('AddOrEditService', {
                dataEdit: item,
              })
            }
            style={tw`bg-WHITE mb-1 px-5 py-2 flex-row justify-between`}>
            <View style={tw`flex-1`}>
              <Text>{item.name}</Text>
              <Text>x1 lượt</Text>
            </View>

            <Text>{formatNumber(item.price)}</Text>
          </Button>
        </Swipeable>
      );
    },
    [navigation],
  );

  const dataArr = [
    { id: '1', name: 'CHụp phổi', price: 1000000 },
    { id: '2', name: 'Khám mắt', price: 200000 },
  ];

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
        <Text style={styles.headerTitle}>Danh sách dịch vụ</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddOrEditService');
            }}>
            <Text style={styles.saveTxt}>Thêm</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bodyPage}>
        <KeyboardAvoidingView
          style={tw`flex-1`}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <FlashList
            data={dataArr}
            keyExtractor={item => item.id}
            estimatedItemSize={100}
            renderItem={renderItem}
            contentContainerStyle={tw`pt-1`}
          />
          <View style={[styles.section, { paddingTop: 10 }]}>
            <View
              style={[
                styles.row,
                { justifyContent: 'space-between', paddingVertical: 5 },
              ]}>
              <Text style={[styles.typeTxt]}>Tổng tiền</Text>
              <Text>{formatNumber(1000000)}</Text>
            </View>
            <View
              style={[
                styles.row,
                { justifyContent: 'space-between', paddingVertical: 5 },
              ]}>
              <Text style={[styles.typeTxt]}>Đã thanh toán</Text>
              <Text>{formatNumber(1000000)}</Text>
            </View>
            <View
              style={[
                styles.row,
                { justifyContent: 'space-between', paddingVertical: 5 },
              ]}>
              <Text style={[styles.typeTxt]}>Tiền khách đưa</Text>
              <TextInput
                keyboardType="numeric"
                selectTextOnFocus={true}
                selectionColor={COLOR.READDING_MODE}
                style={tw`flex-1 text-right border-b-07 border-b-gray-400 h-8`}
              />
            </View>
            <View
              style={[
                styles.row,
                { justifyContent: 'space-between', paddingVertical: 5 },
              ]}>
              <Text style={[styles.typeTxt]}>Tiền trả khách</Text>
              <Text>{formatNumber(1000000)}</Text>
            </View>
            <View
              style={[
                styles.row,
                {
                  justifyContent: 'space-between',
                  paddingTop: verticalScale(10),
                },
              ]}>
              <Text style={[styles.typeTxt]}>Thu tiền sau</Text>

              <Switch />
            </View>
          </View>
          <TouchableHighlight
            underlayColor={tw.color('gray-400')}
            onPress={() => {
              // navigation.navigate('AddOrEditService');
            }}
            style={tw`w-full bg-THEME shadow-xl`}>
            <View
              style={tw`w-full items-center pb-5 pt-3 shadow-xl justify-center px-5`}>
              <Text style={tw`text-xl text-WHITE`}>Lưu lại</Text>
            </View>
          </TouchableHighlight>
        </KeyboardAvoidingView>
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
    flex: 1,
  },
  description: {
    height: '50@vs',
  },
});

export default ListServiceClinicReceipt;
