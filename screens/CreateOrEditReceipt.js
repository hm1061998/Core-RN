import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  Alert,
  TextInput,
} from 'react-native';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import { SIZES, COLOR } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import Button from '~/components/BasesComponents/Button';
import { formatNumber, convertPriceToString } from '~/utils/utils';
import Toast from '~/lib/RN-root-toast';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import tw from '~/lib/tailwind';
import SelectSuppliers from '~/components/common/Suppliers';
import Text from '~/utils/StyledText';

let row = [];
let prevOpenedRow;
const CreateOrEditReceipt = ({ navigation, route }) => {
  const { addMedicine } = route.params || {};

  useEffect(() => {
    if (addMedicine) {
      // navigation.setParams({
      //   addMedicine: undefined,
      // });
    }
  }, [addMedicine]);

  const deleteItem = ({ item }) => {};

  const onChangeQtt = () => {};
  const onChangeText = () => {};

  const renderItem = useCallback(
    ({ item, index }, onClick) => {
      const closeRow = index => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
          prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
      };

      const renderRightActions = (_progress, _dragX, onClick) => {
        return (
          <Button
            style={styles.btnDelete}
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
                    onPress: onClick,
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
            <Text style={styles.deleteTxt}>Xóa</Text>
          </Button>
        );
      };
      return (
        <Swipeable
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, onClick)
          }
          onSwipeableOpen={() => closeRow(index)}
          ref={ref => (row[index] = ref)}
          rightOpenValue={-scale(100)}>
          <Button
            onPress={() =>
              navigation.navigate('AddOrEditMedicine', {
                dataEdit: item,
              })
            }
            style={styles.listItem}>
            <Text style={styles.listItemName}>{item.name}</Text>
            <Text style={styles.listItemName}>{item.producer}</Text>
            <View style={[styles.row]}>
              <View style={[styles.row, styles.itemDetailPrice]}>
                <Text style={styles.itemPrice}>
                  {formatNumber(item.dealPrice || item.price)}
                </Text>
                <Text style={styles.xqtt}>x</Text>
              </View>

              <TextInput
                selectTextOnFocus={true}
                keyboardType="numeric"
                selectionColor={COLOR.READDING_MODE}
                value={formatNumber(item.amount)}
                onChangeText={val =>
                  onChangeText(convertPriceToString(val), item.id)
                }
                style={styles.inputNumber}
              />

              <View style={[styles.row, styles.updown]}>
                <Button
                  style={styles.updownBtn}
                  onPress={() => onChangeQtt('down', item.id)}>
                  <Icon
                    type="AntDesign"
                    name="minus"
                    size={scale(24)}
                    color={COLOR.THEME}
                  />
                </Button>
                <Button
                  style={styles.updownBtn}
                  onPress={() => onChangeQtt('up', item.id)}>
                  <Icon
                    type="AntDesign"
                    name="plus"
                    size={scale(24)}
                    color={COLOR.THEME}
                  />
                </Button>
              </View>
            </View>
          </Button>
        </Swipeable>
      );
    },
    [navigation],
  );
  // console.log({ warehouseInOutProducts });

  const listData = [
    {
      id: '1',
      name: 'Thuốc số 1',
      price: 50000,
      amount: 3,
      producer: 'Nhà sản xuất số 1',
    },
    {
      id: '2',
      name: 'Thuốc số 2',
      price: 50000,
      amount: 1,
      producer: 'Nhà sản xuất số 2',
    },
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
            type="AntDesign"
            name="close"
            size={scale(24)}
            color={COLOR.BLACK}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tạo phiếu nhập thuốc</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('ThongTinPhieuNhap');
            }}>
            <Icon
              type="AntDesign"
              name="infocirlceo"
              size={scale(18)}
              color={COLOR.BLACK}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bodyPage}>
        <View style={styles.boxFilter}>
          <View style={styles.boxSearch}>
            <Icon
              type="AntDesign"
              name="search1"
              size={scale(20)}
              color={COLOR.ROOT_COLOR_SMOOTH}
              style={{ width: scale(20) }}
            />
            <Button
              onPress={() => navigation.navigate('SearchMedicines')}
              style={{
                flex: 1,
                height: verticalScale(30),
                justifyContent: 'center',
              }}>
              <Text style={styles.inputSearch}>Chọn hàng nhập</Text>
            </Button>

            <View style={styles.boxSearchRight}>
              <Button
                style={styles.boxSearchBtn}
                onPress={() => {
                  navigation.navigate('AddOrEditMedicine');
                }}>
                <Icon
                  type="AntDesign"
                  name="plus"
                  size={scale(20)}
                  color={COLOR.ROOT_COLOR_SMOOTH}
                />
              </Button>

              <Button style={styles.boxSearchBtn}>
                <Icon
                  type="MaterialCommunityIcons"
                  name="barcode-scan"
                  size={scale(20)}
                  color={COLOR.ROOT_COLOR_SMOOTH}
                />
              </Button>
            </View>
          </View>
        </View>

        <SelectSuppliers
          style={styles.suppliers}
          placeholder="Chọn nhà cung cấp"
        />
        <FlatList
          data={listData}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 15 }}
          renderItem={v =>
            renderItem(v, () => {
              deleteItem(v);
            })
          }
        />
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerBtn}
            onPress={() => {
              navigation.navigate('ConfirmReceipt');
            }}>
            <View>
              <Text style={styles.footerTxt}>Tổng</Text>
              <View style={styles.tag}>
                <Text style={styles.tagTxt}>2</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.footerTxt}>{formatNumber(100000)}</Text>
              <Icon
                type="FontAwesome"
                name="angle-right"
                size={scale(16)}
                color={COLOR.WHITE}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  headerTitle: {
    fontSize: '18@s',
    fontWeight: '500',
    flex: 1,
    paddingLeft: '10@s',
  },
  bodyPage: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  boxFilter: {
    paddingHorizontal: '15@s',
    paddingVertical: '8@vs',
  },
  boxSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F4',
    paddingHorizontal: '6@s',
    borderRadius: '10@s',
  },
  inputSearch: {
    marginHorizontal: '5@s',
    fontSize: '13@s',
    color: COLOR.READDING_MODE_TXT,
  },
  boxSearchRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxSearchBtn: {
    width: '30@s',
    marginLeft: '5@s',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    borderBottomWidth: 0.7,
    paddingHorizontal: '15@s',
    paddingTop: '8@vs',
    backgroundColor: COLOR.WHITE,
  },
  listItemName: {
    fontSize: '14@s',
    fontWeight: '500',
  },
  itemDetailPrice: {
    width: '170@s',
    fontSize: '13@s',
  },
  inputNumber: {
    height: '40@vs',
    width: '60@s',
    borderBottomColor: COLOR.ROOT_COLOR_GRAY,
    borderBottomWidth: 0.7,
    textAlign: 'center',
    fontSize: '13@s',
  },
  updown: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: '10@s',
  },
  updownBtn: {
    paddingHorizontal: '5@s',
    paddingVertical: '5@vs',
  },
  xqtt: {
    color: COLOR.THEME,
    fontSize: '13@s',
    marginLeft: '5@s',
  },
  itemPrice: {
    fontWeight: '500',
    fontSize: '13@s',
  },
  suppliers: {
    flexDirection: 'row',
    paddingHorizontal: '15@s',
    paddingVertical: '6@vs',
    backgroundColor: '#F0F0F4',
  },
  suppliersName: {
    paddingHorizontal: '5@s',
    fontSize: '13@s',
    fontWeight: '500',
    color: COLOR.ROOT_COLOR_SMOOTH,
  },
  footer: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.THEME,
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
    borderRadius: '12@s',
    justifyContent: 'space-between',
  },
  footerTxt: {
    color: COLOR.WHITE,
    fontSize: '13@s',
    marginRight: '10@s',
  },
  tag: {
    position: 'absolute',
    right: -20,
    top: 2,
    borderWidth: 0.7,
    borderColor: COLOR.WHITE,
    paddingHorizontal: '2@s',
  },
  tagTxt: {
    fontSize: '10@s',
    color: COLOR.WHITE,
  },
  btnDelete: {
    backgroundColor: COLOR.ROOT_COLOR_RED,
    alignItems: 'center',
    justifyContent: 'center',
    width: '70@s',
  },
  deleteTxt: {
    color: COLOR.WHITE,
    fontSize: '13@s',
  },
});

export default CreateOrEditReceipt;
