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
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { SIZES, COLOR } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';

import { suppliers } from '~/queryHooks';
import { PAGE_SIZE } from '@env';
import _ from 'lodash';
import Button from '~/components/BasesComponents/Button';
import { useRefreshOnFocus, useRefreshByUser } from '~/utils/hooks';
import { useLayoutContext } from '~/layouts/ControlProvider';

const SelectSuppliers = ({ navigation, route }) => {
  const [searchString, setSearchString] = useState('');
  const [valueString, setValueString] = useState('');
  const { placeId } = useLayoutContext();
  const inputRef = useRef();

  const { initialValue, fieldName } = route.params || {};

  const filter = useMemo(() => {
    let tFilter = {
      name: searchString,
      status: true,
      placesId: placeId,
    };
    if (!searchString) {
      delete tFilter.name;
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
  } = suppliers.useInfinitiData({
    pageSize: PAGE_SIZE,
    params: {
      filter: JSON.stringify(filter),
      sort: JSON.stringify(['dateCreated', 'desc']),
    },
    key: ['suppliers', filter],
  });

  useRefreshOnFocus(refetch);

  // console.log({ results });

  const search = value => {
    setSearchString(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFunction = useCallback(_.debounce(search, 300), []);

  // console.log({ superClusterClusters });
  return (
    <View style={styles.container}>
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

        <Text style={styles.headerTitle}>Chọn nhà cung cấp</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateOrEditSuppliers');
            }}>
            <Icon
              type="AntDesign"
              name="plus"
              size={scale(18)}
              color={COLOR.BLACK}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bodyPage}>
        <View style={styles.containerSearch}>
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
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <Button
                style={styles.wrapItem}
                onPress={() => {
                  // updateFormStore({
                  //   [fieldName]: {
                  //     id: item.id,
                  //     name: item.customersName,
                  //   },
                  // });
                  navigation.goBack();
                }}>
                <View>
                  <Text style={styles.name}>{item.customersName}</Text>
                  <Text style={[styles.name, styles.txtThemeColor]}>
                    {item.mobile}
                  </Text>
                </View>

                {(initialValue === item.id || initialValue?.id === item.id) && (
                  <Icon
                    type="AntDesign"
                    name="check"
                    size={scale(20)}
                    color={COLOR.THEME}
                  />
                )}
              </Button>
            )}
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
    paddingTop: SIZES.HEIGHT_STATUSBAR + 5,
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
    flex: 1,
  },
  bodyPage: {
    flex: 1,
    backgroundColor: COLOR.BG,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  containerSearch: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
  },
  boxSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F8',
    paddingHorizontal: '8@s',
    borderRadius: 10,
  },
  inputSearch: {
    flex: 1,
    height: '35@vs',
    marginHorizontal: '5@s',
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '10@vs',
    backgroundColor: COLOR.WHITE,
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  icon: {
    marginHorizontal: 8,
  },
  name: {
    fontSize: '13@s',
    marginLeft: '8@s',
    fontFamily: 'Roboto_medium',
  },
  checkbox: {
    width: '16@s',
    height: '16@s',
    borderRadius: '16@s',
  },
});

export default SelectSuppliers;
