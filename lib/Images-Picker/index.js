import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, View, ActivityIndicator, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { getAssetsAsync, getAssetInfoAsync } from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { AssetList } from './AssetList';
import DefaultTopNavigator from './Navigator';
import * as ImageManipulator from 'expo-image-manipulator';
import ErrorDisplay from './ErrorDisplay';

const AssetsSelector = ({
  Resize,
  Settings,
  Errors,
  Styles,
  Navigator,
  CustomNavigator,
}) => {
  const getScreen = () => Dimensions.get('screen');

  const { width, height } = useMemo(() => getScreen(), []);

  const COLUMNS =
    height >= width ? Settings.portraitCols : Settings.landscapeCols;

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

  const [error, setError] = useState({
    hasError: false,
    errorType: 'hasErrorWithPermissions',
  });

  const loadAssets = useCallback(
    async params => {
      getAssetsAsync(params)
        .then(({ endCursor, assets, hasNextPage }) => {
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
        })
        .catch(e => {
          // console.log('e', e);
          setLoading(false);
          setError({
            hasError: true,
            errorType: 'hasErrorWithLoading',
          });
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

      // alert(JSON.stringify(MEDIA_LIBRARY));
      // console.log('MEDIA_LIBRARY', MEDIA_LIBRARY);
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
      if (selectedItems.length >= Settings.maxSelection && !alreadySelected) {
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
    Errors.onError?.();
    getAssets(Settings.initialLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Settings.assetsType, permissions.hasMediaLibraryPermission]);

  const getAssets = (first = 100) => {
    try {
      if (availableOptions.hasNextPage) {
        const params = {
          first,
          mediaType: Settings.assetsType,
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
  };

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

      if (!width && !height) {
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

  const manipulateResults = async source => {
    setLoading(true);
    const selectedAssets = prepareResponse();
    try {
      const selectedItemsMetaData = [];
      if (Settings.getImageMetaData && !Resize) {
        await asyncForEach(selectedAssets, async asset => {
          const metaAsset = await getAssetInfoAsync(asset);
          selectedItemsMetaData.push(metaAsset);
        });
        return responseWithResults(source, selectedItemsMetaData);
      }
      if (Resize) {
        let modAssets = [];
        await asyncForEach(selectedAssets, async asset => {
          if (asset.mediaType === 'photo') {
            const resizedImage = await resizeImages(asset, Resize);
            modAssets.push(resizedImage);
          } else {
            modAssets.push(asset);
          }
        });
        return responseWithResults(source, modAssets);
      }
      return responseWithResults(source, selectedAssets);
    } catch (err) {
      setError({
        hasError: true,
        errorType: 'hasErrorWithResizing',
      });
      return responseWithResults(source, selectedAssets);
    } finally {
      setLoading(false);
    }
  };

  const responseWithResults = (navigation, assets) => {
    const _default = navigation === 'default';
    return _default
      ? Navigator?.onSuccess(assets)
      : CustomNavigator?.props.onSuccess(assets);
  };
  return (
    <Screen bgColor={Styles.bgColor}>
      {CustomNavigator?.Component && (
        <CustomNavigator.Component
          {...CustomNavigator.props}
          selected={selectedItems.length}
          onSuccess={() => manipulateResults('custom')}
        />
      )}
      {Navigator && (
        <DefaultTopNavigator
          Texts={Navigator.Texts}
          selected={selectedItems.length}
          onBack={() => Navigator.onBack()}
          midTextColor={Navigator.midTextColor || 'black'}
          onSuccess={() => manipulateResults('default')}
          minSelection={Navigator.minSelection}
          buttonTextStyle={Navigator.buttonTextStyle}
          buttonStyle={Navigator.buttonStyle}
        />
      )}

      {isLoading ? (
        <Spinner color={Styles.spinnerColor} />
      ) : error.hasError ? (
        <HasError bgColor={Styles.bgColor}>
          <ErrorDisplay
            errorType={error.errorType}
            errorTextColor={Errors.errorTextColor}
            errorMessages={Errors.errorMessages}
          />
        </HasError>
      ) : (
        <Widget widgetWidth={Styles.widgetWidth} bgColor={Styles.bgColor}>
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
  );
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

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

const Spinner = ({ color }) => {
  return (
    <View style={[SpinnerStyle.container, SpinnerStyle.horizontal]}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
};

const HasError = styled.View`
  background-color: ${({ bgColor }) => bgColor};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Screen = styled.View`
  background-color: ${({ bgColor }) => bgColor};
  flex: 1;
`;

const Widget = styled.View`
  margin: 0 auto;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ bgColor }) => bgColor};
  width: ${({ widgetWidth }) => widgetWidth || 100}%;
  flex: 1;
`;

export default AssetsSelector;
