import React, { useRef } from 'react';
import { View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { SIZES, COLOR, SHADOW_3 } from '~/utils/Values';
import Icon from '~/components/BasesComponents/Icon';
import BottomSheetModal from '~/components/BasesComponents/BottomSheetModal';
import Button from '~/components/BasesComponents/Button';
import Auth from '~/utils/Auth';
import { useSelector } from 'react-redux';
import ProgressiveImage from '~/components/BasesComponents/ProgressiveImage';
import { getLinkImg } from '~/utils/utils';
import tw from '~/lib/tailwind';
import Text from '~/utils/StyledText';

const Menu = ({ navigation }) => {
  const sheetRef = useRef();
  const { currentUser } = useSelector(state => state.user);
  const arrMenu = [
    {
      id: '1',
      name: 'Lịch khám',
      icon: (
        <Icon
          type="FontAwesome"
          name="calendar-plus-o"
          size={scale(20)}
          color={COLOR.ROOT_COLOR_SMOOTH}
        />
      ),
      route: 'ClinicQueues',
    },
    {
      id: '2',
      name: 'Phiếu thu DV',
      icon: (
        <Icon
          type="FontAwesome5"
          name="receipt"
          size={scale(20)}
          color={COLOR.ROOT_COLOR_SMOOTH}
        />
      ),
      route: 'ClinicReceipts',
    },
  ];
  // console.log({ superClusterClusters });
  return (
    <View style={tw`flex-1 bg-THEME pt-status-bar`}>
      <View style={tw`flex-1 bg-BG`}>
        <Button
          onPress={() => navigation.navigate('InfoUser')}
          style={styles.header}>
          <View style={styles.avatar}>
            {currentUser?.image?.file ? (
              <ProgressiveImage
                style={styles.icon}
                source={{ uri: getLinkImg(currentUser?.image) }}
              />
            ) : (
              <View style={styles.icon}>
                <Text style={tw`uppercase font-medium`}>
                  {currentUser?.fullname?.slice(0, 1)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.userName}>{currentUser?.fullname}</Text>
            <Text style={styles.unit}>Xem thông tin tài khoản</Text>
          </View>
        </Button>
        <View style={styles.bodyPage}>
          <FlatList
            data={arrMenu}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingBottom: 100,
              paddingHorizontal: 15,
              marginTop: 10,
            }}
            renderItem={({ item, index }) => (
              <Button
                style={styles.menuItem}
                onPress={() => {
                  if (item.route) {
                    navigation.navigate(item.route);
                  } else if (item.callback) {
                    item.callback();
                  }
                }}>
                <View style={styles.menuIcon}>{item.icon}</View>

                <Text style={styles.menuName}>{item.name}</Text>
              </Button>
            )}
            ListFooterComponent={() => (
              <View style={styles.listFooter}>
                <Button
                  style={styles.listFooterItem}
                  onPress={() => navigation.navigate('Setting')}>
                  <Icon
                    type="Ionicons"
                    name="settings"
                    size={scale(20)}
                    color={COLOR.ROOT_COLOR_SMOOTH}
                  />
                  <View style={styles.listFooterWrapName}>
                    <Text style={styles.listFooterName}>Cài đặt</Text>
                  </View>
                </Button>
                <Button
                  style={styles.listFooterItem}
                  onPress={() => {
                    Alert.alert(
                      'Đăng xuất!',
                      'Bạn muốn đăng xuất khỏi tài khoản này?',
                      [
                        {
                          text: 'Hủy',
                          onPress: () => null,
                          style: 'cancel',
                        },
                        {
                          text: 'Ok',
                          onPress: () => {
                            Auth.signOut();
                          },
                          style: 'destructive',
                        },
                      ],
                    );
                  }}>
                  <Icon
                    type="MaterialIcons"
                    name="logout"
                    size={scale(20)}
                    color={COLOR.ROOT_COLOR_SMOOTH}
                  />
                  <View style={styles.listFooterWrapName}>
                    <Text style={styles.listFooterName}>Đăng xuất</Text>
                  </View>
                </Button>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    paddingVertical: '6@vs',
    borderBottomLeftRadius: '15@s',
    borderBottomRightRadius: '15@s',
  },
  avatar: {
    alignItems: 'center',
    marginRight: '10@s',
  },
  icon: {
    width: '40@s',
    height: '40@s',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '40@s',
    backgroundColor: '#DEF0FF',
  },
  headerRight: {
    flex: 1,
  },
  userName: {
    fontSize: '15@s',
    fontWeight: '500',
  },
  bodyPage: {
    flex: 1,
    backgroundColor: COLOR.BG,
  },
  menuItem: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    borderRadius: 4,
    height: '50@vs',
    paddingHorizontal: '15@s',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    ...SHADOW_3,
  },
  menuName: {
    flex: 1,
    marginLeft: '5@s',
    fontSize: '12@s',
  },
  menuIcon: {
    width: '30@s',
  },
  listFooter: {
    marginTop: '20@vs',
  },
  listFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listFooterWrapName: {
    flex: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    paddingVertical: '13@vs',
    marginLeft: '10@s',
  },
  listFooterName: {
    fontSize: '13@s',
  },
  bottomSheet: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
    borderTopLeftRadius: '15@s',
    borderTopRightRadius: '15@s',
  },
  headerSheet: {
    paddingVertical: '15@vs',
    alignItems: 'center',
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    borderBottomWidth: 0.7,
  },
  headerSheetTitle: {
    fontSize: '13@s',
    fontWeight: '500',
  },
  bodySheet: {},
  sheetItemAction: {
    paddingHorizontal: '20@s',
    paddingVertical: '15@vs',
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
    borderBottomWidth: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetActionIcon: {
    width: '25@s',
    marginRight: '15@s',
  },
  sheetActionName: {
    fontSize: '13@s',
    flex: 1,
  },
});

export default Menu;
