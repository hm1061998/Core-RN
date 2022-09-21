import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import BottomSheetModal from '~/components/Common/BottomSheetModal';
import { COLOR, SIZES } from '~/utils/Values';

const LogoutModal = ({
  innerRef,
  handleSubmit,
  handleCancel,
  title,
  subTitle,
  submitText,
  cancelText,
}) => {
  const onCancel = () => {
    innerRef.current?.close?.();
    handleCancel?.();
  };

  const onSubmit = () => {
    handleSubmit?.();
    innerRef.current?.close?.();
  };

  return (
    <BottomSheetModal
      ref={innerRef}
      sheetHeight={190}
      containerStyle={{
        alignItems: 'center',
      }}
      handleClose={handleCancel}
      bottomSheetStyle={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.label}>{title}</Text>
          {!!subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
        </View>

        <View style={styles.content}>
          <TouchableOpacity style={styles.addressItem} onPress={onSubmit}>
            <Text style={styles.addressName}>{submitText || 'Đăng xuất'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addressItem} onPress={onCancel}>
            <Text style={styles.addressName}>{cancelText || 'Hủy'}</Text>
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
    height: 180,
  },

  header: {
    backgroundColor: COLOR.WHITE,
    paddingVertical: '10@vs',
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
    color: COLOR.BLACK,
    fontFamily: 'Roboto_medium',
  },
  subTitle: {
    alignItems: 'center',
    marginTop: '5@vs',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainerStyle: {
    paddingHorizontal: '15@s',
  },

  addressItem: {
    paddingVertical: '10@vs',
    alignItems: 'center',
    width: '100%',
  },
  addressName: {
    fontSize: '14@s',
  },
});

export default LogoutModal;
