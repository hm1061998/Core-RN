/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import Regex from '~/utils/regexHelper';
import Icon from '~/components/BasesComponents/Icon';
import { COLOR, SHADOW_3, SIZES } from '~/utils/Values';
import UploadAvatar from '~/components/UploadAvatar';
import ModalAction from '~/components/ModalAction';
import Auth from '~/utils/Auth';
import { ScaledSheet, scale } from 'react-native-size-matters';
import ViewSpinning from '~/components/ViewSpinning';
import tw from '~/lib/tailwind';
import { Form, FormItem, useForm } from '~/lib/RN-hook-form';
import { useLayoutContext } from '~/layouts/ControlProvider';
import { updateStatus } from '~/services/auth';
import Text from '~/utils/StyledText';

const mWidth = Dimensions.get('window').width;
const { isfullName, isEmail, isPhoneVN } = Regex;
const UserInformation = ({ navigation }) => {
  const [form, setFormRef] = useForm();
  const { expoPushToken } = useLayoutContext();
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModal2, setVisibleModal2] = useState(false);
  const [saveAction, setSaveAction] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const hasChanged = useRef(false);

  useEffect(() => {
    const subscription = form?.watch((value, { name, type }) => {
      hasChanged.current = true;
    });
    return () => subscription?.unsubscribe();
  }, [form]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', handleGoBack);
    return unsubscribe;
  }, [navigation, handleGoBack]);

  const onSubmit = async data => {
    const { fullname, email, mobile, image } = data;

    try {
      const params = {
        ...data,
        fullname: fullname?.trim(),
        email: email?.trim(),
        mobile: mobile?.trim(),
        userGroupsId: currentUser?.userGroupsId,
        status: currentUser?.status,
        id: currentUser?.id,
        dateUpdated: dayjs(),
      };
      // spinner.current?.show({
      //   message: '??ang c???p nh???t',
      // });

      // console.log({ params });
      hasChanged.current = false;
      setSpinning(true);
      const res = await Auth.updateProfile({ params, id: currentUser.id });
      setSpinning(false);
      if (res?.success) {
        Alert.alert('C???p nh???t th??ng tin th??nh c??ng', null, [
          {
            text: 'Ok',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('???? s???y ra l???i', `${res?.error?.message}`, [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
        ]);
      }
    } catch (error) {
      // spinner.current?.hide();
      Alert.alert('???? s???y ra l???i: ', JSON.stringify(error));
    }
  };

  const disableAccount = async () => {
    setSpinning(true);
    await updateStatus(currentUser?.id, {
      dateUpdated: dayjs(),
      status: -1,
    });
    setSpinning(false);
    setVisibleModal2(false);
    Auth.signOut({ clientId: expoPushToken });
  };

  const handleGoBack = useCallback(e => {
    if (hasChanged.current) {
      e?.preventDefault();
      setVisibleModal(true);
      setSaveAction(e.data.action);
    }
  }, []);

  // console.log({ currentUser });
  return (
    <View style={tw.style('flex-1 bg-THEME pt-status-bar')}>
      <ViewSpinning spinning={spinning} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backbtn}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon
            type="FontAwesome"
            name="angle-left"
            size={scale(24)}
            color={COLOR.BLACK}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>T??i kho???n</Text>
        {/* <View style={styles.headerRight}>
          <TouchableOpacity onPress={form?.handleSubmit(onSubmit)}>
            <Text style={styles.saveTxt}>L??u</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={tw`bg-WHITE flex-1 overflow-hidden`}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={tw`flex-1`}>
          <ScrollView>
            <Form
              ref={setFormRef}
              defaultValues={{
                image: currentUser?.image || {},
                username: currentUser?.username || '',
                fullname: currentUser?.fullname || '',
                email: currentUser?.email || '',
                mobile: currentUser?.mobile || '',
                workUnit: currentUser?.workUnit || '',
              }}>
              <FormItem
                style={tw`px-5`}
                name="image"
                handleChange="onChange"
                rules={{
                  required: {
                    value: true,
                    message: 'Vui l??ng nh???p t??n ????ng nh???p',
                  },
                }}>
                <UploadAvatar />
              </FormItem>

              <View style={styles.section}>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>T??n ????ng nh???p</Text>
                  <FormItem name="username" style={styles.detailContent}>
                    <TextInput
                      selectTextOnFocus={true}
                      selectionColor={COLOR.READDING_MODE}
                      editable={false}
                      style={tw`text-BLACK bg-gray-100`}
                    />
                  </FormItem>
                </View>

                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>H??? t??n</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="fullname"
                      style={styles.detailContent}
                      rules={{
                        required: {
                          value: true,
                          message: 'Vui l??ng nh???p h??? t??n',
                        },
                        pattern: {
                          value: isfullName,
                          message: 'Vui l??ng nh???p ????ng ?????nh d???ng t??n',
                        },
                      }}>
                      <TextInput
                        selectTextOnFocus={true}
                        selectionColor={COLOR.READDING_MODE}
                        placeholder="Nh???p h??? t??n"
                        returnKeyType="next"
                        onSubmitEditing={() => form?.setFocus('email')}
                      />
                    </FormItem>
                  </View>
                </View>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>Email</Text>
                  <View style={{ flex: 1 }}>
                    <FormItem
                      name="email"
                      style={styles.detailContent}
                      rules={{
                        pattern: {
                          value: isEmail,
                          message: 'Vui l??ng nh???p ????ng ?????nh d???ng email',
                        },
                      }}>
                      <TextInput
                        selectTextOnFocus={true}
                        selectionColor={COLOR.READDING_MODE}
                        returnKeyType="next"
                        placeholder="Nh???p Email"
                        keyboardType="email-address"
                        caretHidden={false}
                        onSubmitEditing={() => form?.setFocus('mobile')}
                      />
                    </FormItem>
                  </View>
                </View>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>S??? ??i???n tho???i</Text>
                  <View style={tw`flex-1`}>
                    <FormItem
                      name="mobile"
                      style={styles.detailContent}
                      rules={{
                        pattern: {
                          value: isPhoneVN,
                          message: 'Vui l??ng nh???p ????ng ?????nh d???ng sdt',
                        },
                      }}>
                      <TextInput
                        selectTextOnFocus={true}
                        selectionColor={COLOR.READDING_MODE}
                        returnKeyType="next"
                        placeholder="Nh???p S??T"
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => form?.setFocus('workUnit')}
                      />
                    </FormItem>
                  </View>
                </View>
                <View style={[styles.row, styles.productDetailItem]}>
                  <Text style={[styles.detailLabel]}>????n v??? c??ng t??c</Text>
                  <View style={tw`flex-1`}>
                    <FormItem name="workUnit" style={styles.detailContent}>
                      <TextInput
                        selectTextOnFocus={true}
                        selectionColor={COLOR.READDING_MODE}
                        returnKeyType="go"
                        placeholder="Nh???p ????n v??? c??ng t??c"
                        onSubmitEditing={form?.handleSubmit(onSubmit)}
                      />
                    </FormItem>
                  </View>
                </View>
              </View>
            </Form>

            <TouchableOpacity
              style={{ width: '100%', marginTop: 20 }}
              onPress={form?.handleSubmit(onSubmit)}>
              <View
                style={tw`h-[52px] rounded-[4px] items-center justify-center bg-THEME mx-5`}>
                <Text style={tw`text-white`}>C???p nh???t</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{ width: '100%', marginTop: 20 }}
              onPress={() => setVisibleModal2(true)}>
              <View
                style={tw`h-[52px] rounded-[4px] items-center justify-center`}>
                <Text style={tw`text-red-700 underline`}>X??a t??i kho???n</Text>
              </View>
            </TouchableOpacity> */}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <ModalAction
        title="H???y thay ?????i"
        cancelText="H???y"
        submitText="?????ng ??"
        visible={visibleModal}
        onCancel={() => {
          setVisibleModal(false);
        }}
        onSubmit={() => {
          setVisibleModal(false);
          navigation.dispatch(saveAction);
        }}
      />

      <ModalAction
        title={
          'B???n mu???n v?? hi???u h??a t??i kho???n? \n \n (Ch?? ??, thao t??c n??y kh??ng th??? kh??i ph???c!)'
        }
        cancelText="H???y"
        submitText="X??c nh???n"
        visible={visibleModal2}
        onCancel={() => {
          setVisibleModal2(false);
        }}
        onSubmit={disableAccount}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '20@s',
    paddingVertical: '6@vs',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  backbtn: {
    width: '35@s',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
    // width: '70@s',
    // justifyContent: 'space-between',
  },
  saveTxt: {
    color: COLOR.THEME,
    fontSize: '14@s',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: '18@s',
    fontWeight: '500',
    flex: 1,
  },
  bodyPage: {
    flex: 1,
    backgroundColor: COLOR.BG,
  },

  section: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    paddingBottom: '10@vs',
    borderRadius: '15@s',
    marginBottom: '10@vs',
    width: '100%',
  },
  groupImage: {
    paddingVertical: '10@vs',
    paddingLeft: '15@vs',
  },
  sectionTitle: {
    fontWeight: '500',
    color: COLOR.ROOT_COLOR_SMOOTH,
    fontSize: '13@s',
    paddingLeft: '15@s',
    paddingVertical: '10@vs',
  },
  productDetailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    width: '100@s',
    fontSize: '13@s',
    marginRight: '15@s',
  },
  detailContent: {
    flex: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    paddingVertical: '10@vs',
  },
  detailContentTxt: {
    fontSize: '13@s',
    marginRight: '5@s',
  },
  txtThemeColor: {
    color: COLOR.THEME,
  },
  typeTxt: {
    fontSize: '14@s',
    fontWeight: '500',
  },
  description: {
    height: '50@vs',
  },
});

export default React.memo(UserInformation);
