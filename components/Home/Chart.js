import React, { useRef } from 'react';
import { processColor, View, TouchableOpacity } from 'react-native';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { SIZES, COLOR, SHADOW_5 } from '~/utils/Values';
import { formatNumber } from '~/utils/utils';
import Icon from '~/components/BasesComponents/Icon';
import { BarChart } from 'react-native-charts-wrapper';
import _ from 'lodash';
import tw from '~/lib/tailwind';

const ReportBarChart = ({ values = [], labels = [] }) => {
  const chartRef = useRef();
  const data = {
    dataSets: [
      {
        values: values,
        label: '',
        config: {
          color: processColor(COLOR.THEME),
          barShadowColor: processColor('lightgrey'),
          highlightAlpha: 90,
          drawValues: false,
          highlightColor: processColor('red'),
        },
      },
    ],

    config: {
      barWidth: 0.4,
    },
  };

  const xAxis = {
    valueFormatter: labels,
    granularityEnabled: true,
    granularity: 1,
    position: 'BOTTOM',
    drawGridLines: false,
  };

  const markerConfig = {
    enabled: true,
    markerColor: processColor(COLOR.ROOT_COLOR_PURPLE),
    textColor: processColor('white'),
    markerFontSize: scale(13),
  };

  function convertMoney(value) {
    let num = 0;
    let unit = '';
    if (value === null || value === undefined) {
      return { unit, num };
    }
    if (value < 10000) {
      num = formatNumber(value);
      unit = 'đ';
    } else if (value < 1000000) {
      num = formatNumber(Math.ceil(value / 1000));
      unit = 'k';
    } else if (value < 1000000000) {
      num = formatNumber(Math.ceil(value / 1000000));
      unit = 'tr';
    } else {
      num = formatNumber(Math.ceil(value / 1000000000));
      unit = 'tỷ';
    }

    return { unit, num };
  }

  const calcValuesYaxis = list => {
    return list.map(
      item => `${convertMoney(item.y).num} ${convertMoney(item.y).unit}`,
    );
  };

  const resetChart = () => {
    chartRef.current.moveViewToAnimated(-1, 0, 'left', 200);
    // chartRef.current.setZoom(0);
  };

  // console.log(calcValuesYaxis(values));
  return (
    <>
      <BarChart
        ref={chartRef}
        style={tw`w-12/12 h-[200px]`}
        chartDescription={{ text: '' }}
        data={data}
        xAxis={xAxis}
        yAxis={{
          right: {
            enabled: false,
          },
          left: {
            valueFormatter: 'largeValue',
            // valueFormatter: calcValuesYaxis(values),
            axisMinimum: 0,
            // axisMaximum: 180,
            granularityEnabled: true,
            granularity: 1,
          },
        }}
        animation={{ durationX: 1000, durationY: 1000 }}
        legend={{ enabled: false }}
        gridBackgroundColor={processColor('#ffffff')}
        visibleRange={{ x: { min: 6, max: 6 } }}
        drawBarShadow={false}
        drawValueAboveBar={true}
        drawHighlightArrow={false}
        marker={markerConfig}
        // onSelect={handleSelect}
        // highlights={highlights}
        // onChange={event => console.log(event.nativeEvent)}
      />

      {/* <TouchableOpacity
        style={tw`absolute top-4 right-4 z-10`}
        onPress={resetChart}>
        <Icon type="EvilIcons" name="refresh" size={24} color="black" />
      </TouchableOpacity> */}
    </>
  );
};

export default ReportBarChart;
