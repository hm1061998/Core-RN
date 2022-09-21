import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

const Index = ({ showAction, handleClose, onChoseFile, onChoseCamera }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (showAction) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [showAction]);

  const onSelectCamera = () => {
    handleClose();
    onChoseCamera();
  };

  const onSelectImage = () => {
    onChoseFile();
    // handleClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="none"
      statusBarTranslucent
      visible={modalVisible}
      onRequestClose={handleClose}>
      <View style={styles.centeredView}>
        {modalVisible ? (
          <TouchableWithoutFeedback
            onPress={() => {
              handleClose();
            }}>
            <View style={styles.bg} />
          </TouchableWithoutFeedback>
        ) : null}
        <View style={styles.modalView}>
          <TouchableHighlight
            style={[styles.button, styles.buttonCancel]}
            onPress={onSelectCamera}
            underlayColor="#00000033">
            <Text style={[styles.textStyle]}>Chụp ảnh</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, styles.buttonSubmit]}
            underlayColor="#00000033"
            onPress={onSelectImage}>
            <Text style={[styles.textStyle]}>Thư viện ảnh</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    backgroundColor: '#000000',
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
    // zIndex: 10,
  },
  modalView: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 4,
    width: '90%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 10,
  },

  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textStyle: {
    color: 'gray',
    fontSize: 16,
    fontFamily: 'Roboto_medium',
  },
});
export default Index;
