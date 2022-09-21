import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Button from '~/components/BasesComponents/Button';
import { COLOR, SIZES, SHADOW_5 } from '~/utils/Values';
import { formatNumber, number2word } from '~/utils/utils';
import Icon from '~/components/BasesComponents/Icon';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import dayjs from 'dayjs';
import { goodsIssues } from '~/queryHooks';
import { useRefreshOnFocus, useRefreshByUser } from '~/utils/hooks';
import Toast from '~/lib/RN-root-toast';
import Loading from '~/lib/RN-root-loading';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useQueryClient } from 'react-query';
import tw from '~/lib/tailwind';
// import * as Print from 'expo-print';

const InfoIssue = ({ navigation, route }) => {
  const { data, isLoading, refetch } = goodsIssues.useInfo(
    {
      key: `goodsIssue-${route.params?.dataId}`,
      id: route?.params?.dataId,
    },
    {
      enabled: !!route?.params?.dataId,
      onSuccess: res => {
        if (!res || !res.id) {
          Toast.show('Không tìm thấy thông tin!', {
            duration: 1500,
            position: Toast.positions.CENTER,
          });
          navigation.goBack();
        }
      },
    },
  );

  // const { data: templatePrint } = printedForms.useInfo({
  //   id: '2',
  //   key: ['printedForm', '2'],
  // });

  // const { data: infoBranches } = branches.useInfo({
  //   id: '2',
  //   key: ['branch', '1'],
  // });

  // console.log({ data });
  // const updateStt = receipts.useUpdateStatus();

  // useRefreshOnFocus(refetch);
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  const renderStatus = key => {
    switch (key) {
      case 0:
        return 'Phiếu tạm';
      case 1:
        return 'Hoàn thành';
      case -1:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  if (isLoading) {
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

  const totalAmount = data?.detail?.reduce(
    (accumulator, current) => accumulator + Number(current.quantities),
    0,
  );

  const totalPrice = data?.detail?.reduce(
    (accumulator, current) =>
      accumulator + Number(current.price) * Number(current.quantities),
    0,
  );

  return (
    <View style={tw`flex-1 bg-THEME pt-status-bar`}>
      <View style={tw`flex-1 bg-BG`}>
        <View style={styles.header}>
          <Button
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
          </Button>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{data?.issueCode}</Text>
            <Text style={styles.headerSubTitle}>
              {renderStatus(data?.status)}
            </Text>
          </View>

          {/* {data?.status === 1 && ( */}
          <View style={styles.headerRight}>
            <Menu>
              <MenuTrigger style={[styles.headerBtn]}>
                <Icon
                  type="Entypo"
                  name="dots-three-horizontal"
                  size={scale(18)}
                  color={COLOR.BLACK}
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: styles.menuContainer,
                }}>
                <MenuOption
                  customStyles={{
                    optionWrapper: {
                      ...styles.optionMenu,
                    },
                  }}
                  // onSelect={handlePrint}
                >
                  <Text style={styles.optionMenuTxt}>In hóa đơn</Text>
                </MenuOption>
                {/* <MenuOption
                  customStyles={{
                    optionWrapper: {
                      ...styles.optionMenu,
                    },
                  }}
                  onSelect={handleCancle}>
                  <Text style={styles.optionMenuTxt}>Hủy</Text>
                </MenuOption> */}
              </MenuOptions>
            </Menu>
          </View>
          {/* // )} */}
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingByUser}
              onRefresh={refetchByUser}
            />
          }
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.section}>
            <View
              style={[
                styles.row,
                styles.infoMember,
                { borderBottomWidth: 0.7, paddingVertical: 0 },
              ]}>
              <Button
                style={[styles.row, { paddingVertical: verticalScale(10) }]}>
                <Icon
                  type="FontAwesome"
                  name="user"
                  size={scale(18)}
                  color={COLOR.ROOT_COLOR_SMOOTH}
                />
                <Text style={styles.customerName}>
                  {data?.customers?.name || data?.customers?.mobile}
                </Text>
                <Icon
                  type="FontAwesome"
                  name="angle-right"
                  size={scale(18)}
                  color={COLOR.ROOT_COLOR_SMOOTH}
                />
              </Button>
              <Text
                style={[styles.sellerName, { flex: 1, textAlign: 'right' }]}>
                {data?.usersSeller?.fullname}
              </Text>
            </View>
            <View style={[styles.row, styles.infoMember]}>
              <View style={[styles.row, { flex: 1 }]}>
                <Icon
                  type="FontAwesome"
                  name="shopping-bag"
                  size={scale(18)}
                  color={COLOR.ROOT_COLOR_SMOOTH}
                />
                <Text style={styles.customerName}>
                  {data?.paymentMethods?.name}
                </Text>
              </View>
              <Text style={styles.sellerName}>
                {dayjs(data?.issueDate).format('DD-MM-YYYY HH:mm')}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            {data?.detail?.map((item, index) => (
              <Button
                key={item.id}
                onPress={() => {
                  navigation.navigate('InfoMedicine', {
                    dataId: item.medicines?.id,
                  });
                }}
                style={[
                  styles.row,
                  styles.productItem,
                  index < data?.detail.length - 1 && {
                    borderBottomWidth: 0.7,
                  },
                ]}>
                <View style={styles.productItemInfo}>
                  <Text style={[styles.productName]}>
                    {item.medicines?.name} ({item.medicines?.madeIn})
                  </Text>
                  <Text style={[styles.productCode]}>
                    {item.medicines?.medicineCode || '(Chưa cập nhật)'}
                  </Text>
                  <View style={[styles.row]}>
                    <Text style={[styles.productPrice]}>
                      {formatNumber(item.price)}
                    </Text>
                    <Text style={[styles.productQtt]}>
                      x {item.quantities} ({item.units?.name})
                    </Text>
                  </View>
                </View>
                <Text style={[styles.productTotalPrice]}>
                  {formatNumber(Number(item.price) * Number(item.quantities))}
                </Text>
              </Button>
            ))}
          </View>

          <View style={[styles.section]}>
            <View
              style={[
                styles.row,
                styles.infoBillItem,
                { borderBottomWidth: 0.7 },
              ]}>
              <View>
                <Text style={[styles.infoBillTitle]}>Tổng tiền hàng</Text>
                <View style={[styles.tag]}>
                  <Text style={[styles.tagTxt]}>{totalAmount}</Text>
                </View>
              </View>
              <Text style={[styles.infoBillPrice]}>
                {formatNumber(totalPrice)}
              </Text>
            </View>

            <View
              style={[
                styles.row,
                styles.infoBillItem,
                { borderBottomWidth: 0.7 },
              ]}>
              <Text style={[styles.infoBillTitle]}>Số hóa đơn</Text>
              <Text style={[styles.infoBillPrice]}>{data?.goodIssueCode}</Text>
            </View>

            <View
              style={[
                styles.row,
                styles.infoBillItem,
                { borderBottomWidth: 0.7 },
              ]}>
              <Text style={[styles.infoBillTitle]}>Mã đơn thuốc QG</Text>
              <Text style={[styles.infoBillPrice]}>
                {data?.goodIssueInvoiceCode}
              </Text>
            </View>
            <View
              style={[
                styles.row,
                styles.infoBillItem,
                { borderBottomWidth: 0.7 },
              ]}>
              <Text style={[styles.infoBillTitle]}>Ghi chú</Text>
              <Text style={[styles.infoBillPrice]}>{data?.descriptions}</Text>
            </View>
            {/* {data?.debit && ( */}
            <View style={[styles.row, styles.infoBillItem]}>
              <Text style={[styles.infoBillTitle]}>Công nợ</Text>
            </View>
            {/* )} */}
          </View>

          <View style={styles.section}>
            <View style={[styles.row, styles.thongtinbanggia]}>
              <View style={[styles.row]}>
                <Icon
                  type="Ionicons"
                  name="ios-pricetag"
                  size={scale(16)}
                  color={COLOR.ROOT_COLOR_SMOOTH}
                />
                <Text style={styles.tenbanggia}>Bảng giá</Text>
              </View>
              <Text style={styles.tenchinhanh}>Chi nhánh trung tâm</Text>
            </View>
            <View style={[styles.row, styles.thongtinnguoitao]}>
              <Text style={styles.label_nguoitao}>Người tạo:</Text>
              <Text style={styles.tennguoitao}>
                {data?.usersCreator?.fullname}
              </Text>
            </View>
          </View>
        </ScrollView>
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
    paddingVertical: '10@vs',
  },
  backbtn: {
    width: '35@s',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: '18@s',
    fontFamily: 'Roboto_medium',
  },
  bodyPage: {
    flex: 1,
    backgroundColor: COLOR.BG,
  },
  section: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    marginTop: '10@vs',
    borderRadius: '15@s',
    width: '100%',
  },
  customerName: {
    fontSize: '13@s',
    marginHorizontal: '10@s',
  },
  sellerName: {
    fontSize: '13@s',
    color: COLOR.ROOT_COLOR_SMOOTH,
  },
  infoMember: {
    paddingVertical: '10@vs',
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  productItem: {
    paddingVertical: '10@vs',
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: '14@s',
    fontFamily: 'Roboto_medium',
  },
  productCode: {
    fontFamily: 'Roboto_medium',
    color: COLOR.ROOT_COLOR_SMOOTH,
    fontSize: '14@s',
    marginVertical: '5@vs',
  },
  productPrice: {
    fontSize: '13@s',
    marginRight: '5@vs',
  },
  productQtt: {
    color: COLOR.THEME,
    fontSize: '13@s',
  },
  infoBillItem: {
    justifyContent: 'space-between',
    paddingVertical: '10@vs',
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  tag: {
    position: 'absolute',
    top: 0,
    right: -scale(20),
    zIndex: 1,
    borderWidth: 0.7,
    paddingHorizontal: '3@s',
    borderColor: COLOR.ROOT_COLOR_CYAN,
  },
  tagTxt: {
    fontSize: '8@s',
  },
  infoBillTitle: {
    fontSize: '13@s',
  },
  infoBillPrice: {
    fontSize: '13@s',
  },
  txtThemeColor: {
    color: COLOR.THEME,
  },
  thongtinbanggia: {
    justifyContent: 'space-between',
    paddingVertical: '10@vs',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  tenbanggia: {
    marginLeft: '10@s',
    fontSize: '13@s',
  },
  tenchinhanh: {
    fontSize: '13@s',
  },
  thongtinnguoitao: {
    paddingVertical: '10@vs',
  },
  label_nguoitao: {
    marginRight: '5@s',
    color: COLOR.ROOT_COLOR_SMOOTH,
    fontSize: '12@s',
  },
  tennguoitao: {
    fontSize: '13@s',
  },
  menuContainer: {
    width: 'auto',
    alignItems: 'center',
    ...SHADOW_5,
  },
  optionMenu: {
    paddingVertical: '10@vs',
    paddingHorizontal: '10@s',
  },
  optionMenuTxt: {
    fontSize: '13@s',
  },
});
export default InfoIssue;
