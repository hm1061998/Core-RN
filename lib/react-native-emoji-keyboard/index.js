import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import emojiSource from 'emoji-datasource';
import _ from 'lodash';
import ScrollableTabView from '~/lib/react-native-scrollable-tab-view';
import {
  isIphoneXorAbove,
  isAndroid,
  handleDefaultEmoji,
  handleCustomEmoji,
} from './utils';
import CategoryTabBar from './component/CategoryTabBar';
import CategoryView from './component/CategoryView';
import { defaultProps, storage_key } from './constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EAEBEF',
    width: width,
    position: 'absolute',
    zIndex: 999,
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 0,
  },
});

const EmojiBoard = (
  {
    showBoard = false,
    showTabbar = true,
    showHistory = false,
    customEmoji = [],
    categories = defaultProps.categories,
    blackList = defaultProps.blackList,
    numRows = 6,
    numCols = 5,
    emojiSize = 24,
    onClick,
    onRemove,
    tabBarPosition = 'bottom',
    hideBackSpace = false,
    categoryDefautColor = '#aaa',
    categoryHighlightColor = '#000',
    categoryIconSize = 20,
    containerStyle = {},
    tabBarStyle = {},
    labelStyle = {},
    onLayout,
    duration = 300,
    onOpen,
    onClose,
  },
  ref,
) => {
  // emoji board height only for android
  const containerHeight = showTabbar
    ? numCols * 40 + 45 + 40
    : numCols * 40 + 45;
  const animationOffset = containerHeight + 100;
  const isShow = useRef(false);
  const noHasHistory = useRef(false);
  const [emojiData, setEmojiData] = useState(null);
  const [emojiDataHistory, setEmojiDataHistory] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [position] = useState(
    new Animated.Value(showBoard ? 0 : -animationOffset),
  );

  const [opacity, setOpacity] = useState(false);

  useImperativeHandle(ref, () => ({
    show: onShow,
    hide: onHide,
    toogle: onToogle,
  }));

  useEffect(() => {
    let data;
    if (customEmoji.length) {
      data = handleCustomEmoji(customEmoji, blackList);
    } else {
      data = handleDefaultEmoji(emojiSource, blackList);
    }

    // console.log('data', data);
    setEmojiData(Object.assign({}, data));
    if (showHistory) {
      loadHistoryAsync();
    } else {
      setIsLoaded(true);
    }

    if (onLayout) {
      onLayout(containerHeight);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onShow = () => {
    if (!isShow.current) {
      if (onOpen) {
        onOpen();
      }

      // console.log('run');
      setOpacity(true);
      Animated.timing(position, {
        duration,
        toValue: 0,
        useNativeDriver: false,
      }).start(() => (isShow.current = true));
    }
  };

  const onHide = () => {
    if ((isShow.current = true)) {
      if (onClose) {
        onClose();
      }
      Animated.timing(position, {
        duration,
        toValue: -animationOffset,
        useNativeDriver: false,
      }).start(() => {
        setOpacity(false);
        if (noHasHistory.current && showHistory) {
          loadHistoryAsync();
          noHasHistory.current = false;
        }
        isShow.current = false;
      });
    }
  };

  const onToogle = () => {
    if (isShow.current) {
      onHide();
    } else {
      onShow();
    }
  };

  const addToHistoryAsync = async emoji => {
    let history = await AsyncStorage.getItem(storage_key);

    let value = [];
    if (!history) {
      // no history
      let record = Object.assign({}, emoji, { count: 1 });
      value.push(record);
    } else {
      let json = JSON.parse(history);
      if (json.filter(r => r.code === emoji.code).length > 0) {
        value = json;
      } else {
        let record = Object.assign({}, emoji, { count: 1 });
        value = [record, ...json];
      }
    }

    AsyncStorage.setItem(storage_key, JSON.stringify(value));
    if (!noHasHistory.current) {
      setEmojiDataHistory(value);
    }
  };

  const loadHistoryAsync = async () => {
    let result = await AsyncStorage.getItem(storage_key);
    if (result) {
      let history = JSON.parse(result);
      setEmojiDataHistory(history);
    } else {
      noHasHistory.current = true;
    }
    setIsLoaded(true);
  };

  const handlePressEmoji = useCallback(
    emoji => {
      requestAnimationFrame(() => {
        if (showHistory) {
          addToHistoryAsync(emoji);
        }
        onClick(emoji);
      });
    },
    [showHistory, onClick],
  );

  const _categories = useMemo(() => {
    let list = categories;
    if (!showHistory || !emojiDataHistory) {
      list = list.filter(e => e.name !== 'history');
    }
    return list;
  }, [showHistory, categories, emojiDataHistory]);

  const groupsView = useMemo(() => {
    let list = [];
    // console.log(emojiData);
    if (emojiData) {
      _.each(_categories, (category, key) => {
        const { name } = category;
        // console.log(category);
        const _data = name === 'history' ? emojiDataHistory : emojiData[name];
        list.push(
          <CategoryView
            category={name}
            emojis={_data || []}
            numRows={numRows}
            numCols={numCols}
            emojiSize={emojiSize}
            key={name}
            tabLabel={name}
            labelStyle={labelStyle}
            onClick={handlePressEmoji}
            showTabbar={showTabbar}
          />,
        );
      });
    }

    return list.map(item => item);
  }, [
    _categories,
    emojiDataHistory,
    emojiData,
    emojiSize,
    handlePressEmoji,
    numCols,
    numRows,
    showTabbar,
    labelStyle,
  ]);

  if (!emojiData || !isLoaded) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: position,
          height: containerHeight,
          opacity: opacity ? 1 : 0,
        },
        containerStyle,
      ]}>
      <ScrollableTabView
        tabBarPosition={tabBarPosition}
        renderTabBar={() => (
          <CategoryTabBar
            categories={_categories}
            onRemove={onRemove}
            hideBackSpace={hideBackSpace}
            tabBarStyle={tabBarStyle}
            categoryDefautColor={categoryDefautColor}
            categoryHighlightColor={categoryHighlightColor}
            categoryIconSize={categoryIconSize}
          />
        )}
        initialPage={0}
        style={styles.scrollTable}>
        {groupsView}
      </ScrollableTabView>
    </Animated.View>
  );
};

export default forwardRef(EmojiBoard);
