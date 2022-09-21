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
import { goodsReceipts } from '~/queryHooks';
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

const InfoReceipt = ({ navigation, route }) => {
  const { data, isLoading, refetch } = goodsReceipts.useInfo(
    {
      key: `goodsReceipts-${route.params?.dataId}`,
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

  // const handleCancle = async () => {
  //   const spinner = Loading.show('Đang cập nhật...');
  //   const res = await updateStt.mutateAsync({
  //     id: data?.id,
  //     params: {
  //       status: -1,
  //     },
  //   });

  //   Loading.hide(spinner);

  //   if (res?.success) {
  //     Toast.show('Đã hủy hóa đơn!', {
  //       duration: 1500,
  //       position: Toast.positions.CENTER,
  //     });
  //     navigation.goBack();
  //   } else {
  //     Toast.show(res?.error?.message || 'Đã xảy ra lỗi', {
  //       duration: 1500,
  //       position: Toast.positions.CENTER,
  //     });
  //   }
  //   // console.log({ res });
  // };

  //   const print = async html => {
  //     // On iOS/android prints the given html. On web prints the HTML from the current page.
  //     await Print.printAsync({
  //       html,
  //       // printerUrl: selectedPrinter?.url, // iOS only
  //     });
  //   };

  //   const handlePrint = () => {
  //     const strLast = `<tr>
  //     <td colspan="1" rowspan="1" style="text-align:center; width:%"><span style="font-size:12px"><span
  //                 style="font-family:Times New Roman,Times,serif">{STT}</span></span></td>
  //     <td colspan="1" rowspan="1" style="width:%"><span style="font-size:14px"><span
  //                 style="font-family:Times New Roman,Times,serif"><strong>{Ten_Hang_Hoa}</strong></span></span>
  //     </td>
  //     <td rowspan="1" style="width:%"><span style="font-size:12px"><span
  //                 style="font-family:Times New Roman,Times,serif">{Ma_Hang}</span></span></td>
  //     <td rowspan="1" style="text-align:center; width:%"><span style="font-size:12px"><span
  //                 style="font-family:Times New Roman,Times,serif">{Don_Vi_Tinh}</span></span></td>
  //     <td colspan="1" rowspan="1" style="text-align:center; width:%"><span style="font-size:12px"><span
  //                 style="font-family:Times New Roman,Times,serif">{So_Luong}</span></span></td>
  //     <td colspan="2" rowspan="1" style="text-align:right; width:%"><span style="font-size:12px"><span
  //                 style="font-family:Times New Roman,Times,serif">{Don_Gia_Sau_Chiet_Khau}</span></span></td>
  //     <td colspan="1" rowspan="1" style="text-align:right; width:%"><span style="font-size:12px"><span
  //                 style="font-family:Times New Roman,Times,serif">{Thanh_Tien}</span></span></td>
  // </tr>`;
  //     const value = templatePrint?.template;
  //     let newStr = '';

  //     if (data?.receiptsProducts?.length > 0) {
  //       data.receiptsProducts.forEach((item, index) => {
  //         let newStrLast = strLast;
  //         newStrLast = newStrLast.replaceAll('{STT}', index + 1);
  //         newStrLast = newStrLast.replaceAll(
  //           '{Ten_Hang_Hoa}',
  //           item.products?.productsName || '',
  //         );
  //         newStrLast = newStrLast.replaceAll(
  //           '{Ma_Hang}',
  //           item.products?.productsCode || '',
  //         );
  //         newStrLast = newStrLast.replaceAll(
  //           '{Don_Vi_Tinh}',
  //           item?.products?.units?.unitsName || '',
  //         );
  //         newStrLast = newStrLast.replaceAll(
  //           '{So_Luong}',
  //           formatNumber(item.amount),
  //         );
  //         newStrLast = newStrLast.replaceAll(
  //           '{Don_Gia_Sau_Chiet_Khau}',
  //           formatNumber(item.dealPrice),
  //         );
  //         newStrLast = newStrLast.replaceAll(
  //           '{Thanh_Tien}',
  //           formatNumber(Number(item.dealPrice || 0) * Number(item.amount || 0)),
  //         );
  //         newStr += newStrLast;
  //       });
  //     }

  //     const newTable = ` <table border="1" cellpadding="3" cellspacing="0" id="table-dat-hang" style="border-collapse:collapse; width:100%">
  //     <tbody>
  //         <tr>
  //             <td style="text-align:center; width:7%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>STT</strong></span></span></td>
  //             <td colspan="1" rowspan="1" style="text-align:center; width:%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>T&ecirc;n, nh&atilde;n, quy
  //                             c&aacute;ch phẩm chất vật tư, dụng cụ, sản phẩm, h&agrave;ng
  //                             h&oacute;a</strong></span></span></td>
  //             <td rowspan="1" style="text-align:center; width:10%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>M&atilde; số</strong></span></span>
  //             </td>
  //             <td rowspan="1" style="text-align:center; width:8%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>ĐVT</strong></span></span></td>
  //             <td style="text-align:center; width:8%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>Số lượng</strong></span></span></td>
  //             <td colspan="2" rowspan="1" style="text-align:center; width:10%"><span
  //                     style="font-family:Times New Roman,Times,serif"><span style="font-size:12px"><strong>Giá
  //                             bán</strong></span></span></td>
  //             <td style="text-align:center; width:13%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>Th&agrave;nh
  //                             Tiền</strong></span></span></td>
  //         </tr>
  //         <tr>
  //             <td style="text-align:center; width:%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>A</strong></span></span></td>
  //             <td colspan="1" style="text-align:center; width:%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>B</strong></span></span></td>
  //             <td style="text-align:center; width:%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>C</strong></span></span></td>
  //             <td style="text-align:center; width:%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>D</strong></span></span></td>
  //             <td style="text-align:center; width:%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>1</strong></span></span></td>
  //             <td colspan="2" rowspan="1" style="text-align:center; width:%"><span style="font-size:12px"><span
  //                         style="font-family:Times New Roman,Times,serif"><strong>2</strong></span></span></td>
  //             <td style="text-align:center; width:%"><span style="font-family:Times New Roman,Times,serif"><span
  //                         style="font-size:12px"><strong>3</strong></span></span></td>
  //         </tr>
  //         ${newStr}
  //     </tbody>
  // </table>`;

  //     let dataNew = value.replace(
  //       /<table border="1" cellpadding="3" cellspacing="0" id="table-hoa-don".*?<\/table>/gims,
  //       newTable,
  //     );

  //     const totalMucThuKhac =
  //       data?.receiptsSurcharge?.reduce(
  //         (previousValue, currentValue) =>
  //           previousValue + Number(currentValue?.increaseAmount || 0),
  //         0,
  //       ) || 0;

  //     dataNew = dataNew.replaceAll(
  //       '{Dia_Chi_Chi_Nhanh}',
  //       infoBranches?.address || '',
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Dien_Thoai_Chi_Nhanh}',
  //       infoBranches?.mobile || '',
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Nguoi_Tao}',
  //       data?.usersCreator?.fullname || '',
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Nhan_Vien_Ban_Hang}',
  //       data?.usersCreator?.fullname || '',
  //     );
  //     dataNew = dataNew.replaceAll('{Ten_Loai_Thu_Khac}', 'Khoản thu khác');
  //     dataNew = dataNew.replaceAll('{Tong_Cong}', formatNumber(data?.totalMoney));
  //     dataNew = dataNew.replaceAll(
  //       '{Tong_Tien_Hang}',
  //       formatNumber(data?.totalMoney),
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Tong_Tien_Tra_Hang}',
  //       formatNumber(data?.money),
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Tien_Tra_Khach}',
  //       formatNumber(data?.amountPaid),
  //     );
  //     dataNew = dataNew.replaceAll('{Muc_Thu_Khac}', totalMucThuKhac);
  //     dataNew = dataNew.replaceAll('{Ghi_Chu}', data?.note || '');
  //     dataNew = dataNew.replaceAll(
  //       '{Ngay}',
  //       dayjs(data.dateCreated).format('DD'),
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Thang}',
  //       dayjs(data.dateCreated).format('MM'),
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Nam}',
  //       dayjs(data.dateCreated).format('YYYY'),
  //     );
  //     dataNew = dataNew.replaceAll('{Ma_Don_Hang}', data?.code || 'Mã phiếu');

  //     const dataCustomer = data?.customers;

  //     // Dư  nợ
  //     const debt = Number(dataCustomer?.debt || 0);

  //     dataNew = dataNew.replaceAll(
  //       '{Ma_Khach_Hang}',
  //       dataCustomer?.customersCode || '',
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Khach_Hang}',
  //       dataCustomer?.customersName || 'Khách lẻ',
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Dia_Chi_Khach_Hang}',
  //       `${dataCustomer?.address || ''}, ${dataCustomer?.wards?.wardName || ''} ${
  //         dataCustomer?.wards?.districts?.districtName || ''
  //       } ${dataCustomer?.wards?.districts?.provinces?.provinceName || ''}`,
  //     );
  //     dataNew = dataNew.replaceAll('{Phuong_Xa_Khach_Hang}', '');
  //     dataNew = dataNew.replaceAll(
  //       '{Du_No_Truoc_Tao_Hoa_Don}',
  //       dataCustomer
  //         ? formatNumber(
  //             debt -
  //               (Number(data?.totalMoney || 0) - Number(data?.amountPaid || 0)),
  //           )
  //         : '---',
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Du_No_Sau_Tao_Hoa_Don}',
  //       dataCustomer ? formatNumber(debt) : '---',
  //     );
  //     dataNew = dataNew.replaceAll(
  //       '{Du_No_Sau_Tao_Hoa_Don_Bang_Chu}',
  //       dataCustomer ? number2word(debt) || '' : '---',
  //     );

  //     print(dataNew);
  //   };

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
    (accumulator, current) => accumulator + Number(current.retailQuantities),
    0,
  );

  const totalPrice = data?.detail?.reduce(
    (accumulator, current) =>
      accumulator + Number(current.price) * Number(current.retailQuantities),
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
            <Text style={styles.headerTitle}>{data?.receiptCode}</Text>
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
                <Text style={styles.customerName}>{data?.suppliers?.name}</Text>
                <Icon
                  type="FontAwesome"
                  name="angle-right"
                  size={scale(18)}
                  color={COLOR.ROOT_COLOR_SMOOTH}
                />
              </Button>
              <Text
                style={[styles.sellerName, { flex: 1, textAlign: 'right' }]}>
                {data?.usersRecipient?.fullname}
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
                {dayjs(data?.dateReceipt).format('DD-MM-YYYY HH:mm')}
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
                      x {item.retailQuantities} ({item.units?.name})
                    </Text>
                  </View>
                </View>
                <Text style={[styles.productTotalPrice]}>
                  {formatNumber(
                    Number(item.price) * Number(item.retailQuantities),
                  )}
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
              <Text style={[styles.infoBillPrice]}>
                {data?.goodReceiptCode}
              </Text>
            </View>

            <View
              style={[
                styles.row,
                styles.infoBillItem,
                { borderBottomWidth: 0.7 },
              ]}>
              <Text style={[styles.infoBillTitle]}>Người giao hàng</Text>
              <Text style={[styles.infoBillPrice]}>{data?.shipperName}</Text>
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
export default InfoReceipt;
