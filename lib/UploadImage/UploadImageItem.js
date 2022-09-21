import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import LightBox from '~/lib/react-native-lightbox';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { getLinkImg } from '~/utils/utils';
import { widthPercentageToDP } from '~/utils/responsive';
import FastImage from 'react-native-fast-image';
// import Lightbox from 'react-native-lightbox-v2';

const Index = ({ data, onDelete }) => {
  const renderImage = useMemo(() => {
    return (
      <LightBox
        activeProps={{
          style: styles.imageActive,
        }}>
        <FastImage
          style={[styles.img]}
          source={{
            uri: data?.path || getLinkImg(data?.uri),
          }}
        />
      </LightBox>
    );
  }, [data]);
  // console.log('render', getLinkImg(data?.path));
  return (
    <View style={[styles.boxImage]}>
      {data?.status !== 'uploading' && (
        <TouchableOpacity
          style={styles.delete}
          onPress={() => {
            if (onDelete) {
              onDelete(data);
            }
          }}>
          <Ionicons name="close-outline" size={13} color="#fff" />
        </TouchableOpacity>
      )}
      {data?.status === 'uploading' ? (
        <View style={[styles.containerLoading]}>
          <ActivityIndicator size="small" color="blue" />
        </View>
      ) : null}
      {data?.status === 'failed' ? (
        <View style={[styles.containerLoading]}>
          <Entypo name="warning" size={20} color="red" />
        </View>
      ) : null}
      {renderImage}
    </View>
  );
};

const styles = StyleSheet.create({
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
    zIndex: 10,
  },
  boxImage: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP(15),
    height: widthPercentageToDP(15),
    marginRight: 8,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  img: {
    width: widthPercentageToDP(15),
    height: widthPercentageToDP(15),
    borderRadius: 4,
    borderWidth: 0.7,
    borderColor: '#c7cad9',
  },
  containerLoading: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: '#ffffffa6',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: 'blue',
  },
  delete: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    backgroundColor: 'gray',
    borderRadius: 100,
    zIndex: 11,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayVideo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000063',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
});
export default React.memo(Index);
