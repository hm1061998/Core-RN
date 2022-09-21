import React, { useState, useImperativeHandle } from 'react';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
import 'intl';
import 'intl/locale-data/jsonp/vi-VN';

registerTranslation('vi', {
  save: 'Lưu',
  selectSingle: 'Chọn ngày',
  selectMultiple: 'Chọn nhiều ngày',
  selectRange: 'Chọn khoảng thời gian',
  notAccordingToDateFormat: inputFormat =>
    `Định dạng ngày tháng phải là ${inputFormat}`,
  mustBeHigherThan: date => `Phải sau đó ${date}`,
  mustBeLowerThan: date => `Sau đó phải sớm hơn ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Phải ở giữa ${startDate} - ${endDate}`,
  dateIsDisabled: 'Ngày không được phép',
  previous: 'Trước',
  next: 'Sau',
  typeInDate: 'Nhập ngày tháng',
  pickDateFromCalendar: 'Chọn ngày từ lịch',
  close: 'Đóng',
});

const RangeDatePicker = React.forwardRef(({ onChange, value }, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
    },
    hide: () => {
      setVisible(false);
    },
  }));

  const tooglePicker = type => {
    if (type === 'hide') {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  // console.log({ data });

  return (
    <>
      <DatePickerModal
        locale="vi"
        mode="range"
        visible={visible}
        onDismiss={() => tooglePicker('hide')}
        startDate={value?.[0] ? new Date(value[0]) : undefined}
        endDate={value?.[1] ? new Date(value[1]) : undefined}
        onConfirm={({ startDate, endDate }) => {
          tooglePicker('hide');
          if (startDate && endDate) {
            onChange?.([startDate, endDate]);
          }
        }}
        startLabel="Ngày bắt đầu" // optional
        endLabel="Ngày kết thúc" // optional
      />
    </>
  );
});

export default RangeDatePicker;
