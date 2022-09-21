import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Auth from '~/utils/Auth';
// import { useForm, Controller } from 'react-hook-form';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { SIZES, COLOR } from '~/utils/Values';
import { isIphoneXorAbove } from '~/utils/Values/sizes';
import Icon from '~/components/BasesComponents/Icon';
import dayjs from 'dayjs';
import regexHelper from '~/utils/regexHelper';
// import FormItem from '~/lib/Form/FormItem';
import Toast from '~/lib/RN-root-toast';
import Loading from '~/lib/RN-root-loading';
import Text from '~/utils/StyledText';
import tw from '~/lib/tailwind';

import { Form, FormItem, useForm } from '~/lib/RN-hook-form';

const { isfullName, isPhoneVN } = regexHelper;

export default function App({ navigation }) {
  const [form, setFormRef] = useForm();

  const onSubmit = async data => {
    // console.log('submit');
    // console.log({ data });
    const addItem = {
      fullname: data.fullname?.trim(),
      username: data.username?.trim(),
      password: data.password,
      mobile: data.mobile?.trim(),
      userGroupsId: 11,
      status: 1,
      image: null,
      dateUpdated: dayjs(),
    };
    // setSpinning(true);
    const spinner = Loading.show('Đang tạo tài khoản...');
    const res = await Auth.register(addItem);
    // setSpinning(false);
    Loading.hide(spinner);
    if (res?.success) {
      Toast.show('Tạo tài khoản thành công, mời bạn đăng nhập', {
        duration: 2000,
        position: Toast.positions.CENTER,
      });
      handleBack();
    } else {
      Toast.show(`${res?.error?.message || 'Đã xảy ra lỗi!'}`, {
        duration: 2000,
        position: Toast.positions.CENTER,
      });
    }
    // console.log({ res });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const handleSubmit = useCallback(form()?.handleSubmit(onSubmit), [formRef]);

  return (
    <ImageBackground
      resizeMethod="auto"
      resizeMode="cover"
      style={tw`flex-1 items-center pt-status-bar justify-center`}
      source={require('~/assets/bg.png')}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={tw`absolute-fill opacity-20 bg-BLACK z-0`} />
      </TouchableWithoutFeedback>
      <TouchableOpacity
        style={tw`absolute top-status-bar left-5 p-2 z-10`}
        onPress={handleBack}>
        <Icon type="AntDesign" name="left" size={24} color={COLOR.WHITE} />
      </TouchableOpacity>
      <Image
        source={require('~/assets/logo.png')}
        style={tw`w-full resize-contain mt-status-bar`}
      />
      <ScrollView style={tw`flex-1 w-full`}>
        <KeyboardAvoidingView
          style={tw`w-full`}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <Form style={tw`my-8 w-full items-center`} ref={setFormRef}>
            <FormItem
              style={tw`bg-transparent w-10/12 h-11 mb-4 flex-row items-center border-b border-WHITE`}
              errorTextStyle={{ marginTop: -10 }}
              name="fullname"
              rules={{
                required: {
                  value: true,
                  message: 'Vui lòng nhập họ tên',
                },
                pattern: {
                  value: isfullName,
                  message: 'Vui lòng nhập từ 3 đến 50 ký tự chỉ là chữ',
                },
              }}
              renderLabel={() => (
                <Icon
                  type="MaterialCommunityIcons"
                  name="format-color-text"
                  size={20}
                  color={tw.color('WHITE')}
                />
              )}>
              <TextInput
                autoCapitalize="none"
                placeholder="Họ và tên"
                spellCheck={false}
                style={tw`h-5 ml-2.5 text-WHITE w-full`}
                placeholderTextColor={'#ffffff9f'}
                keyboardType="default"
                returnKeyType="next"
                onSubmitEditing={() => form?.setFocus('username')}
              />
            </FormItem>
            <FormItem
              style={tw`bg-transparent w-10/12 h-11 mb-4 flex-row items-center border-b border-WHITE`}
              errorTextStyle={{ marginTop: -10 }}
              name="username"
              rules={{
                required: {
                  value: true,
                  message: 'Vui lòng nhập thông tin',
                },
                validate: value =>
                  value?.length > 5 || 'Độ dài phải ít nhất 6 ký tự',
              }}
              renderLabel={() => (
                <Icon
                  type="FontAwesome"
                  name="user-circle-o"
                  size={20}
                  color={tw.color('WHITE')}
                />
              )}>
              <TextInput
                autoCapitalize="none"
                placeholder="Tên đăng nhập"
                spellCheck={false}
                style={tw`h-5 ml-2.5 text-WHITE w-full`}
                placeholderTextColor={'#ffffff9f'}
                keyboardType="default"
                returnKeyType="next"
                onSubmitEditing={() => form?.setFocus('mobile')}
              />
            </FormItem>
            <FormItem
              style={tw`bg-transparent w-10/12 h-11 mb-4 flex-row items-center border-b border-WHITE`}
              errorTextStyle={{ marginTop: -10 }}
              renderLabel={() => (
                <Icon
                  type="Feather"
                  name="phone"
                  size={20}
                  color={tw.color('WHITE')}
                />
              )}
              name="mobile"
              rules={{
                required: {
                  value: true,
                  message: 'Vui lòng nhập số điện thoại',
                },
                pattern: {
                  value: isPhoneVN,
                  message: 'Vui lòng nhập đúng định dạng số điện thoại',
                },
              }}>
              <TextInput
                autoCapitalize="none"
                placeholder="Số điện thoại"
                spellCheck={false}
                style={tw`h-5 ml-2.5 text-WHITE w-full`}
                placeholderTextColor={'#ffffff9f'}
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => form?.setFocus('password')}
              />
            </FormItem>

            <FormItem
              style={tw`bg-transparent w-10/12 h-11 mb-4 flex-row items-center border-b border-WHITE`}
              errorTextStyle={{ marginTop: -10 }}
              renderLabel={() => (
                <Icon
                  type="FontAwesome5"
                  name="user-lock"
                  size={20}
                  color={tw.color('WHITE')}
                />
              )}
              name="password"
              rules={{
                required: {
                  value: true,
                  message: 'Vui lòng nhập mật khẩu',
                },
                validate: value =>
                  value?.length > 5 || 'Mật khẩu phải từ 6 ký tự',
              }}>
              <TextInput
                autoCapitalize="none"
                placeholder="Nhập mật khẩu bảo mật"
                spellCheck={false}
                textContentType="password"
                style={tw`h-5 ml-2.5 text-WHITE w-full`}
                placeholderTextColor={'#ffffff9f'}
                onSubmitEditing={() => form?.setFocus('password2')}
                secureTextEntry={true}
                returnKeyType="next"
              />
            </FormItem>
            <FormItem
              style={tw`bg-transparent w-10/12 h-11 mb-4 flex-row items-center border-b border-WHITE`}
              errorTextStyle={{ marginTop: -10 }}
              renderLabel={() => (
                <Icon
                  type="FontAwesome5"
                  name="user-lock"
                  size={20}
                  color={tw.color('WHITE')}
                />
              )}
              name="password2"
              rules={{
                required: {
                  value: true,
                  message: 'Vui lòng nhập lại mật khẩu',
                },
                validate: value =>
                  value === form?.getValues('password') ||
                  'Xác nhận mật khẩu phải giống mật khẩu',
              }}>
              <TextInput
                autoCapitalize="none"
                placeholder="Nhập lại mật khẩu"
                spellCheck={false}
                textContentType="password"
                style={tw`h-5 ml-2.5 text-WHITE w-full`}
                placeholderTextColor={'#ffffff9f'}
                onSubmitEditing={form?.handleSubmit(onSubmit)}
                secureTextEntry={true}
                returnKeyType="go"
              />
            </FormItem>
            <TouchableHighlight
              style={tw`bg-[#f8676e] w-10/12 h-13 mb-2.5 items-center justify-center mt-5`}
              underlayColor="#48528654"
              onPress={form?.handleSubmit(onSubmit)}>
              <Text style={tw`text-WHITE font-medium`}>Đăng ký</Text>
            </TouchableHighlight>
            <View style={tw`w-full flex-row items-center justify-center my-5`}>
              <Text style={tw`text-white mr-2`}>Bạn đã có tài khoản? </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                <Text style={tw`text-white font-medium underline`}>
                  Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>
          </Form>
        </KeyboardAvoidingView>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = ScaledSheet.create({
  container: {
    backgroundColor: COLOR.THEME,
    paddingTop: SIZES.HEIGHT_STATUSBAR,
    height: SIZES.HEIGHT_SCREEN,
    width: SIZES.WIDTH_WINDOW,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLOR.TRANSPARENT,
    opacity: 0.4,
    zIndex: 0,
  },

  backBtn: {
    position: 'absolute',
    top: SIZES.HEIGHT_STATUSBAR + 10,
    left: '8@s',
    padding: '5@s',
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: SIZES.HEIGHT_STATUSBAR,
  },
  form: {
    marginVertical: '30@vs',
    flex: 1,
  },
  inputView: {
    backgroundColor: 'transparent',
    width: '80%',
    height: '45@vs',
    marginBottom: '20@vs',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.WHITE,
  },

  TextInput: {
    height: '50@vs',
    flex: 1,
    marginLeft: '10@s',
    fontSize: '14@s',
    color: COLOR.WHITE,
  },
  groupBtn: {
    alignItems: 'center',
    flex: 1,
    marginTop: '30@vs',
  },
  btn: {
    backgroundColor: '#6b749f59',
    width: '100%',
    height: '45@vs',
    marginBottom: '10@vs',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    textTransform: 'uppercase',
    color: COLOR.WHITE,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: isIphoneXorAbove() ? '25@vs' : '15@vs',
    paddingHorizontal: '12@s',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '65%',
  },
  footerTxt: {
    color: COLOR.WHITE,
    fontSize: '12@s',
  },
});
