import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from '~/components/BasesComponents/Icon';
import tw from '~/lib/tailwind';
import Auth from '~/utils/Auth';
import BarChart from '~/components/Home/Chart';
import dayjs from 'dayjs';
import Text from '~/utils/StyledText';
import { formatNumber } from '~/utils/utils';
import { reports } from '~/queryHooks';
import { useLayoutContext } from '~/layouts/ControlProvider';
// import { FlashList } from '@shopify/flash-list';

const Home = ({ navigation }) => {
  const { placeId } = useLayoutContext();
  const [indexActive, setIndexActive] = useState(0);

  const { data: dataDashboardOrigin } = reports.useReportDashboard({
    params: { filter: JSON.stringify({ placesId: placeId }) },
  });
  // console.log(tw`sizes`.WIDTH_WINDOW);

  // console.log({ dataDashboardOrigin });

  // const checkDate = _date => {
  //   return _date === yesterday || _date === yesterday2 || _date === yesterday3;
  // };

  const data = [];

  dataDashboardOrigin?.Result?.length > 0 &&
    dataDashboardOrigin?.Result.forEach(item => {
      if (item.name) {
        data.push(item);
      }
    });
  // const formatter = value => formatNumber(value);
  const dataDetail =
    data &&
    data.length > 0 &&
    data.find((_, index) => index === Number(indexActive));
  const dataCard =
    (dataDetail &&
      dataDetail.detail &&
      dataDetail.detail.filter(
        chil => chil.name !== 'Tổng doanh thu trong tháng',
      )) ||
    [];
  let dataChar =
    (dataDetail &&
      dataDetail.detail &&
      dataDetail.detail.find(
        chil => chil.name === 'Tổng doanh thu trong tháng',
      )) ||
    {};

  const dataCharDetail =
    dataChar?.detail?.sort((a, b) =>
      a.createdate.localeCompare(b.createdate),
    ) || [];

  // const dataChart = new Array(30).fill(0);
  const valuesChart = dataCharDetail.map(item => ({
    y: item.total_revenue,
    marker: formatNumber(item.total_revenue),
  }));
  const labelsChart = dataCharDetail.map(item => item.createdate?.slice(0, 5));

  // console.log({ dataCharDetail });
  return (
    <View style={tw`flex-1 pt-status-bar bg-THEME`}>
      <View style={tw`flex-1 bg-BG`}>
        <View
          style={tw`flex-row items-center justify-between px-5 py-2 border-b-07 border-b-blue-300 bg-white`}>
          <Image
            style={tw`w-30 h-10 resize-contain self-start`}
            source={require('~/assets/logo.png')}
          />
          {/* <View style={tw`flex-row`}>
            <TouchableOpacity
              onPress={() => {
                Auth.signOut();
              }}>
              <Icon
                type="AntDesign"
                name="logout"
                size={24}
                color={tw.color('THEME')}
              />
            </TouchableOpacity>
          </View> */}
        </View>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
          <View style={tw`bg-white rounded-b-2xl w-full px-5 py-3 shadow-sm`}>
            <Text style={tw`font-medium`}>Tổng doanh thu trong tháng</Text>
            <BarChart values={valuesChart} labels={labelsChart} />
          </View>
          <View style={tw`w-full`}>
            {dataCard?.length > 0 &&
              dataCard.map((item, index) => {
                let color = index % 2 ? '#2ed8b6' : '#4099ff';
                let unit = 'đ';
                if (index === 0) {
                  color = '#FF5370';
                  unit = 'loại';
                }
                return (
                  <View
                    style={tw`flex-row bg-[${color}] py-1.5 px-5 mb-2 mt-3`}
                    key={item.name}>
                    <View style={tw`flex-1`}>
                      <Text
                        style={tw`text-white border-b-07 border-b-white pb-1 mb-2 font-medium`}>
                        {item.name}
                      </Text>

                      {item.detail?.length &&
                        item.detail.map(child => (
                          <Text
                            style={tw`text-white text-xs`}
                            key={child.lablel}>
                            {child.lablel} : {formatNumber(child.value || 0)}{' '}
                            {unit}
                          </Text>
                        ))}
                    </View>
                    <View
                      style={tw`w-8 h-8 items-center justify-center bg-[#0000003b] rounded-full ml-2`}>
                      <Icon
                        type="MaterialCommunityIcons"
                        name="exclamation-thick"
                        size={20}
                        color="#fff"
                      />
                    </View>
                  </View>
                );
              })}
            {/* <View style={tw`flex-row bg-[#ff5370] py-1.5 px-5 mb-2 mt-3`}>
              <View style={tw`flex-1 `}>
                <Text
                  style={tw`text-white border-b-07 border-b-white pb-1 mb-2 font-medium`}>
                  Cảnh báo
                </Text>
                <Text style={tw`text-white text-xs`}>
                  Thuốc sắp hết hàng: 4 loại
                </Text>
                <Text style={tw`text-white text-xs`}>
                  Thuốc sắp hết hạn: 6 loại
                </Text>
              </View>
              <View
                style={tw`w-8 h-8 items-center justify-center bg-[#0000003b] rounded-full ml-2`}>
                <Icon
                  type="MaterialCommunityIcons"
                  name="exclamation-thick"
                  size={20}
                  color="#fff"
                />
              </View>
            </View>

            <View style={tw`flex-row bg-[#2ed8b6]  py-1.5 px-5 mb-2`}>
              <View style={tw`flex-1`}>
                <Text
                  style={tw`text-white border-b-07 border-b-white pb-1 mb-2 font-medium`}>
                  Doanh thu tháng trước
                </Text>
                <Text style={tw`text-white text-xs`}>Doanh thu: 0 đ</Text>
                <Text style={tw`text-white text-xs`}>Nợ: 0 đ</Text>
                <Text style={tw`text-white text-xs`}>Lợi nhuận: 0 đ</Text>
              </View>
              <View
                style={tw`w-8 h-8 items-center justify-center bg-[#0000003b] rounded-full ml-2`}>
                <Icon type="FontAwesome" name="dollar" size={16} color="#fff" />
              </View>
            </View>

            <View style={tw`flex-row bg-[#4099ff]  py-1.5 px-5 mb-2`}>
              <View style={tw`flex-1`}>
                <Text
                  style={tw`text-white border-b-07 border-b-white pb-1 mb-2 font-medium`}>
                  Doanh thu tháng này
                </Text>
                <Text style={tw`text-white text-xs`}>Doanh thu: 0 đ</Text>
                <Text style={tw`text-white text-xs`}>Nợ: 0 đ</Text>
                <Text style={tw`text-white text-xs`}>Lợi nhuận: 0 đ</Text>
              </View>
              <View
                style={tw`w-8 h-8 items-center justify-center bg-[#0000003b] rounded-full ml-2`}>
                <Icon type="FontAwesome" name="dollar" size={16} color="#fff" />
              </View>
            </View> */}

            <View style={tw`flex-row bg-[#ffb64d]  py-1.5 px-5`}>
              <View style={tw`flex-1`}>
                <Text
                  style={tw`text-white border-b-07 border-b-white pb-1 mb-2 font-medium`}>
                  Tăng trưởng
                </Text>
                <Text style={tw`text-white text-xs`}>Doanh thu: 100%</Text>
                <Text style={tw`text-white text-xs`}>Lợi nhuận: 100%</Text>
              </View>
              <View
                style={tw`w-8 h-8 items-center justify-center bg-[#0000003b] rounded-full ml-2`}>
                <Icon
                  type="FontAwesome"
                  name="line-chart"
                  size={16}
                  color="#fff"
                />
              </View>
            </View>
          </View>

          <View
            style={tw`bg-white rounded-2xl w-full h-100 px-5 py-3 shadow-sm mt-3`}>
            <Text style={tw`font-medium mb-4`}>Chi tiết</Text>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}>
              {dataCharDetail?.map((item, index) => (
                <View style={tw`flex-row mb-4`} key={index.toString()}>
                  <View
                    style={tw`w-5 h-5 items-center justify-center rounded-full bg-[${
                      index < 3 ? '#314659' : '#f5f5f5'
                    }]`}>
                    <Text
                      style={tw`text-${
                        index < 3 ? 'white' : 'gray-700'
                      } text-xs`}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={tw`flex-1 ml-2`}>{item.createdate}</Text>
                  <Text>{formatNumber(item.total_revenue)}đ</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;
