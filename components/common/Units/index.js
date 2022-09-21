import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { SIZES, COLOR } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import Button from '~/components/BasesComponents/Button';
import { units } from '~/queryHooks';
import { PAGE_SIZE } from '@env';
import _ from 'lodash';
import { useRefreshOnFocus, useRefreshByUser } from '~/utils/hooks';
import { useLayoutContext } from '~/layouts/ControlProvider';
import tw from '~/lib/tailwind';
import Text from '~/utils/StyledText';
import ScreenAnimModal from '~/components/BasesComponents/ScreenAnimModal';
import Create from './Create';
import { listPickerModalStyles as styles } from '~/utils/styles';

const SelectSuppliers = forwardRef(
  (
    {
      value,
      onChange,
      style,
      placeholder,
      placeholderStyle,
      disabled,
      dataPackagesUnits,
      dataPackagesUnitsObject,
      dataUnits,
    },
    ref,
  ) => {
    const [searchString, setSearchString] = useState('');
    const [valueString, setValueString] = useState('');
    const [visible, setVisible] = useState(false);
    const { placeId } = useLayoutContext();
    const inputRef = useRef();
    const modalRef = useRef();
    const createRef = useRef();

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
    } = units.useInfinitiData({
      pageSize: PAGE_SIZE,
      params: {
        filter: JSON.stringify(filter),
        sort: JSON.stringify(['name', 'ASC']),
      },
      key: ['units', filter],
    });

    useRefreshOnFocus(refetch);

    useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true);
      },
      hide: () => {
        setVisible(false);
      },
    }));

    const search = value => {
      setSearchString(value);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFunction = useCallback(_.debounce(search, 300), []);

    const resultData = useMemo(() => {
      const tdataValue =
        (dataUnits && dataUnits.map(item => item.unitsId)) || [];
      const dataValue = tdataValue.filter(x => x !== value?.id);
      let data = [];
      if (dataPackagesUnits && dataPackagesUnits.length > 0) {
        data = results.filter(x => dataPackagesUnits.includes(x.id));
      } else {
        data = results;
      }
      if (dataUnits && dataValue.length > 0) {
        data = data.filter(x => !dataValue.includes(x.id));
      }
      if (dataPackagesUnitsObject && dataPackagesUnitsObject.length > 0) {
        let dataItem = [];
        dataPackagesUnitsObject.map(item => {
          if (item.id && item.id !== '') {
            dataItem = [...dataItem, item];
          }
        });
        data = [...dataItem];
      }
      return data;
    }, [
      dataPackagesUnits,
      dataPackagesUnitsObject,
      dataUnits,
      results,
      value?.id,
    ]);

    // console.log({ resultData });
    return (
      <>
        <Button
          disabled={disabled}
          onPress={() => setVisible(true)}
          style={style}>
          <View
            style={tw`flex-row items-center justify-between flex-1 opacity-${
              disabled ? 50 : 100
            }`}>
            <Text
              style={[placeholderStyle, !value?.id && { opacity: 0.5 }]}
              numberOfLines={1}>
              {value?.name || placeholder || 'Chọn dữ liệu'}
            </Text>
            {!disabled && (
              <Icon
                type="FontAwesome"
                name="angle-right"
                size={scale(18)}
                color={COLOR.ROOT_COLOR_SMOOTH}
              />
            )}
          </View>
        </Button>

        <ScreenAnimModal
          ref={modalRef}
          visible={visible}
          onClose={() => setVisible(false)}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backbtn}
              onPress={() => {
                modalRef.current?.close();
              }}>
              <Icon
                type="FontAwesome"
                name="angle-left"
                size={scale(24)}
                color={COLOR.BLACK}
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Chọn đơn vị</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => {
                  createRef.current?.show();
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
                data={resultData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <Button
                    style={styles.wrapItem}
                    onPress={() => {
                      onChange?.({ id: item.id, name: item.name });
                      modalRef.current?.close();
                    }}>
                    <Text style={styles.name}>{item.name}</Text>

                    <View style={{ width: 30 }}>
                      {value?.id === item.id && (
                        <Icon
                          type="AntDesign"
                          name="check"
                          size={scale(20)}
                          color={COLOR.THEME}
                        />
                      )}
                    </View>
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
          <Create ref={createRef} />
        </ScreenAnimModal>
      </>
    );
  },
);

export default SelectSuppliers;
