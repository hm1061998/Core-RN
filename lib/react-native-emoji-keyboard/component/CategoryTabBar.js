import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { isIphoneXorAbove } from '../utils';
import { IconType } from '../constant';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  tabs: {
    height: 30,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: isIphoneXorAbove() ? 15 : 5,
  },
  scrollView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    marginLeft: 10,
  },
  backsplace: {
    marginRight: 20,
  },
});

let timer;
const CategoryTabBar = ({
  goToPage,
  activeTab,
  tabBarStyle,
  categories,
  onRemove,
  hideBackSpace,
  categoryDefautColor,
  categoryHighlightColor,
  categoryIconSize,
}) => {
  // set default method for remove
  const clickRemove = () => {
    if (typeof onRemove !== 'function') {
      console.log('missing remove callback');
    } else {
      onRemove();
    }
  };

  // console.log('tabs', tabs);
  return (
    <View style={[styles.tabs, tabBarStyle]}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {categories.map((iconObj, i) => {
          const iconColor =
            activeTab === i ? categoryHighlightColor : categoryDefautColor;
          const { iconType, icon } = iconObj;
          return (
            <TouchableOpacity
              key={iconObj.name}
              onPress={() => requestAnimationFrame(() => goToPage(i))}
              style={styles.tab}>
              {iconType === IconType.material ? (
                <MaterialCommunityIcons
                  name={icon}
                  size={categoryIconSize}
                  color={iconColor}
                />
              ) : iconType === IconType.fontAwesome ? (
                <FontAwesome
                  name={icon}
                  size={categoryIconSize}
                  color={iconColor}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {!hideBackSpace && (
        <TouchableOpacity
          style={styles.backsplace}
          onPress={() =>
            requestAnimationFrame(() => {
              clickRemove();
            })
          }
          onLongPress={() => {
            requestAnimationFrame(() => {
              timer = setInterval(() => {
                clickRemove();
              }, 100);
            });
          }}
          onPressOut={() => {
            clearInterval(timer);
          }}>
          <MaterialCommunityIcons
            name={'backspace-outline'}
            size={24}
            color={'#000'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(CategoryTabBar);
