/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

import Icon from '~/components/BasesComponents/Icon';
import { useDispatch, useSelector } from 'react-redux';
import ViewSpinning from '~/components/ViewSpinning';
import tw from '~/lib/tailwind';
import Text from '~/utils/StyledText';
import { useLayoutContext } from '~/layouts/ControlProvider';
const Index = ({ visible, setVisible }) => {
  const dispatch = useDispatch();
  const { placeId } = useLayoutContext();
  const [fields, setFields] = useState({
    name: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const addItem = {
      ...fields,
      status: true,
      placesId: placeId,
    };
    dispatch({
      type: 'units/add',
      payload: addItem,
      callback: result => {
        setLoading(false);
        if (result && result.success === true) {
          // parentCallback(result && result.result && result.result.id);
          Alert.alert(
            'Thông báo',
            'Thêm đơn vị tính thành công',
            [
              {
                text: 'OK',
                onPress: () => {
                  setVisible(false);
                },
              },
            ],
            { cancelable: false },
          );
        } else if (result && result.success === false) {
          // notification.error({ message: result && result.error && result.error.message, placement: 'bottomRight', style: { background: '#fff1f0' } });
          Alert.alert(
            'Thông báo',
            result && result.error && result.error.message,
            [
              {
                text: 'OK',
              },
            ],
            { cancelable: false },
          );
        }
      },
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      transparent
      onRequestClose={() => setVisible(false)}>
      <ViewSpinning spinning={loading} />

      <KeyboardAvoidingView
        style={tw`flex-1 items-center justify-center`}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={tw`absolute-fill bg-BLACK opacity-50`} />
        </TouchableWithoutFeedback>

        <View
          style={tw`w-full items-center justify-center bg-WHITE py-15 rounded-xl`}>
          <TouchableOpacity
            style={tw`absolute top-3 right-6 z-10`}
            onPress={() => setVisible(false)}>
            <Icon type="AntDesign" name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={tw`mb-5 font-bold text-[22px]`}>
            Thêm nhanh đơn vị tính
          </Text>
          <TextInput
            onChangeText={text => setFields({ ...fields, name: text })}
            style={tw`border w-[300px] text-center h-[40px] text-BLACK`}
          />
          <TouchableOpacity
            disabled={fields?.name === '' || !fields.name}
            style={tw.style(
              'mt-5 items-center justify-center bg-THEME rounded-lg h-8 flex-row px-2.5',
              {
                opacity: fields?.name === '' || !fields.name ? 0.5 : 1,
              },
            )}
            onPress={() => handleSubmit()}>
            <Icon type="FontAwesome" name="save" size={15} color="#fff" />
            <Text style={tw`text-WHITE ml-2`}>Lưu lại</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default Index;
