import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import { SIZES, COLOR, SHADOW_2, SHADOW_5 } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';

import ProgressiveImage from '~/components/BasesComponents/ProgressiveImage';
import { formatNumber, getLinkImg } from '~/utils/utils';
import { medicines } from '~/queryHooks';
import { PAGE_SIZE } from '@env';
import _ from 'lodash';
import Button from '~/components/BasesComponents/Button';
import { useLayoutContext } from '~/layouts/ControlProvider';
import tw from '~/lib/tailwind';
import Text from '~/utils/StyledText';

const SearchMedicines = ({ navigation, route }) => {
  const { placeId } = useLayoutContext();
  const [searchString, setSearchString] = useState('');
  const [valueString, setValueString] = useState('');
  const inputRef = useRef();

  const filter = useMemo(() => {
    let tFilter = {
      nameOrRegOrCode: searchString,
      placesId: placeId,
    };
    if (!searchString?.trim()) {
      delete tFilter.nameOrRegOrCode;
    }

    return tFilter;
  }, [searchString, placeId]);

  const {
    isLoading,
    results,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = medicines.useInfinitiData({
    pageSize: PAGE_SIZE,
    params: {
      filter: JSON.stringify(filter),
    },
    key: `medicines-search-${searchString}`,
  });

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  }, []);

  // console.log({ hasNextPage });
  const search = value => {
    setSearchString(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFunction = useCallback(_.debounce(search, 300), []);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => {
            navigation.navigate('AddOrEditMedicine', {
              dataMedicine: item,
            });
          }}>
          <View style={styles.listItemRow}>
            {item.images?.length > 0 ? (
              <ProgressiveImage
                style={styles.listItemIcon}
                source={{ uri: getLinkImg(item.images) }}
              />
            ) : (
              <View style={styles.listItemIcon}>
                <Text style={styles.listItemIconText}>
                  {item.name?.slice(0, 1)}
                </Text>
              </View>
            )}

            <View style={styles.listItemCol}>
              <Text style={styles.listItemProduct}>
                {item.name} ({item.units?.unitsName || 'đơn vị'})
              </Text>
              <Text style={tw`text-[13px] text-gray-500 mt-1`}>
                Số Đk: {item.registrationNumber || 'Chưa cập nhật'}
              </Text>
              <Text style={tw`text-[13px] text-gray-500 mt-1`}>
                Nhà sản xuất: {item.producers?.name || 'Chưa cập nhật'}
              </Text>
              <Text style={tw`text-[13px] text-gray-500 mt-1`}>
                Xuất sứ: {item.madeIn || 'Chưa cập nhật'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  // console.log({ superClusterClusters });
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
        <View style={styles.boxSearch}>
          <Icon
            type="AntDesign"
            name="search1"
            size={scale(16)}
            color={COLOR.BLACK}
          />
          <TextInput
            ref={inputRef}
            placeholder="Tìm kiếm"
            value={valueString}
            onChangeText={text => {
              setValueString(text);
              debouncedFunction(text);
            }}
            style={styles.inputSearch}
          />
          <View style={{ flexDirection: 'row' }}>
            {!!searchString && (
              <Button
                style={[styles.btnSearch]}
                onPress={() => {
                  if (searchString) {
                    setSearchString('');
                    setValueString('');
                  }
                }}>
                <Icon
                  type="Ionicons"
                  name={'close'}
                  size={scale(20)}
                  color={COLOR.ROOT_COLOR_MAGENTA}
                />
              </Button>
            )}

            <Button style={styles.btnSearch}>
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
      <View style={styles.bodyPage}>
        <View style={styles.section}>
          <FlatList
            data={results}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 50 }}
            ListEmptyComponent={() => {
              if (isLoading) {
                return <ActivityIndicator color={'green'} size={'large'} />;
              } else if (searchString) {
                return (
                  <Text style={{ textAlign: 'center' }}>
                    Không tìm thấy kết quả nào
                  </Text>
                );
              }

              return null;
            }}
            renderItem={renderItem}
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
          />
        </View>
      </View>
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
  btnSearch: {
    width: '40@vs',
    height: '40@vs',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backbtn: {
    width: '30@s',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
    width: '100@s',
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
    fontFamily: 'Roboto_medium',
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
    marginTop: '10@vs',
    flex: 1,
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
    fontFamily: 'Roboto_medium',
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

  boxSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F6F7F8',
    paddingHorizontal: '8@s',
    borderRadius: 10,
  },
  inputSearch: {
    flex: 1,
    height: '40@vs',
    marginHorizontal: '5@s',
  },
});

export default SearchMedicines;
