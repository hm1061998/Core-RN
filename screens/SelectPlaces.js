import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '~/utils/StyledText';
import tw from '~/lib/tailwind';
import { FlashList } from '@shopify/flash-list';
import Icon from '~/components/BasesComponents/Icon';
import { places } from '~/queryHooks';
import { PAGE_SIZE, PLACEID } from '@env';
import { useLayoutContext } from '~/layouts/ControlProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const SelectPlaces = ({ navigation }) => {
  const { setPlaceId } = useLayoutContext();
  const { currentUser } = useSelector(state => state.user);
  // console.log(currentUser);
  const results = currentUser?.places || [];

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            setPlaceId(item.id);
            AsyncStorage.setItem(PLACEID, item.id);
            navigation.replace('SelectWareHouses');
          }}
          style={tw`border-b-07 border-b-gray-500 py-3 flex-row items-center justify-between px-5`}>
          <View>
            <Text style={tw`font-medium text-[16px]`}>{item.name}</Text>
            <Text style={tw`text-blue-700 font-medium`}>{item.mobile}</Text>
            <Text>{item.address}</Text>
          </View>
          <View>
            <Icon
              type="AntDesign"
              name="right"
              color={tw.color('gray-500')}
              size={20}
            />
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
        <View style={tw`bg-THEME px-5 pt-status-bar pb-3`}>
          <Text style={tw`text-white text-xl`}>Chọn cơ sở</Text>
        </View>
        <View style={tw`flex-1`}>
          <FlashList
            data={results}
            renderItem={renderItem}
            estimatedItemSize={100}
          />
        </View>
      </View>
    </View>
  );
};

export default SelectPlaces;
