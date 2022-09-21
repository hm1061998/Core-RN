import { ScaledSheet, scale } from 'react-native-size-matters';
import { COLOR, SIZES } from '~/utils/Values';
import tw from '~/lib/tailwind';

export const listPickerModalStyles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '20@s',
    paddingVertical: '6@vs',
  },
  btnSearch: {
    width: '35@vs',
    height: '35@vs',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backbtn: {
    width: '30@s',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerBtn: {
    width: scale(30),
    height: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  section: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    paddingBottom: '10@vs',
    borderRadius: '15@s',
    marginTop: '10@vs',
    flex: 1,
  },

  txtThemeColor: {
    color: COLOR.THEME,
  },

  listItem: {
    paddingVertical: '8@vs',
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  listItemRow: {
    flexDirection: 'row',
  },
  listItemIcon: {
    width: '40@s',
    height: '40@s',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DEF0FF',
    marginRight: '10@s',
  },
  listItemPrice: {
    fontWeight: '500',
    fontSize: '14@s',
    textAlign: 'right',
  },

  listItemCol: {
    flex: 1,
  },
  listItemProduct: {
    fontSize: '14@s',
  },
  listItemSubProduct: {
    fontSize: '12@s',
    color: COLOR.ROOT_COLOR_SMOOTH,
    marginVertical: '5@vs',
  },

  listItemQtt: {
    color: COLOR.THEME,
    textAlign: 'right',
  },
  containerSearch: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
  },
  boxSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F8',
    paddingHorizontal: '8@s',
    borderRadius: 10,
  },
  inputSearch: {
    flex: 1,
    height: '35@vs',
    marginHorizontal: '5@s',
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '10@vs',
    backgroundColor: COLOR.WHITE,
    borderBottomWidth: 0.7,
    borderBottomColor: COLOR.ROOT_COLOR_CYAN_LIGHT,
  },
  icon: {
    marginHorizontal: 8,
  },
  name: {
    fontSize: '13@s',
    fontWeight: '500',
    flex: 1,
  },
  checkbox: {
    width: '16@s',
    height: '16@s',
    borderRadius: '16@s',
  },
});

export const createFormPickerStyles = ScaledSheet.create({
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
  },
  backbtn: {
    width: '40@s',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
  },
  saveTxt: {
    color: COLOR.THEME,
    fontSize: '14@s',
    fontFamily: 'Roboto_medium',
  },
  headerTitle: {
    fontSize: '18@s',
    fontFamily: 'Roboto_medium',
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

  label: {
    fontFamily: 'Roboto_medium',
    fontSize: '13@s',
    paddingHorizontal: '15@s',
    paddingVertical: '10@vs',
    color: COLOR.ROOT_COLOR_SMOOTH,
  },
  groupImage: {
    paddingVertical: '10@vs',
    paddingLeft: '15@vs',
  },
  sectionTitle: {
    fontFamily: 'Roboto_medium',
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
    fontFamily: 'Roboto_medium',
  },
  description: {
    height: '50@vs',
  },
});

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
  },
  backbtn: {
    width: '40@s',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
  },
});

export default styles;
