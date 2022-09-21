import React, { useCallback } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Text from '~/utils/StyledText';
import tw from '~/lib/tailwind';
import { FlashList } from '@shopify/flash-list';
import Icon from '~/components/BasesComponents/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WAREHOUSEID } from '@env';
import { useLayoutContext } from '~/layouts/ControlProvider';

const SelectPlaces = ({ navigation }) => {
  const { setWarehouseId, placeId } = useLayoutContext();
  const DATA = [
    {
      title: 'Kho vật tư',
    },
    {
      title: 'Kho Vũ Gia Anh',
    },
  ];

  // console.log({ placeId });

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Main');
            setWarehouseId('1');
            // AsyncStorage.removeItem('wareHomeId');
            AsyncStorage.setItem(WAREHOUSEID, '1');
          }}
          style={tw`border-b-07 border-b-gray-500 flex-row items-center justify-between`}>
          <Image
            style={tw`w-32 h-32 resize-contain`}
            source={require('~/assets/anh_1.jpg')}
          />
          <View style={tw`flex-row items-center`}>
            <Text style={tw`font-medium text-[16px] mr-2`}>{item.title}</Text>
            <Icon type="AntDesign" name="right" color="#000" size={20} />
          </View>
        </TouchableOpacity>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation],
  );

  return (
    <View style={tw`flex-1 bg-THEME`}>
      <View style={tw`flex-1 bg-white`}>
        <View
          style={tw`bg-THEME px-5 pt-status-bar pb-3 flex-row items-center`}>
          <TouchableOpacity
            style={tw`pr-2`}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon type="AntDesign" name="left" color="white" size={24} />
          </TouchableOpacity>
          <Text style={tw`text-white text-xl`}>Chọn kho</Text>
        </View>
        <View style={tw`flex-1 px-5 `}>
          <FlashList
            data={DATA}
            renderItem={renderItem}
            contentContainerStyle={tw``}
            estimatedItemSize={100}
          />
        </View>
      </View>
    </View>
  );
};

export default SelectPlaces;
