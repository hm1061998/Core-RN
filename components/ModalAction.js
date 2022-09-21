import React from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

const Index = ({
  visible,
  onSubmit,
  onCancel,
  title,
  cancelText,
  submitText,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent>
      <View style={styles.centeredView}>
        {visible ? (
          <TouchableWithoutFeedback onPress={onCancel}>
            <View style={styles.bg} />
          </TouchableWithoutFeedback>
        ) : null}
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{title}</Text>
          <View style={styles.groupbtn}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onCancel}>
              <Text style={[styles.textStyle, styles.blackText]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSubmit]}
              onPress={onSubmit}>
              <Text style={[styles.textStyle, styles.redText]}>
                {submitText}
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 4,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  groupbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.7,
    borderTopColor: '#c7cad9',
  },
  button: {
    flex: 1,
    padding: 15,
  },
  buttonCancel: {
    borderRightWidth: 0.3,
    borderRightColor: '#c7cad9',
  },
  buttonSubmit: {
    borderLeftWidth: 0.3,
    borderLeftColor: '#c7cad9',
  },
  textStyle: {
    color: 'red',
    fontFamily: 'Roboto_medium',
    textAlign: 'center',
  },
  modalText: {
    marginVertical: 20,
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  blackText: {
    color: '#000000',
  },
  redText: {
    color: '#FA634D',
  },
});

Index.defaultProps = {
  visible: false,
  title: 'Something...',
  cancelText: 'Cancel',
  submitText: 'Ok',
};
Index.propTypes = {
  visible: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  cancelText: PropTypes.string,
  submitText: PropTypes.string,
};
export default Index;
