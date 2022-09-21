import Icon from '~/components/BasesComponents/Icon';
import { COLOR } from '~/utils/Values';

export default [
  {
    name: 'Home',
    component: require('~/screens/Home').default,
    options: {
      tabBarIcon: ({ color, size = 20 }) => {
        return (
          <Icon
            type="MaterialCommunityIcons"
            name="chart-box"
            size={size}
            color={color}
          />
        );
      },
      tabBarLabel: 'Tổng quan',
      tabBarActiveTintColor: COLOR.THEME,
      tabBarLabelStyle: { fontFamily: 'Roboto_medium', marginBottom: 5 },
    },
  },
  {
    name: 'Receipts',
    component: require('~/screens/Receipts').default,
    options: {
      tabBarIcon: ({ color, size = 20 }) => {
        return (
          <Icon
            type="FontAwesome5"
            name="clinic-medical"
            size={size}
            color={color}
          />
        );
      },
      tabBarLabel: 'Nhập thuốc',
      tabBarActiveTintColor: COLOR.THEME,
      tabBarLabelStyle: { fontFamily: 'Roboto_medium', marginBottom: 5 },
    },
  },
  {
    name: 'Issues',
    component: require('~/screens/Issues').default,
    options: {
      tabBarIcon: ({ color, size = 20 }) => {
        return (
          <Icon
            type="MaterialIcons"
            name="medical-services"
            size={size}
            color={color}
          />
        );
      },
      tabBarLabel: 'Bán thuốc',
      tabBarActiveTintColor: COLOR.THEME,
      tabBarLabelStyle: { fontFamily: 'Roboto_medium', marginBottom: 5 },
    },
  },
  {
    name: 'Menu',
    component: require('~/screens/Menu').default,
    options: {
      tabBarIcon: ({ color, size = 20 }) => {
        return (
          <Icon type="FontAwesome5" name="bars" size={size} color={color} />
        );
      },
      tabBarLabel: 'Nhiều hơn',
      tabBarActiveTintColor: COLOR.THEME,
      tabBarLabelStyle: { fontFamily: 'Roboto_medium', marginBottom: 5 },
    },
  },
];
