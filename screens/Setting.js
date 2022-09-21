import React, { useCallback } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Text from '~/utils/StyledText';
import tw from '~/lib/tailwind';
import { FlashList } from '@shopify/flash-list';
import Icon from '~/components/BasesComponents/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WAREHOUSEID } from '@env';
import { useLayoutContext } from '~/layouts/ControlProvider';

const Setting = ({ navigation }) => {
  // console.log({ placeId });

  return (
    <View style={tw`flex-1 bg-THEME  pt-status-bar`}>
      <View style={tw`flex-1 bg-BG`}>
        <View style={tw`bg-WHITE px-5 py-3 flex-row items-center`}>
          <TouchableOpacity
            style={tw`pr-2`}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon type="AntDesign" name="left" color="#000" size={24} />
          </TouchableOpacity>
          <Text style={tw`text-BLACK text-xl`}>Cài đặt</Text>
        </View>
        <View style={tw`flex-1 px-5 `}>
          <Text>Chức năng đang cập nhật</Text>
        </View>
      </View>
    </View>
  );
};

export default Setting;
