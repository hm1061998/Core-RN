import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { TouchableOpacity, Text, View, ActionSheetIOS } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import BottomSheetModal from '~/components/Common/BottomSheetModal';
import { COLOR, SIZES, isAndroid } from '~/utils/Values';
import * as ImagePicker from 'expo-image-picker';
import { getInfoFile } from '~/utils/utils';

const PickerImage = ({ onChange }, ref) => {
  const sheetRef = useRef();

  useImperativeHandle(ref, () => ({
    show: () => {
      if (isAndroid()) {
        sheetRef.current?.show();
      } else {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Hủy', 'Chụp ảnh', 'Thư viện ảnh'],
            // destructiveButtonIndex: 2,
            cancelButtonIndex: 0,
            userInterfaceStyle: 'dark',
          },
          buttonIndex => {
            if (buttonIndex === 0) {
              // cancel action
            } else if (buttonIndex === 1) {
              getPictureFromCamera();
            } else if (buttonIndex === 2) {
              onChoseFile();
            }
          },
        );
      }
    },
    close: () => {},
  }));

  const getPermissionsLibrary = async () => {
    let isGranted = false;
    const stt = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (stt?.status !== 'granted') {
      let mStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mStatus?.status === 'granted') {
        isGranted = true;
      }
    } else {
      isGranted = true;
    }
    return isGranted;
  };

  const getPermissionsCamera = async () => {
    let isGranted = false;
    const stt = await ImagePicker.getCameraPermissionsAsync();
    if (stt?.status !== 'granted') {
      let mStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (mStatus?.status === 'granted') {
        isGranted = true;
      }
    } else {
      isGranted = true;
    }
    return isGranted;
  };

  const onChoseFile = async () => {
    let isGranted = await getPermissionsLibrary();
    // console.log('isGranted',isGranted);
    if (isGranted) {
      // console.log('run');
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
        allowsEditing: true,
      });

      handleBack();
      // console.log('result',result);
      if (!result.cancelled) {
        saveImage(result);
      }
    }
  };

  const getPictureFromCamera = async () => {
    let isGranted = await getPermissionsCamera();
    // console.log('isGranted',isGranted);
    if (isGranted) {
      // console.log('run');
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
        quality: 1,
        allowsEditing: true,
      });
      // console.log('result',result);
      if (!result.cancelled) {
        saveImage(result);
      }
    }
  };

  const saveImage = async rec => {
    if (rec) {
      let newImg = rec;
      const _file = getInfoFile(newImg);
      onChange?.(_file);
    }
  };

  const handleBack = () => {
    sheetRef.current?.close?.();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      sheetHeight={200}
      containerStyle={{
        alignItems: 'center',
      }}
      bottomSheetStyle={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.label}>Chọn ảnh đại diện</Text>
        </View>

        <View>
          <TouchableOpacity
            style={styles.addressItem}
            onPress={getPictureFromCamera}>
            <Text style={styles.addressName}>Chụp ảnh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addressItem} onPress={onChoseFile}>
            <Text style={styles.addressName}>Chọn từ thư viện</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addressItem} onPress={handleBack}>
            <Text style={styles.addressName}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = ScaledSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
    width: SIZES.WIDTH_WINDOW - scale(40),
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  header: {
    backgroundColor: COLOR.WHITE,
    paddingVertical: '10@vs',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN,
  },
  backBtn: {
    position: 'absolute',
    top: '10@vs',
    paddingHorizontal: '15@s',
    zIndex: 10,
  },
  label: {
    fontSize: '16@s',
    textAlign: 'center',
    flex: 1,
    color: COLOR.BLACK,
    fontFamily: 'Roboto_medium',
  },

  contentContainerStyle: {
    paddingHorizontal: '15@s',
    paddingBottom: '25@vs',
  },

  addressItem: {
    paddingVertical: '10@vs',
    alignItems: 'center',
  },
});

export default forwardRef(PickerImage);
