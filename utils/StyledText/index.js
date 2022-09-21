import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

/* ở font open sans chỉ có 5 styles, còn mặc định của react-native có 9 styles
và kèm 2 styles mặc định ở đây chúng ta custom lại sao cho khớp với react-native */
const listFontWeight = {
  normal: '_normal',
  bold: '_bold',
  '100': '_thin',
  '200': '_extralight',
  '300': '_light',
  '400': '_normal',
  '500': '_medium',
  '600': '_semibold',
  '700': '_bold',
  '800': '_black',
  '900': '_black',
};

const listFont = {
  Roboto: 'Roboto',
  Times: 'Times',
};

/* chuyển fontWeight và fontStyle lại ban đầu
bởi vì chúng ta sử dụng fontFamily có kèm 2 thằng này rồi */
const disableStyles = {
  fontStyle: 'normal',
  fontWeight: 'normal',
};

export default function StyledText(props) {
  /* ở đây mình lấy giá trị fontWeight với fontStyle ra */
  const {
    fontWeight = '400',
    fontStyle,
    fontFamily = 'Roboto',
  } = StyleSheet.flatten(props.style || {});

  /* bây giờ mình thêm fontFamily vào với cú pháp font mình đã định trước
  cú pháp: tên font _ độ đậm _ italic (nếu có) */
  let _fontFamily = `${
    listFont[fontFamily] || ''
  }${`${listFontWeight[fontWeight]}`}${
    fontStyle === 'italic' ? '_italic' : ''
  }`;

  if (fontFamily.search('_') !== -1) {
    // console.log(fontFamily.search('_'));
    _fontFamily = fontFamily;
  }
  // console.log({ _fontFamily });

  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: _fontFamily }, disableStyles]}
    />
  );
}
