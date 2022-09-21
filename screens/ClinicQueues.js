import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TouchableHighlight,
  SectionList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { SIZES, COLOR, SHADOW_5 } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  withMenuContext,
} from 'react-native-popup-menu';
import dayjs from 'dayjs';
import RangeDatePicker from '~/components/BasesComponents/RangeDatePicker';
import { formatNumber, customFormatDate } from '~/utils/utils';
import { clinicQueues } from '~/queryHooks';
import { PAGE_SIZE } from '@env';
import _ from 'lodash';
import { useRefreshOnFocus, useRefreshByUser } from '~/utils/hooks';
import ListEmpty from '~/components/ListEmpty';
import { FlashList } from '@shopify/flash-list';
import tw from '~/lib/tailwind';
import { useLayoutContext } from '~/layouts/ControlProvider';
import FilterClinicQueues from '~/components/ClinicQueues/FilterClinicQueues';
import SectionFlashList from '~/components/BasesComponents/SectionFlashList';
import { List } from 'react-native-paper';

const arrSort = [
  { id: '0', name: 'Mới nhất' },
  { id: '1', name: 'Cũ nhất' },
];

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

const arrDate = [
  {
    id: '0',
    name: '7 ngày qua',
    value: [dayjs().subtract(7, 'days'), dayjs()],
  },
  {
    id: '1',
    name: 'Hôm nay',
    value: [dayjs(), dayjs()],
  },
  {
    id: '2',
    name: 'Hôm qua',
    value: [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
  },
  {
    id: '3',
    name: 'Tuần này',
    value: [dayjs().startOf('week'), dayjs().endOf('week')],
  },
  {
    id: '4',
    name: 'Tuần trước',
    value: [
      dayjs().subtract(1, 'weeks').startOf('week'),
      dayjs().subtract(1, 'weeks').endOf('week'),
    ],
  },
  {
    id: '5',
    name: 'Tháng này',
    value: [dayjs().startOf('month'), dayjs().endOf('month')],
  },
  {
    id: '6',
    name: 'Tháng trước',
    value: [
      dayjs().subtract(1, 'months').startOf('month'),
      dayjs().subtract(1, 'months').endOf('month'),
    ],
  },
  { id: '7', name: 'Tùy chọn...', value: 'calendar' },
];
const arrDislayPrice = [
  {
    id: '0',
    name: 'Tổng tiền hàng',
    value: 'money',
  },
  { id: '1', name: 'Giảm giá', value: 'discount' },
  {
    id: '2',
    name: 'Cần trả NCC',
    value: 'totalMoney',
  },
  {
    id: '3',
    name: 'Đã trả NCC',
    value: 'amountPaid',
  },
];

const ClinicQueues = ({ navigation, ctx, route }) => {
  const { placeId } = useLayoutContext();
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState('1');
  const [dateLabel, setDateLabel] = useState(arrDate[1].name);
  const [dateRange, setDateRange] = useState(arrDate[1].value);
  const [sortValue, setSortValue] = useState('0');
  const [displayPrice, setDisplayPrice] = useState(arrDislayPrice[0]);
  const calendarRef = useRef();
  const refFilter = useRef();

  const { paramsFilter } = route.params || {};
  // console.log({ paramsFilter });

  const filter = useMemo(() => {
    const FromDate =
      dateRange[0] &&
      dayjs(dateRange[0]).set('hour', 0).set('minute', 0).set('second', 0);
    const ToDate =
      dateRange[1] &&
      dayjs(dateRange[1]).set('hour', 23).set('minute', 59).set('second', 59);

    const tFilter = {
      placesId: placeId,
      // ...paramsFilter,
    };

    if (!ToDate) {
      delete tFilter.ToDate;
    }
    if (!paramsFilter?.productsCode) {
      delete tFilter.productsCode;
    }
    if (!paramsFilter?.productsName) {
      delete tFilter.productsName;
    }
    if (!paramsFilter?.suppliersSearch) {
      delete tFilter.suppliersSearch;
    }
    if (!paramsFilter?.warehouseInOutCode) {
      delete tFilter.warehouseInOutCode;
    }
    if (
      paramsFilter?.status === null ||
      paramsFilter?.status === undefined ||
      paramsFilter?.status === 'all'
    ) {
      delete tFilter.status;
    }

    // console.log({ tFilter });
    return tFilter;
  }, [dateRange, paramsFilter, placeId]);

  const {
    data,
    results,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = clinicQueues.useInfinitiData({
    params: {
      filter: JSON.stringify({ ...filter }),
      sort: JSON.stringify(getValueSort(sortValue)),
    },
    pageSize: PAGE_SIZE,
    key: `clinicQueues-sort-${sortValue}-${JSON.stringify(filter)}`,
  });

  // console.log({ data });

  useRefreshOnFocus(refetch);
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  const renderStatus = key => {
    switch (key) {
      case 0:
        return 'Đăng ký khám';
      case 1:
        return 'Chờ gọi khám';
      case 2:
        return 'Đang khám';
      case 3:
        return 'Đã khám';
      default:
        return 'Không xác định';
    }
  };

  const renderChangeStatus = activeTab => {
    // log('activeTab', activeTab);

    switch (activeTab) {
      case 0:
        return { status: 'Đăng ký khám', color: '#f5222d' };
      case 1:
        return { status: 'Chờ gọi khám', color: '#fa8c16' };
      case 2:
        return { status: 'Đang khám', color: '#1890ff' };
      case 3:
        return { status: 'Đã khám', color: '#52c41a' };
      default:
        return { status: 'Không xác định', color: '#000' };
    }
  };

  //nhóm sản phẩm theo ngày tạo
  const groupsList = useMemo(() => {
    let list = [];

    //lặp qua từng sản phẩm để đưa vào mảng
    results?.length > 0 &&
      results.forEach(item => {
        //lấy ra ngày tạo của sản phẩm, nhóm các sản phẩm cùng ngày lại
        if (!list.includes(dayjs(item.createDate).format('YYYY-MM-DD'))) {
          list.push(dayjs(item.createDate).format('YYYY-MM-DD'));
        }
        list.push(item);
      });
    return list;
  }, [results]);

  // console.log({ results });

  const detail = data?.pages?.[0]?.result?.detail || {};
  const total_phieu = data?.pages?.[0]?.result?.pagination?.total || 0;
  // console.log(date);
  // console.log(dayjs().endOf('week').format('DD.MM.YYYY'));
  // console.log(dayjs().subtract(1, 'days').format('DD.MM.YYYY'));
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

        <Text style={styles.headerTitle}>Lịch khám</Text>
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
        <Menu style={{ zIndex: 10 }}>
          <MenuTrigger style={styles.choseDate}>
            <View style={styles.labelMenu}>
              <Icon
                type="AntDesign"
                name="calendar"
                size={18}
                color={COLOR.THEME}
              />
              <Text style={styles.labelTitle}>{dateLabel}</Text>
            </View>
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: styles.menuContainer,
            }}>
            {arrDate.map(item => (
              <MenuOption
                key={item.id}
                customStyles={{
                  optionWrapper: {
                    ...styles.optionMenu,
                    backgroundColor: date === item.id ? '#E8E8E8' : COLOR.WHITE,
                  },
                }}
                onSelect={() => {
                  if (item.value === 'calendar') {
                    // setShowCalendar(true);
                    calendarRef.current.show();
                  } else {
                    // alert(JSON.stringify(item.value));
                    setDateLabel(item.name);
                    setDateRange(item.value);
                  }

                  setDate(item.id);
                }}>
                <Text style={styles.optionMenuTxt}>{item.name}</Text>
              </MenuOption>
            ))}
          </MenuOptions>
        </Menu>

        <View
          style={[
            styles.section,
            {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              paddingBottom: 5,
              paddingVertical: 5,
              zIndex: 10,
            },
          ]}>
          <TouchableOpacity
            onPress={() => ctx.menuActions.openMenu('total-price')}
            style={[styles.menuFlexbox, { justifyContent: 'space-between' }]}>
            <View style={styles.menuFlexbox}>
              <Text
                style={[
                  styles.menuLabel,
                  styles.txtThemeColor,
                  { marginRight: 5 },
                ]}>
                {formatNumber(total_phieu)}
              </Text>
              <Text style={styles.menuSubLabel}>đăng ký khám - chờ khám:</Text>
              <Text
                style={[
                  styles.menuLabel,
                  styles.txtThemeColor,
                  { marginLeft: 5 },
                ]}>
                {formatNumber(detail?.totalAmount || 0)}
              </Text>
            </View>
            <View style={styles.menuFlexbox}>
              <Menu name="total-price">
                <MenuTrigger style={styles.menuFlexbox}>
                  <Text style={[styles.menuSubLabel, { marginRight: 5 }]}>
                    {displayPrice?.name}
                  </Text>
                  <Text
                    style={[
                      styles.menuLabel,
                      styles.txtThemeColor,
                      { marginRight: 10 },
                    ]}>
                    {formatNumber(detail?.[displayPrice?.value] || 0)}
                  </Text>
                  <Icon
                    type="FontAwesome"
                    name="angle-down"
                    size={20}
                    color={COLOR.THEME}
                  />
                </MenuTrigger>
                <MenuOptions
                  customStyles={{
                    optionsContainer: styles.menuContainer,
                  }}>
                  {arrDislayPrice.map(item => (
                    <MenuOption
                      key={item.id}
                      customStyles={{
                        optionWrapper: {
                          ...styles.optionMenu,
                          backgroundColor:
                            displayPrice?.id === item.id
                              ? '#E8E8E8'
                              : COLOR.WHITE,
                        },
                      }}
                      onSelect={() => {
                        setDisplayPrice(item);
                      }}>
                      <Text style={styles.optionMenuTxt}>{item.name}</Text>
                    </MenuOption>
                  ))}
                </MenuOptions>
              </Menu>
            </View>
          </TouchableOpacity>
        </View>

        <SectionFlashList
          data={groupsList}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?.id || JSON.stringify(item)}
          contentContainerStyle={{ paddingBottom: 100 }}
          stickySectionHeadersEnabled={true}
          renderItem={({ item, index, itemPosition }) => (
            <TouchableOpacity
              style={[
                styles.listItem,
                index === 0 && styles.itemFirst,
                itemPosition === 'last' && styles.itemLast,
              ]}
              onPress={() => {
                navigation.navigate('CreateOrEditClinicQueues', {
                  dataId: item.id,
                });
              }}>
              <View
                style={[
                  styles.listItemRow,
                  itemPosition === 'last' && { borderBottomWidth: 0 },
                ]}>
                <View style={{ width: scale(25) }}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="hospital-box"
                    size={scale(16)}
                    color={COLOR.ROOT_COLOR_SMOOTH}
                  />
                </View>
                <View style={styles.listItemCol}>
                  <Text style={styles.itemCode}>
                    {item.customers?.name ||
                      item.customers?.mobile ||
                      'Không rõ'}
                  </Text>
                  <Text style={styles.itemDate}>
                    {dayjs(item.dateScheduled).format('DD/MM/YYYY HH:mm')}
                  </Text>
                  <Text style={styles.itemDescription}>
                    {item.clinicServicePackages?.name || 'Chưa cập nhật'}
                  </Text>
                </View>

                <View style={[styles.listItemCol, { alignItems: 'flex-end' }]}>
                  <Text style={styles.itemPrice}>{item.customers?.mobile}</Text>
                  <Text
                    style={[
                      styles.itemStt,
                      { color: renderChangeStatus(item.status).color },
                    ]}>
                    {renderChangeStatus(item.status).status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={item => (
            <List.Subheader style={tw`bg-BG`}>
              {dayjs().isSame(item, 'day') ? 'Hôm nay' : customFormatDate(item)}
            </List.Subheader>
          )}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            if (hasNextPage) {
              // console.log('run next');
              fetchNextPage();
            }
          }}
          ListFooterComponent={
            isFetchingNextPage && (
              <ActivityIndicator color={'green'} size={'large'} />
            )
          }
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
                label="Bạn chưa có phiếu nhập nào"
                onRefresh={refetchByUser}
                icon={{
                  type: 'MaterialCommunityIcons',
                  name: 'home-import-outline',
                }}
              />
            );
          }}
        />
      </View>

      <RangeDatePicker
        value={dateRange}
        ref={calendarRef}
        onChange={e => {
          // console.log({ e });
          const fromDate = dayjs(e?.[0]).format('DD/MM/YYYY');
          const toDate = dayjs(e?.[1]).format('DD/MM/YYYY');
          setDateLabel(`${fromDate} - ${toDate}`);
          setDateRange(e);
        }}
      />

      <TouchableHighlight
        onPress={() => {
          navigation.navigate('CreateOrEditClinicQueues');
        }}
        style={styles.addBtn}
        underlayColor={COLOR.ROOT_COLOR_SMOOTH}>
        <Icon
          type="AntDesign"
          name="plus"
          color={COLOR.WHITE}
          size={scale(20)}
        />
      </TouchableHighlight>

      <FilterClinicQueues ref={refFilter} />
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
  },
  headerBtn: {
    width: scale(30),
    height: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backbtn: {
    width: '40@s',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
    width: '70@s',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: '18@s',
    fontFamily: 'Roboto_medium',
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
    width: '100%',
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
    fontFamily: 'Roboto_medium',
    marginBottom: '2@vs',
  },
  menuSubLabel: {
    fontFamily: 'Roboto_medium',
    fontSize: '10@s',
    color: COLOR.ROOT_COLOR_SMOOTH,
  },
  txtThemeColor: {
    color: COLOR.THEME,
  },
  sectionHeader: {
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
    backgroundColor: COLOR.BG,
  },
  sectionTitle: {
    textTransform: 'capitalize',
    fontSize: '13@s',
    fontFamily: 'Roboto_medium',
    color: COLOR.ROOT_COLOR_SMOOTH,
  },
  listItem: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
  },
  itemFirst: {
    borderTopLeftRadius: '15@s',
    borderTopRightRadius: '15@s',
  },
  itemLast: {
    borderBottomLeftRadius: '15@s',
    borderBottomRightRadius: '15@s',
    borderBottomWidth: 0,
  },

  listItemRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    paddingVertical: '10@vs',
  },
  listItemCol: {
    flex: 1,
  },
  itemCode: {
    fontSize: '14@s',
    fontFamily: 'Roboto_medium',
    marginBottom: '5@vs',
  },
  itemDate: {
    fontSize: '12@s',
    color: COLOR.ROOT_COLOR_SMOOTH,
  },
  itemDescription: {
    fontSize: '13@s',
  },
  itemPrice: {
    color: COLOR.THEME,
    fontFamily: 'Roboto_medium',
    fontSize: '14@s',
  },
  itemStt: {
    fontSize: '12@s',
  },

  addBtn: {
    position: 'absolute',
    bottom: '50@vs',
    right: '15@s',
    zIndex: 10,
    width: '50@s',
    height: '50@s',
    borderRadius: '50@s',
    backgroundColor: COLOR.THEME,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW_5,
  },
});

export default withMenuContext(ClinicQueues);
