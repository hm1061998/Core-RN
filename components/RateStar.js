import React from 'react';
import { View, Text } from 'react-native';
import Icon from '~/components/BasesComponents/Icon';
import { ScaledSheet } from 'react-native-size-matters';
import { COLOR } from '~/utils/Values';

const RateStar = ({ starNumber, textStyle }) => {
  const renderStar = val => {
    if (!val || val === 0) {
      return (
        <View
          style={{
            flex: 1,
          }}>
          <Text style={[styles.subInfo, textStyle]}>Chưa có đánh giá nào</Text>
        </View>
      );
    }
    const checkVal = val.toString().indexOf('.') !== -1;
    const numStar = Math.trunc(val);
    const otherStar = checkVal ? 5 - (1 + numStar) : 5 - numStar;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {new Array(numStar).fill(0).map((item, index) => (
          <View key={index} style={{ marginHorizontal: 2 }}>
            <Icon type="FontAwesome" name="star" size={16} color="#FFA501" />
          </View>
        ))}
        {checkVal ? (
          <View style={{ marginHorizontal: 2 }}>
            <Icon
              type="FontAwesome"
              name="star-half-o"
              size={16}
              color="#FFA501"
            />
          </View>
        ) : null}
        {new Array(otherStar).fill(0).map((item, index) => (
          <View style={{ marginHorizontal: 2 }} key={index}>
            <Icon type="FontAwesome" name="star-o" size={16} color="#FFA501" />
          </View>
        ))}

        <Text style={[styles.subInfo, { marginLeft: 10 }, textStyle]}>
          {val}
        </Text>
      </View>
    );
  };

  return renderStar(starNumber);
};

const styles = ScaledSheet.create({
  subInfo: {
    color: COLOR.WHITE,
    fontSize: '10@s',
    lineHeight: '18@vs',
  },
});
export default RateStar;
