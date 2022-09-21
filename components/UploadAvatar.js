import React, { useState, useMemo, forwardRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import ProgressiveImage from '~/components/BasesComponents/ProgressiveImage';
import { ScaledSheet } from 'react-native-size-matters';
import { IMAGE_PROJECT, UPLOAD_FILE } from '@env';
import Auth from '~/utils/Auth';
import ModalSelectPickerImage from '~/components/ModalSelectPickerImage';
import * as ImagePicker from 'expo-image-picker';
import {
  getInfoFile,
  getLinkImg,
  getPermissionsLibrary,
  getPermissionsCamera,
} from '~/utils/utils';
import { useNavigation } from '@react-navigation/native';
import { Spinning } from '~/lib/supper-animation';
import Icon from '~/components/BasesComponents/Icon';

const UploadAvatar = ({ value, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error2, setError2] = useState(false);
  const configOption = useMemo(
    () => ({
      headers: {
        'x-auth-key': Auth.token,
        'Content-Type': 'multipart/form-data',
        'x-auth-project': IMAGE_PROJECT,
      },
      method: 'POST',
    }),
    [],
  );

  const onChoseFile = async () => {
    let isGranted = await getPermissionsLibrary();
    // console.log('isGranted',isGranted);
    if (isGranted) {
      // console.log('run');
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        allowsEditing: false,
      });

      setShowModal(false);
      // console.log('result',result);
      if (!result.cancelled) {
        saveImage(result);
      }
    }
  };

  const getPictureFromCamera = async () => {
    setShowModal(false);
    let isGranted = await getPermissionsCamera();
    // console.log('isGranted',isGranted);
    if (isGranted) {
      // console.log('run');
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        allowsEditing: false,
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
      _upload(_file);
    }
  };

  const _upload = async file => {
    const fd = new FormData();
    fd.append('file', file);
    const options = {
      ...configOption,
      body: fd,
    };
    setLoading(true);
    setError2(false);
    try {
      const response = await fetch(UPLOAD_FILE, options).then(_response =>
        _response.json(),
      );

      // console.log({ response });
      setLoading(false);
      if (response?.path) {
        // console.log('run');
        // setFileData(response);
        const newImage = {
          file: response?.path,
          extension: response?.mimetype,
        };
        onChange(newImage);
      } else {
        setError2(true);
      }
    } catch (e) {
      setLoading(false);
      setError2(true);
    }
  };

  // console.log(getLinkImg(value));
  return (
    <>
      <View style={styles.grAvata}>
        <TouchableOpacity
          disabled={!value?.file}
          style={[styles.imgUser, { backgroundColor: '#eee' }]}>
          <ProgressiveImage
            thumbnailSource={require('~/assets/unnamed.png')}
            source={{
              uri: getLinkImg(value),
            }}
            style={styles.imgUser}
          />
        </TouchableOpacity>

        {loading ? (
          <View style={[styles.containerLoading]}>
            <Spinning>
              <View style={[styles.loader]} />
            </Spinning>
          </View>
        ) : null}
        {error2 ? (
          <View style={[styles.containerLoading]}>
            <Icon type="Entypo" name="warning" size={20} color="red" />
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.changeAvata}
          onPress={() => {
            if (Platform.OS === 'ios') {
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
            } else {
              setShowModal(true);
            }
          }}>
          <Text style={styles.txtAvata}>Đổi ảnh đại diện</Text>
        </TouchableOpacity>
      </View>
      <ModalSelectPickerImage
        showAction={showModal}
        handleClose={() => setShowModal(false)}
        onChoseFile={onChoseFile}
        onChoseCamera={getPictureFromCamera}
      />
    </>
  );
};

const styles = ScaledSheet.create({
  imgUser: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  grAvata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  changeAvata: {
    marginLeft: 20,
    borderRadius: 4,
    borderColor: '#c7cad9',
    borderWidth: 0.7,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  txtAvata: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 0.28,
    color: '#1e3354',
  },
  containerLoading: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: '#ffffffa6',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  loader: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: 'blue',
  },
});

const RootElement = (props, ref) => {
  return <UploadAvatar {...props} innerRef={ref} />;
};
export default forwardRef(RootElement);
