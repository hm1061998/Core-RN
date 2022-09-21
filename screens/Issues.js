import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { SIZES, COLOR, SHADOW_2, SHADOW_5 } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  withMenuContext,
} from 'react-native-popup-menu';
import dayjs from 'dayjs';
import ProgressiveImage from '~/components/BasesComponents/ProgressiveImage';
import { FlashList } from '@shopify/flash-list';
import { formatNumber, getLinkImg } from '~/utils/utils';
import { goodsIssues } from '~/queryHooks';
import { PAGE_SIZE } from '@env';
import { useRefreshOnFocus, useRefreshByUser } from '~/utils/hooks';
import ListEmpty from '~/components/ListEmpty';
import tw from '~/lib/tailwind';
import Button from '~/components/BasesComponents/Button';
import { useLayoutContext } from '~/layouts/ControlProvider';
import Text from '~/utils/StyledText';
import FilterIssues from '~/components/Issues/FilterIssues';

const getValueSort = id => {
  switch (id) {
    case '0':
      return ['createDate', 'desc'];
    case '1':
      return ['createDate', 'asc'];
    case '2':
      return ['salePrice', 'asc'];
    case '3':
      return ['salePrice', 'desc'];
    case '4':
      return ['productsName', 'asc'];
    case '5':
      return ['productsName', 'desc'];
    default:
      return ['createDate', 'desc'];
  }
};
const Receipts = ({ navigation, ctx, route }) => {
  const { paramsFilter } = route.params || {};
  const refFilter = useRef();
  const { placeId } = useLayoutContext();
  const filter = useMemo(() => {
    let tFilter = {
      placesId: placeId,
    };
    4;

    if (!paramsFilter?.receiptCode) {
      delete tFilter.receiptCode;
    }

    return tFilter;
  }, [paramsFilter, placeId]);

  // console.log({ filter });

  const [sortValue, setSortValue] = useState('0');
  const {
    data,
    isLoading,
    results,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = goodsIssues.useInfinitiData(
    {
      pageSize: PAGE_SIZE,
      params: {
        filter: JSON.stringify({ ...filter }),
        sort: JSON.stringify(getValueSort(sortValue)),
      },
      key: `goodsIssues-${sortValue}-${JSON.stringify(paramsFilter)}`,
    },
    // {
    //   enabled: false,
    // },
  );

  // console.log({ results });
  useRefreshOnFocus(refetch);
  const { refetchByUser, isRefetchingByUser } = useRefreshByUser(refetch);

  const getTotalPriceItems = item => {
    let total =
      (item?.detail?.length > 0 &&
        item.detail.map(
          e =>
            Number(e.price || 0) * Number(e.quantities || 0) -
            Number(e.discount || 0) +
            Number(e.vat || 0),
        )) ||
      0;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    total = total === 0 ? 0 : total.reduce(reducer);

    return formatNumber(total);
  };

  const arrSort = [
    { id: '0', name: 'Mới nhất' },
    { id: '1', name: 'Cũ nhất' },
    // { id: '2', name: 'Giá tăng' },
    // { id: '3', name: 'Giá giảm' },
    // { id: '4', name: 'A -> Z' },
    // { id: '5', name: 'Z -> A' },
    // { id: '6', name: 'Khách đặt tăng' },
    // { id: '7', name: 'Khách đặt giảm' },
  ];

  const detail = data?.pages?.[0]?.result?.detail || {};
  const total_hanghoa = data?.pages?.[0]?.result?.pagination?.total || 0;
  // console.log(results?.[0]?.usersSeller);
  return (
    <View style={tw`flex-1 bg-THEME pt-status-bar`}>
      <View
        style={tw`flex-row items-center justify-between bg-WHITE px-5 py-1`}>
        <Text style={styles.headerTitle}>Danh sách phiếu bán</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => {
              refFilter.current?.show();
            }}>
            <Icon
              type="AntDesign"
              name="filter"
              size={scale(18)}
              color={COLOR.BLACK}
            />
          </TouchableOpacity>

          <Menu>
            <MenuTrigger
              style={[
                styles.headerBtn,
                {
                  transform: [{ rotate: '90deg' }],
                },
              ]}>
              <Icon
                type="Fontisto"
                name="arrow-swap"
                size={scale(16)}
                color={COLOR.BLACK}
              />
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: styles.menuContainer,
              }}>
              {arrSort.map(item => (
                <MenuOption
                  key={item.id}
                  customStyles={{
                    optionWrapper: {
                      ...styles.optionMenu,
                      backgroundColor:
                        sortValue === item.id ? '#E8E8E8' : COLOR.WHITE,
                    },
                  }}
                  onSelect={() => {
                    setSortValue(item.id);
                  }}>
                  <Text style={styles.optionMenuTxt}>{item.name}</Text>
                </MenuOption>
              ))}
            </MenuOptions>
          </Menu>
        </View>
      </View>
      <View style={styles.bodyPage}>
        <View style={[styles.bodyHeader]}>
          <TouchableOpacity
            // onPress={() => ctx.menuActions.openMenu('price')}
            style={[styles.menuFlexbox, { justifyContent: 'space-between' }]}>
            <View style={styles.menuFlexbox}>
              <Text
                style={[
                  styles.menuLabel,
                  styles.txtThemeColor,
                  { marginRight: 5 },
                ]}>
                {formatNumber(total_hanghoa || 0)}
              </Text>
              <Text style={styles.menuSubLabel}>Thuốc - Tồn kho</Text>
              <Text
                style={[
                  styles.menuLabel,
                  styles.txtThemeColor,
                  { marginLeft: 5 },
                ]}>
                {formatNumber(detail?.quantity || 0)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <FlashList
            data={results}
            estimatedItemSize={100}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingByUser}
                onRefresh={refetchByUser}
              />
            }
            ListEmptyComponent={() => {
              if (isLoading) {
                return <ActivityIndicator color={'green'} size={'large'} />;
              }
              return (
                <ListEmpty
                  label="Bạn chưa có phiếu nhâp nào"
                  onRefresh={refetchByUser}
                  icon={{
                    type: 'Ionicons',
                    name: 'receipt',
                  }}
                />
              );
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() =>
                  navigation.navigate('InfoIssue', { dataId: item.id })
                }>
                <View style={styles.listItemRow}>
                  <View style={styles.listItemIcon}>
                    <Icon
                      type="Ionicons"
                      name="receipt"
                      size={20}
                      color="black"
                    />
                  </View>

                  <View style={styles.listItemCol}>
                    <Text style={styles.listItemProduct}>{item.issueCode}</Text>
                    <Text style={styles.listItemSubProduct}>
                      Người bán: {item.usersSeller?.fullname}
                    </Text>
                    <Text style={tw`text-xs text-gray-400`}>
                      {dayjs(item.createDate).format('HH:mm DD-MM-YYYY')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.listItemPrice}>
                      {getTotalPriceItems(item)}
                    </Text>

                    <Text
                      style={[
                        styles.listItemQtt,
                        !item.status && { color: 'red' },
                      ]}>
                      {item.status ? 'Kích hoạt' : 'Hủy'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              if (hasNextPage) {
                // console.log('run next');
                // fetchNextPage();
              }
            }}
            ListFooterComponent={
              isFetchingNextPage && (
                <ActivityIndicator color={'green'} size={'large'} />
              )
            }
          />
        </View>
      </View>

      <TouchableHighlight
        onPress={() => {
          navigation.navigate('CreateOrEditIssues');
        }}
        underlayColor={tw.color('gray-500')}
        style={tw`w-14 h-14 absolute bottom-5 right-5 rounded-full items-center justify-center bg-THEME shadow-md`}>
        <Icon type="AntDesign" name="plus" color="#fff" size={20} />
      </TouchableHighlight>

      <FilterIssues ref={refFilter} />
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '20@s',
    paddingVertical: '6@vs',
    paddingTop: SIZES.HEIGHT_STATUSBAR + 5,
  },
  headerRight: {
    flexDirection: 'row',
    width: '70@s',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: scale(30),
    height: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: '18@s',
    // fontFamily: 'Roboto_medium',
    fontWeight: '500',
  },
  bodyPage: {
    flex: 1,
    backgroundColor: COLOR.BG,
  },

  menuContainer: {
    width: 'auto',
    alignItems: 'center',
    ...SHADOW_5,
  },
  optionMenu: {
    paddingVertical: '15@vs',
    paddingHorizontal: '10@s',
  },
  optionMenuTxt: {
    fontSize: '13@s',
  },
  choseDate: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  bodyHeader: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    paddingVertical: '5@vs',
    width: '100%',
    borderBottomLeftRadius: '15@s',
    borderBottomRightRadius: '15@s',
    marginBottom: '10@vs',
    borderTopWidth: 0.7,
    borderTopColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  section: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    paddingBottom: '10@vs',
    borderRadius: '15@s',
    marginBottom: '10@vs',
    width: '100%',
    flex: 1,
  },
  labelMenu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelTitle: {
    marginLeft: '5@s',
  },

  menuFlexbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuLabel: {
    fontSize: '15@s',
    fontWeight: '500',
    marginBottom: '2@vs',
  },
  menuSubLabel: {
    fontWeight: '500',
    fontSize: '10@s',
    color: COLOR.ROOT_COLOR_SMOOTH,
  },
  txtThemeColor: {
    color: COLOR.THEME,
  },

  listItem: {
    paddingVertical: '8@vs',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  listItemRow: {
    flexDirection: 'row',
  },
  listItemIcon: {
    width: '40@s',
    height: '40@s',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DEF0FF',
    marginRight: '10@s',
  },
  listItemPrice: {
    fontWeight: '500',
    fontSize: '14@s',
    textAlign: 'right',
  },

  listItemCol: {
    flex: 1,
  },
  listItemProduct: {
    fontSize: '14@s',
  },
  listItemSubProduct: {
    fontSize: '12@s',
    color: COLOR.ROOT_COLOR_SMOOTH,
    marginVertical: '5@vs',
  },

  listItemQtt: {
    color: COLOR.THEME,
    textAlign: 'right',
  },
  listItemIconText: {
    fontWeight: '500',
    fontSize: '16@s',
  },
});

export default withMenuContext(Receipts);
