import React from 'react';
import { View, Text } from 'react-native';
import { COLOR, SIZES } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import Button from '~/components/BasesComponents/Button';
import { ScaledSheet } from 'react-native-size-matters';

const ListEmpty = ({ label, onRefresh, icon }) => {
  return (
    <View style={styles.container}>
      <Icon
        type={icon?.type || 'AntDesign'}
        name={icon?.name || 'dropbox'}
        size={150}
        color={COLOR.THEME}
      />
      <Text style={styles.emptyLabel}>
        {label || 'Bạn chưa có phiếu trả hàng nhập nào'}
      </Text>
      <Button
        style={styles.reloadBtn}
        onPress={() => {
          onRefresh?.();
        }}>
        <Text style={styles.reloadText}>Bấm để tải lại</Text>
      </Button>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    width: '100%',
    height: SIZES.HEIGHT_WINDOW - SIZES.HEIGHT_PADDINGTOP * 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.WHITE,
    marginTop: '10@vs',
  },
  emptyLabel: {
    fontSize: '13@s',
    color: COLOR.ROOT_COLOR_SMOOTH,
  },
  reloadBtn: {
    marginTop: '10@vs',
  },
  reloadText: {
    fontSize: '13@s',
    color: COLOR.THEME,
    fontFamily: 'Roboto_medium',
  },
});

export default ListEmpty;
