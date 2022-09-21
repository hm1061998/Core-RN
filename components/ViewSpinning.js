import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Modal } from 'react-native';

const Index = ({ spinning, spinColor, spinSize, message }) => {
  return (
    <Modal
      visible={spinning}
      statusBarTranslucent
      transparent
      animationType="none">
      <View
        style={styles.viewSpin}
        pointerEvents={spinning ? 'box-only' : 'none'}>
        {/* <View style={styles.bg} /> */}
        <View style={styles.boxSpin}>
          <ActivityIndicator
            size={spinSize || 'large'}
            color={spinColor || '#0000ff'}
            animating={spinning}
          />
          {!!message && <Text style={styles.spinText}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(Index);
const styles = StyleSheet.create({
  viewSpin: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    opacity: 0.5,
  },
  boxSpin: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 20,
    minWidth: 150,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinText: {
    color: '#fff',
    marginTop: 10,
  },
});
