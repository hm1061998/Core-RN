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
import { formatNumber } from '~/utils/utils';
import Icon from '~/components/BasesComponents/Icon';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import Toast from '~/lib/RN-root-toast';
import { medicines } from '~/queryHooks';
import { useRefreshOnFocus, useRefreshByUser } from '~/utils/hooks';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import tw from '~/lib/tailwind';

const InfoMedicine = ({ navigation, route }) => {
  const { data, isLoading, refetch } = medicines.useInfo(
    {
      key: `medicine-${route.params?.dataId}`,
      id: route?.params?.dataId,
    },
    {
      enabled: !!route?.params?.dataId,
      onSuccess: res => {
        if (!res || !res.id) {
          Toast.show('Không tìm thấy thông tin thuốc này!', {
            duration: 1500,
            position: Toast.positions.CENTER,
          });
          navigation.goBack();
        }
      },
    },
  );

  useRefreshOnFocus(refetch);
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  const renderProductsCategories = key => {
    switch (key) {
      case 0:
        return 'Hàng hóa';
      case 1:
        return 'Dịch vụ';
      case 2:
        return 'Combo';
      default:
        return 'Combo';
    }
  };
  // console.log({ data });

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
            <Text style={styles.headerTitle}>{data?.name}</Text>
          </View>
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
          <View
            style={[
              styles.section,
              { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
            ]}>
            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Số đăng ký</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>
                  {data?.registrationNumber || '(Chưa cập nhật)'}
                </Text>
              </View>
            </View>
            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Mã hàng</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>
                  {data?.medicineCode || '(Chưa cập nhật)'}
                </Text>
              </View>
            </View>

            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Loại thuốc</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>
                  {data?.types?.name}
                </Text>
              </View>
            </View>
            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Tiêu chuẩn</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>{data?.standard}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Quy cách bào chế</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>
                  {data?.groupMedicines?.name}
                </Text>
              </View>
            </View>
            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Quy cách đóng gói</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>
                  {data?.packages?.name}
                </Text>
              </View>
            </View>
            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Xuất sứ</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>{data?.madeIn}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Nồng độ</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>
                  {data?.concentrations}
                </Text>
              </View>
            </View>

            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Nhà sản xuất</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>
                  {data?.producers?.name}
                </Text>
              </View>
            </View>

            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Tồn kho</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>{data?.quantity}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Trọng lượng (gram)</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>{data?.weigh}</Text>
              </View>
            </View>
            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Vị trí</Text>
              <View style={[styles.row, styles.detailContent]}>
                <Text style={[styles.detailContentTxt]}>
                  {data?.productPlacements?.productPlacementsName}
                </Text>
              </View>
            </View>
            <View style={[styles.row, styles.productDetailItem]}>
              <Text style={[styles.detailLabel]}>Đơn vị</Text>
              <View
                style={[
                  styles.row,
                  styles.detailContent,
                  { borderBottomWidth: 0 },
                ]}>
                <Text style={[styles.detailContentTxt]}>
                  {data?.units?.unitsName}
                </Text>
              </View>
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
  backbtn: {
    width: '35@s',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
    width: '60@s',
    justifyContent: 'space-between',
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
  sectionTitle: {
    fontFamily: 'Roboto_medium',
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
    marginLeft: '5@s',
  },
});
export default InfoMedicine;
