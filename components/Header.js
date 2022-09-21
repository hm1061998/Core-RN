import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { COLOR, SIZES, SHADOW_2 } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import { ScaledSheet } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title }) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
  return (
    <View style={styles.header}>
      <Text style={styles.label}>{title}</Text>
      <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
        <Icon type="Feather" name="arrow-left" size={24} color={COLOR.BLACK} />
      </TouchableOpacity>
    </View>
  );
};

const styles = ScaledSheet.create({
  header: {
    backgroundColor: COLOR.WHITE,
    paddingBottom: '10@vs',
    paddingTop: SIZES.HEIGHT_STATUSBAR + 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW_2,
  },
  backBtn: {
    position: 'absolute',
    top: SIZES.HEIGHT_STATUSBAR + 10,
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
});

export default Header;
