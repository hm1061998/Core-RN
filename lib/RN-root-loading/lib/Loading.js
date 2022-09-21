import React, { Component } from 'react';
import RootSiblings from 'react-native-root-siblings';
import LoadingContainer, { positions, durations } from './LoadingContainer';

class Loading extends Component {
  static displayName = 'Loading';
  static propTypes = LoadingContainer.propTypes;
  static positions = positions;
  static durations = durations;

  static show = (
    message,
    options = { position: positions.BOTTOM, duration: durations.SHORT },
  ) => {
    return new RootSiblings(
      (
        <LoadingContainer {...options} visible={true}>
          {message}
        </LoadingContainer>
      ),
    );
  };

  static hide = loading => {
    if (loading instanceof RootSiblings) {
      loading.destroy();
    } else {
      console.warn(
        `Loading.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof loading}\` instead.`,
      );
    }
  };

  _loading = new RootSiblings(
    <LoadingContainer {...this.props} duration={0} />,
  );

  UNSAFE_componentWillReceiveProps = nextProps => {
    this._loading.update(<LoadingContainer {...nextProps} duration={0} />);
  };

  componentWillUnmount = () => {
    this._loading.destroy();
  };

  render() {
    return null;
  }
}

export { RootSiblings as Manager };
export default Loading;
