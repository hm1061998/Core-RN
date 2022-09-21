import React, { useRef, forwardRef } from 'react';
import {
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ImageBackground,
} from 'react-native';

import Auth from '~/utils/Auth';
import * as GoogleSesstion from 'expo-auth-session/providers/google';
// import * as AppleAuthentication from 'expo-apple-authentication';
// import * as WebBrowser from 'expo-web-browser';
// import * as Facebook from 'expo-facebook';
import { LoginManager, Profile } from 'react-native-fbsdk-next';
import {
  GOOGLE_iosStandaloneAppClientId,
  GOOGLE_androidStandaloneAppClientId,
  GOOGLE_webClientId,
  JWT_SECRET,
} from '@env';
import { useUpdateLayoutEffect } from '~/utils/hooks';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { SIZES, COLOR, isIphoneXorAbove } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import * as jwt from 'react-native-pure-jwt';
import { GoogleIcon } from '~/utils/icon';
import Toast from '~/lib/RN-root-toast';
import Loading from '~/lib/RN-root-loading';
import { Form, FormItem, WrapFormItem, useForm } from '~/lib/RN-hook-form';
import tw from '~/lib/tailwind';
import Text from '~/utils/StyledText';

const CheckBoxForm = forwardRef(({ onValueChange, value }, ref) => (
  <TouchableOpacity
    style={tw`flex-row flex-1 items-center`}
    onPress={() => onValueChange(!value)}>
    <View
      style={tw`bg-${
        value ? 'blue-500' : 'white'
      } mr-2 w-4 h-4 items-center justify-center rounded-sm`}>
      <Icon type="Ionicons" name="checkmark" size={16} color="#fff" />
    </View>

    <Text style={tw`text-WHITE`}>Lưu</Text>
  </TouchableOpacity>
));

// WebBrowser.maybeCompleteAuthSession();
const Login = ({ navigation }) => {
  const spinner = useRef();
  const [form, setFormRef] = useForm();

  // console.log({ form });

  const [_request, response, promptAsync] = GoogleSesstion.useAuthRequest({
    iosClientId: GOOGLE_iosStandaloneAppClientId,
    androidClientId: GOOGLE_androidStandaloneAppClientId,
    expoClientId: GOOGLE_webClientId,
  });

  useUpdateLayoutEffect(() => {
    if (response?.type === 'success') {
      googleLogin(response);
    } else {
      spinner.current && Loading.hide(spinner.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const facebookLogIn = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
      ]);

      if (result.isCancelled) {
      } else {
        // setSpinning(true);
        spinner.current = Loading.show('Đang lấy thông tin người dùng');
        const currentProfile = await Profile.getCurrentProfile();
        Loading.hide(spinner.current);
        // console.log({ currentProfile });
        if (currentProfile) {
          const params = {
            name: currentProfile?.name,
            id: currentProfile?.userID,
            imageURL: currentProfile?.imageURL,
            referralSocial: 'facebook',
          };
          onCreateTokenLogin(params);
        } else {
        }
      }
    } catch (error) {
      if (spinner.current) {
        Loading.hide(spinner.current);
      }

      Toast.show(`Facebook Login Error: ${error.message}` || 'Đã xảy ra lỗi', {
        duration: 2000,
        position: Toast.positions.CENTER,
      });
    }
  };

  const googleLogin = async _response => {
    try {
      const { access_token } = _response.params;

      fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
      )
        .then(response => response.json())
        .then(data => {
          Loading.hide(spinner.current);
          // setSpinning(false);

          const params = {
            ...data,
            id: data.sub,
            referralSocial: 'google',
          };
          onCreateTokenLogin(params);
        });
    } catch (e) {
      Loading.hide(spinner.current);
      Toast.show(`Google Login Error: ${e.message}` || 'Đã xảy ra lỗi', {
        duration: 2000,
        position: Toast.positions.CENTER,
      });
    }
  };

  // const appleLogin = async () => {
  //   try {
  //     spinner.current = Loading.show('Đang lấy thông tin người dùng');
  //     const credential = await AppleAuthentication.signInAsync({
  //       requestedScopes: [
  //         AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
  //         AppleAuthentication.AppleAuthenticationScope.EMAIL,
  //       ],
  //     });
  //     Loading.hide(spinner.current);

  //     const params = {
  //       id: credential?.user,
  //       name: `${credential?.fullName?.familyName} ${credential?.fullName?.givenName}`,
  //       referralSocial: 'apple',
  //     };
  //     onCreateTokenLogin(params);
  //     // console.log({ credential });
  //     // signed in
  //   } catch (e) {
  //     Loading.hide(spinner.current);
  //     if (e.code === 'ERR_CANCELED') {
  //       // handle that the user canceled the sign-in flow
  //     } else {
  //       // handle other errors
  //     }
  //   }
  // };

  const onCreateTokenLogin = async record => {
    // console.log({ record });
    const body = {
      image: {
        file:
          record.referralSocial === 'facebook'
            ? record?.picture?.data?.url || record?.imageURL
            : record?.picture,
        extension: '',
      },
      name: record?.name,
    };

    if (record.referralSocial === 'facebook') {
      body.facebookId = record.id;
    }
    if (record.referralSocial === 'google') {
      body.googleId = record.id;
    }

    const token = await jwt.sign(body, JWT_SECRET);

    // console.log({ token });
    // setSpinning(true);
    spinner.current = Loading.show('Đang đăng nhập', {
      duration: 0,
    });
    const res = await Auth.signInWithSocical({ params: { token } }, () => {
      // setSpinning(false);
      Loading.hide(spinner.current);
    });

    if (res?.success) {
    } else {
      Toast.show(res?.error?.message || 'Đã xảy ra lỗi', {
        duration: 1000,
        position: Toast.positions.CENTER,
      });
    }
    // console.log('result', result);
  };

  const onSubmit = async data => {
    const { userName, password, rememberMe } = data;

    // console.log(form.current.getValues(['userName', 'password']));
    // console.log({ data });
    // return;
    Keyboard.dismiss();
    spinner.current = Loading.show('Đang đăng nhập', {
      duration: 0,
    });

    const res = await Auth.signInWithUser(
      {
        userName,
        password,
        rememberMe,
      },
      () => {
        Loading.hide(spinner.current);
        // form?.resetFields();
      },
    );

    // console.log(res);
    if (res?.success) {
      // Object.keys(data).map(key => setValue(key, ''));
    } else {
      Toast.show(res?.error?.message || 'Đã xảy ra lỗi Khi đăng nhập', {
        duration: 1000,
        position: Toast.positions.CENTER,
      });
    }
  };

  // return null;
  return (
    <ImageBackground
      resizeMethod="auto"
      resizeMode="cover"
      style={tw`flex-1 items-center pt-status-bar justify-center`}
      source={require('~/assets/bg.png')}>
      {/* <Loading visible={true} /> */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={tw`absolute-fill opacity-20 bg-BLACK z-0`} />
      </TouchableWithoutFeedback>
      <Image
        source={require('~/assets/logo.png')}
        style={tw`w-full resize-contain`}
      />

      <Form
        style={tw`my-8`}
        ref={setFormRef}
        defaultValues={{
          rememberMe: true,
        }}>
        <FormItem
          style={tw`bg-transparent w-9/12 h-11 mb-4 flex-row items-center border-b border-WHITE`}
          errorTextStyle={{ marginTop: -10 }}
          name="userName"
          rules={{
            required: {
              value: true,
              message: 'Vui lòng nhập email hoặc sđt',
            },
            validate: value =>
              value?.length > 5 || 'Độ dài phải ít nhất 6 ký tự',
          }}
          renderLabel={() => (
            <Icon
              type="Fontisto"
              name="email"
              size={20}
              color={tw.color('WHITE')}
            />
          )}>
          <TextInput
            autoCapitalize="none"
            placeholder="Tên tài khoản"
            spellCheck={false}
            style={tw`h-5 ml-2.5 text-WHITE w-full`}
            keyboardType="default"
            placeholderTextColor={'#ffffff9f'}
            returnKeyType="next"
            onSubmitEditing={() => form?.setFocus('password')}
          />
        </FormItem>

        <FormItem
          style={tw`bg-transparent w-9/12 h-11 mb-4 flex-row items-center border-b border-WHITE`}
          errorTextStyle={{ marginTop: -10 }}
          name="password"
          rules={{
            required: {
              value: true,
              message: 'Vui lòng nhập email hoặc sđt',
            },
          }}
          renderLabel={() => (
            <Icon
              type="Feather"
              name="lock"
              size={20}
              color={tw.color('WHITE')}
            />
          )}>
          <TextInput
            autoCapitalize="none"
            placeholder="Nhập mật khẩu bảo mật"
            spellCheck={false}
            textContentType="password"
            style={tw`h-5 ml-2.5 text-WHITE w-full`}
            placeholderTextColor={'#ffffff9f'}
            onSubmitEditing={form?.handleSubmit(onSubmit)}
            secureTextEntry={true}
          />
        </FormItem>

        <View style={tw`w-10/12 flex-row justify-between my-4`}>
          <FormItem name="rememberMe" handleChange="onValueChange">
            <CheckBoxForm />
          </FormItem>
          <TouchableOpacity style={tw`flex-1 items-end `}>
            <Text style={tw`text-WHITE`}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </Form>

      <View style={tw`w-full items-center`}>
        <TouchableHighlight
          style={tw`bg-[#f8676e] w-10/12 h-13 mb-2.5 items-center justify-center`}
          underlayColor="#48528654"
          onPress={form?.handleSubmit(onSubmit)}>
          <Text style={tw`text-WHITE font-medium`}>Đăng nhập</Text>
        </TouchableHighlight>

        <View style={tw`w-full flex-row items-center justify-center my-5`}>
          <Text style={tw`text-white mr-2`}>Bạn muốn tạo tài khoản? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SingUp');
            }}>
            <Text style={tw`text-white font-medium underline`}>Đăng ký</Text>
          </TouchableOpacity>
        </View>

        <Text style={tw`text-white my-3`}>Hoặc</Text>

        <View style={tw`w-10/12 flex-row justify-center items-center mt-5`}>
          <TouchableHighlight
            style={tw`w-10 h-10 rounded-full items-center justify-center bg-[#3F52B9] mr-5`}
            underlayColor="#48528654"
            onPress={() => {
              facebookLogIn();
            }}>
            <Icon type="FontAwesome" name="facebook-f" color="#fff" size={24} />
          </TouchableHighlight>
          <TouchableHighlight
            style={tw`w-10 h-10 rounded-full items-center justify-center bg-white`}
            underlayColor="#48528654"
            onPress={() => {
              spinner.current = Loading.show('Đang xác thực');
              promptAsync();
            }}>
            <GoogleIcon width="24" height="24" />
          </TouchableHighlight>
          {/* {Platform.OS === 'ios' && !Platform.isPad && (
            <TouchableHighlight
              style={tw`w-10 h-10 rounded-full items-center justify-center bg-white ml-5`}
              underlayColor="#48528654"
              onPress={appleLogin}>
              <Icon type="AntDesign" name="apple1" size={24} color="black" />
            </TouchableHighlight>
          )} */}
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;
