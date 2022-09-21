import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const Item = ({
  data,
  id,
  screen,
  cols,
  selectedIndex,
  image,
  mediaType,
  onClick,
  margin,
  selectedIcon,
  videoIcon,
}) => {
  const handleClick = () => {
    onClick(id);
  };

  const {
    Component: SelectedIndicator,
    color: SelectedColor,
    iconName: SelectedIconName,
    size: SelectedIconSize,
    bg: SelectedIconBg,
  } = selectedIcon;

  const {
    Component: VideoIndicator,
    color: VideoIndicatorColor,
    iconName: VideoIndicatorName,
    size: VideoIndicatorSize,
  } = videoIcon;

  const disabled = data?.width === 0 && data?.height === 0;

  return (
    <ItemContainer
      disabled={disabled}
      margin={margin}
      screen={screen}
      cols={cols}
      onPress={handleClick}>
      {mediaType === 'video' && (
        <MediaTypeVideo margin={margin}>
          {VideoIndicator && VideoIndicatorName && (
            <VideoIndicator
              name={VideoIndicatorName}
              size={VideoIndicatorSize}
              color={VideoIndicatorColor}
            />
          )}
        </MediaTypeVideo>
      )}
      {selectedIndex >= 0 && (
        <Selected selectionColor={SelectedIconBg} margin={margin}>
          {SelectedIndicator && SelectedIconName && (
            <SelectedIndicator
              name={SelectedIconName}
              size={SelectedIconSize}
              color={SelectedColor}
              index={selectedIndex}
            />
          )}
        </Selected>
      )}
      <Image source={{ uri: image }} />
      {disabled && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#00000033',
            zIndex: 1,
            margin: margin,
          }}>
          <Ionicons name="alert-circle-outline" size={24} color="#fff" />
          <Text style={{ fontSize: 12, color: '#fff', textAlign: 'center' }}>
            Lỗi khi tải phương tiện
          </Text>
        </View>
      )}
    </ItemContainer>
  );
};

const MemoizedAssetItem = memo(Item);

export const AssetList = ({
  margin,
  data,
  selectedItems,
  onClick,
  getMoreAssets,
  cols,
  screen,
  selectedIcon,
  videoIcon,
}) => {
  const _renderItem = ({ item }) => (
    <MemoizedAssetItem
      id={item.id}
      data={item}
      image={item.uri}
      mediaType={item.mediaType}
      selectedIndex={selectedItems.indexOf(item.id)}
      onClick={onClick}
      cols={cols}
      screen={screen}
      margin={margin}
      selectedIcon={selectedIcon}
      videoIcon={videoIcon}
    />
  );

  const _getItemLayout = (data, index) => {
    let length = screen / cols;
    return { length, offset: length * index, index };
  };

  return (
    <FlatList
      data={data}
      numColumns={cols}
      initialNumToRender={50}
      getItemLayout={_getItemLayout}
      renderItem={_renderItem}
      keyExtractor={item => item.id}
      extraData={selectedItems}
      onEndReached={() => getMoreAssets()}
      onEndReachedThreshold={0.5}
    />
  );
};

const Image = styled.Image`
  width: 100%;
  height: 100%;
`;

const MediaTypeVideo = styled.View`
  width: 25%;
  justify-content: center;
  align-items: center;
  height: 25%;
  position: absolute;
  z-index: 11;
  margin: ${({ margin }) => margin}px;
`;
const Selected = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: ${({ selectionColor }) =>
    selectionColor ? selectionColor : '#B14AC370'};
  margin: ${({ margin }) => margin}px;
`;

const ItemContainer = styled.TouchableOpacity`
  width: ${({ screen, cols }) => screen / cols}px;
  height: ${({ screen, cols }) => screen / cols}px;
  padding: ${({ margin }) => margin}px;
`;
