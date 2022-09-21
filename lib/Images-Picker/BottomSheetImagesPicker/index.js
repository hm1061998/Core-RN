/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Keyboard,
  Dimensions,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import { getAssetsAsync, MediaType, addListener } from 'expo-media-library';
import { AssetList } from './AssetListBottomSheet';
import ErrorDisplay from '../ErrorDisplay';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImageManipulator from 'expo-image-manipulator';
import { TouchableRipple } from 'react-native-paper';

const SHEET_HEIGHT = 280;
const Index = ({ refCallback, onClose, onSubmit }) => {
  const position = useRef(-1);
  const mouting = useRef(false);
  // const [isShow, setIsShow] = useState(false);
  const insets = useSafeAreaInsets();

  // const myToast = useRef();

  const getScreen = () => Dimensions.get('screen');

  const { width, height } = useMemo(() => getScreen(), []);

  const COLUMNS = 4;

  const [selectedItems, setSelectedItems] = useState([]);

  const [permissions, setPermissions] = useState({
    hasMediaLibraryPermission: false,
  });

  const [availableOptions, setAvailableOptions] = useState({
    first: 100,
    totalCount: 0,
    after: '',
    endCursor: '',
    hasNextPage: true,
  });

  const [assetItems, setItems] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);

  const [error, setError] = useState({
    hasError: false,
    errorType: 'hasErrorWithPermissions',
  });

  useEffect(() => {
    mouting.current = true;
    const close = () => {
      if (position.current === -1) {
        refCallback.current?.snapToPosition(-height);
      }
    };
    Keyboard.addListener('keyboardDidHide', close);
    // const Subscription = addListener(() => {
    //   getAssets(20);
    //   console.log('run');
    // });
    return () => {
      Keyboard.removeListener('keyboardDidHide', close);
      // Subscription.remove();
      mouting.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSheetChange = useCallback(
    index => {
      // console.log('handleSheetChange', index);
      if (index === -1) {
        if (onClose) {
          onClose();
        }
        // setIsShow(false);
        setSelectedItems([]);
      } else {
        // setIsShow(true);
      }
      position.current = index;
    },
    [onClose],
  );

  const loadAssets = useCallback(
    async params => {
      getAssetsAsync(params)
        .then(({ endCursor, assets, hasNextPage }) => {
          if (mouting.current) {
            if (assets.length <= 0) {
              setLoading(false);
              return setError({
                hasError: true,
                errorType: 'hasNoAssets',
              });
            }
            if (availableOptions.after === endCursor) {
              return;
            }

            // console.log('assets', assets);
            setAvailableOptions({
              ...availableOptions,
              after: endCursor,
              hasNextPage: hasNextPage,
            });
            setLoading(false);
            return setItems([...assetItems, ...assets]);
          }
        })
        .catch(e => {
          if (mouting.current) {
            setLoading(false);
            setError({
              hasError: true,
              errorType: 'hasErrorWithLoading',
            });
          }
          // console.log('e', e);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetItems],
  );

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

  const getMediaLibraryPermission = useCallback(async () => {
    try {
      // const {
      //   status: MEDIA_LIBRARY,
      // } = await MediaLibrary.requestPermissionsAsync();
      const MEDIA_LIBRARY = await getPermissionsLibrary();
      if (!MEDIA_LIBRARY) {
        setLoading(false);
        setError({
          hasError: true,
          errorType: 'hasErrorWithPermissions',
        });
      }
      setPermissions({
        hasMediaLibraryPermission: MEDIA_LIBRARY,
      });
    } catch (err) {
      setError({
        hasError: true,
        errorType: 'hasErrorWithPermissions',
      });
    }
  }, []);

  const onClickUseCallBack = useCallback(id => {
    setSelectedItems(selectedItems => {
      const alreadySelected = selectedItems.indexOf(id) >= 0;
      if (selectedItems.length >= 10 && !alreadySelected) {
        return selectedItems;
      }
      if (alreadySelected) {
        return selectedItems.filter(item => item !== id);
      } else {
        return [...selectedItems, id];
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAssets(20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions.hasMediaLibraryPermission]);

  const getAssets = useCallback(
    (first = 100) => {
      try {
        if (availableOptions.hasNextPage) {
          const params = {
            first,
            mediaType: [MediaType.photo, MediaType.video],
            sortBy: ['creationTime'],
          };
          if (availableOptions.after) {
            params.after = availableOptions.after;
          }
          if (!availableOptions.hasNextPage) {
            return;
          }

          return permissions.hasMediaLibraryPermission
            ? loadAssets(params)
            : getMediaLibraryPermission();
        }
      } catch (err) {
        setError({
          hasError: true,
          errorType: 'hasErrorWithLoading',
        });
      }
    },
    [availableOptions, getMediaLibraryPermission, loadAssets, permissions],
  );

  const resizeImages = async (image, manipulate) => {
    try {
      const { base64, width, height, saveTo, compress } = manipulate;
      const saveFormat = saveTo
        ? saveTo === 'jpeg'
          ? ImageManipulator.SaveFormat.JPEG
          : ImageManipulator.SaveFormat.PNG
        : ImageManipulator.SaveFormat.JPEG;

      let sizeOptions = {
        width,
        height,
      };

      if ((!width && !height) || image.width <= 640) {
        sizeOptions.width = image.width;
        sizeOptions.height = image.height;
      }
      const options = [
        {
          resize: JSON.parse(JSON.stringify(sizeOptions)),
        },
      ];
      const format = {
        base64,
        compress,
        format: saveFormat,
      };
      return await ImageManipulator.manipulateAsync(image.uri, options, format);
    } catch (err) {
      setError({
        hasError: true,
        errorType: 'hasErrorWithResizing',
      });
      return image;
    }
  };

  const prepareResponse = useCallback(
    () =>
      assetItems
        .filter(asset => selectedItems.indexOf(asset.id) !== -1)
        .sort(
          (a, b) => selectedItems.indexOf(a.id) - selectedItems.indexOf(b.id),
        ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedItems],
  );

  const manipulateResults = () => {
    requestAnimationFrame(async () => {
      setSpinning(true);
      const selectedAssets = prepareResponse();
      const Resize = {
        width: 640,
        compress: 1,
        base64: false,
        saveTo: 'jpeg',
      };
      try {
        let modAssets = [];
        await asyncForEach(selectedAssets, async asset => {
          // console.log('asset', asset);
          // if (asset.mediaType === 'photo') {
          //   const resizedImage = await resizeImages(asset, Resize);
          //   modAssets.push(resizedImage);
          // } else {
          modAssets.push(asset);
          // }
        });
        return responseWithResults(modAssets);
      } catch (err) {
        setError({
          hasError: true,
          errorType: 'hasErrorWithResizing',
        });
        return responseWithResults(selectedAssets);
      } finally {
        if (mouting.current) {
          setSpinning(false);
        }
      }
    });
  };

  const responseWithResults = assets => {
    setSelectedItems([]);
    if (onSubmit) {
      onSubmit(assets);
    }

    // refCallback.current?.close();
  };

  const renderSheet = useMemo(() => {
    const Errors = {
      errorTextColor: 'black',
      errorMessages: {
        hasErrorWithPermissions: 'Please Allow media gallery permissions.',
        hasErrorWithLoading: 'There was error while loading images.',
        hasErrorWithResizing: 'There was error while loading images.',
        hasNoAssets: 'No images found.',
      },
    };

    const Styles = {
      margin: 2,
      bgColor: '#fff',
      spinnerColor: 'blue',
      widgetWidth: 99,
      videoIcon: {
        Component: Ionicons,
        iconName: 'ios-videocam',
        color: 'tomato',
        size: 20,
      },
      selectedIcon: {
        Component: Ionicons,
        iconName: 'ios-checkmark-circle-outline',
        color: 'white',
        bg: '#0eb14970',
        size: 26,
      },
    };
    return (
      <BottomSheet
        ref={refCallback}
        snapPoints={[SHEET_HEIGHT, height - (insets.top + 70)]}
        onChange={handleSheetChange}
        // index={-1}
        enablePanDownToClose={true}
        handleComponent={() => (
          <View style={styles.header}>
            <View style={styles.panelHeader}>
              <View style={styles.panelHandle} />
            </View>
          </View>
        )}
        detached={false}>
        <View style={[styles.bottomSheetContainer]}>
          <Screen>
            {isLoading ? (
              <Spinner />
            ) : error.hasError ? (
              <HasError>
                <ErrorDisplay
                  errorType={error?.errorType}
                  errorTextColor={Errors?.errorTextColor}
                  errorMessages={Errors?.errorMessages}
                />
              </HasError>
            ) : (
              <Widget>
                <AssetList
                  cols={COLUMNS}
                  margin={Styles.margin}
                  data={assetItems}
                  getMoreAssets={getAssets}
                  onClick={onClickUseCallBack}
                  selectedItems={selectedItems}
                  screen={(width * Styles.widgetWidth) / 100}
                  selectedIcon={Styles.selectedIcon}
                  videoIcon={Styles.videoIcon}
                />
              </Widget>
            )}
          </Screen>
        </View>
      </BottomSheet>
    );
  }, [
    assetItems,
    error,
    getAssets,
    handleSheetChange,
    height,
    insets,
    isLoading,
    onClickUseCallBack,
    refCallback,
    selectedItems,
    width,
  ]);

  return (
    <>
      {renderSheet}
      {selectedItems.length > 0 && (
        <View style={styles.SubmitContainer}>
          <TouchableRipple style={styles.Submit} onPress={manipulateResults}>
            {spinning ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={{ color: '#fff' }}>Gửi {selectedItems?.length}</Text>
            )}
          </TouchableRipple>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: '#FFF',
    height: '100%',
    // paddingTop: 0,
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: 'black',
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 10,
      },
    }),
  },
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000000',
    paddingTop: 5,
    marginBottom: 5,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 60,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#C7CAD9',
  },
  SubmitContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 20,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    padding: 24,
  },
  Submit: {
    backgroundColor: 'blue',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
});

const SpinnerStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const Spinner = ({ color }) => {
  return (
    <View style={[SpinnerStyle.container, SpinnerStyle.horizontal]}>
      <ActivityIndicator size="large" color={color || 'blue'} />
    </View>
  );
};

const HasError = styled.View`
  background-color: ${({ bgColor }) => bgColor || 'white'};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Screen = styled.View`
  background-color: ${({ bgColor }) => bgColor || 'white'};
  flex: 1;
`;

const Widget = styled.View`
  margin: 0 auto;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ bgColor }) => bgColor || 'white'};
  width: ${({ widgetWidth }) => widgetWidth || 100}%;
  flex: 1;
`;

export default React.memo(Index);
