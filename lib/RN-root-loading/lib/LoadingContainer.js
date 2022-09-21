import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Easing,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
const TOAST_MAX_WIDTH = 0.8;
const TOAST_ANIMATION_DURATION = 200;

const positions = {
  TOP: 20,
  BOTTOM: -20,
  CENTER: 0,
};

const durations = {
  LONG: 3500,
  SHORT: 2000,
};

let styles = StyleSheet.create({
  defaultStyle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  containerStyle: {
    padding: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    opacity: 0.8,
    borderRadius: 5,
  },
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10,
  },
  textStyle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
});

class LoadingContainer extends Component {
  static displayName = 'LoadingContainer';

  static propTypes = {
    visible: PropTypes.bool,
    animation: PropTypes.bool,
    shadow: PropTypes.bool,
    backgroundColor: PropTypes.string,
    opacity: PropTypes.number,
    shadowColor: PropTypes.string,
    textColor: PropTypes.string,
    spinSize: PropTypes.string,
    spinColor: PropTypes.string,
    delay: PropTypes.number,
    onPress: PropTypes.func,
    onHide: PropTypes.func,
    onHidden: PropTypes.func,
    onShow: PropTypes.func,
    onShown: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    animation: true,
    spinSize: 'large',
    spinColor: '#fff',
    shadow: true,
    opacity: 0.8,
    delay: 0,
  };

  constructor() {
    super(...arguments);
    const window = Dimensions.get('window');
    this.state = {
      visible: this.props.visible,
      opacity: new Animated.Value(0),
      windowWidth: window.width,
      windowHeight: window.height,
      keyboardScreenY: window.height,
    };
  }

  componentDidMount = () => {
    this.dimensionListener = Dimensions.addEventListener(
      'change',
      this._windowChanged,
    );

    if (this.state.visible) {
      this._showTimeout = setTimeout(() => this._show(), this.props.delay);
    }
  };

  componentDidUpdate = prevProps => {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        clearTimeout(this._showTimeout);

        this._showTimeout = setTimeout(() => this._show(), this.props.delay);
      } else {
        this._hide();
      }

      this.setState({
        visible: this.props.visible,
      });
    }
  };

  componentWillUnmount = () => {
    this._hide();
    this.dimensionListener?.remove();
    this.keyboardListener?.remove();
  };

  _animating = false;
  _root = null;
  _showTimeout = null;
  _keyboardHeight = 0;

  _windowChanged = ({ window }) => {
    this.setState({
      windowWidth: window.width,
      windowHeight: window.height,
    });
  };

  _keyboardDidChangeFrame = ({ endCoordinates }) => {
    this.setState({
      keyboardScreenY: endCoordinates.screenY,
    });
  };

  _show = () => {
    clearTimeout(this._showTimeout);
    if (!this._animating) {
      this._animating = true;
      this._root.setNativeProps({
        pointerEvents: 'auto',
      });
      this.props.onShow && this.props.onShow(this.props.siblingManager);
      Animated.timing(this.state.opacity, {
        toValue: this.props.opacity,
        duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          this._animating = !finished;
          this.props.onShown && this.props.onShown(this.props.siblingManager);
        }
      });
    }
  };

  _hide = () => {
    clearTimeout(this._showTimeout);
    if (!this._animating) {
      if (this._root) {
        this._root.setNativeProps({
          pointerEvents: 'none',
        });
      }

      if (this.props.onHide) {
        this.props.onHide(this.props.siblingManager);
      }

      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          this._animating = false;
          this.props.onHidden && this.props.onHidden(this.props.siblingManager);
        }
      });
    }
  };

  render() {
    let { props } = this;

    return this.state.visible || this._animating ? (
      <View style={[styles.defaultStyle]}>
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.containerStyle,
              props.containerStyle,
              props.backgroundColor && {
                backgroundColor: props.backgroundColor,
              },
              {
                opacity: this.state.opacity,
              },
              props.shadow && styles.shadowStyle,
              props.shadowColor && { shadowColor: props.shadowColor },
            ]}
            pointerEvents="none"
            ref={ele => (this._root = ele)}>
            <ActivityIndicator
              size={props.spinSize}
              color={props.spinColor}
              animating={true}
            />
            {this.props.children?.length > 0 && (
              <Text
                style={[
                  styles.textStyle,
                  props.textStyle,
                  props.textColor && { color: props.textColor },
                ]}>
                {this.props.children}
              </Text>
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    ) : null;
  }
}

export default LoadingContainer;
export { positions, durations };
