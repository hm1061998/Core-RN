import { FlashList } from '@shopify/flash-list';
import { useMemo, useCallback } from 'react';
import { Text } from 'react-native';

const SectionFlashList = ({
  data,
  renderSectionHeader,
  renderItem,
  stickySectionHeadersEnabled,
  ...orderProps
}) => {
  const renderHeaderItems = useCallback(
    (item, index) => {
      if (renderSectionHeader) {
        return renderSectionHeader(item, index);
      } else {
        return <Text>{item}</Text>;
      }
    },
    [renderSectionHeader],
  );

  const _renderItem = useCallback(
    ({ item, index }) => {
      if (typeof item === 'string') {
        // Rendering header
        return renderHeaderItems(item, index);
      } else {
        // Render item
        const isLastItem =
          typeof data?.[index + 1] === 'string' ||
          typeof data?.[index + 1] === 'undefined';
        const isFirstItem =
          typeof data?.[index - 1] === 'string' ||
          typeof data?.[index - 1] === 'undefined';

        const itemPosition =
          (isLastItem && 'last') || (isFirstItem && 'fisrt') || 'inside';

        return renderItem?.({ item, index, itemPosition });
      }
    },
    [data, renderHeaderItems, renderItem],
  );

  const stickyHeaderIndices = useMemo(
    () =>
      stickySectionHeadersEnabled
        ? data
            ?.map((item, index) => {
              if (typeof item === 'string') {
                return index;
              } else {
                return null;
              }
            })
            ?.filter(item => item !== null) || []
        : [],
    [data, stickySectionHeadersEnabled],
  );

  // console.log({ data });

  return (
    <FlashList
      {...orderProps}
      data={data}
      renderItem={_renderItem}
      stickyHeaderIndices={stickyHeaderIndices}
      getItemType={item => {
        // To achieve better performance, specify the type based on the item
        return typeof item === 'string' ? 'sectionHeader' : 'row';
      }}
      estimatedItemSize={100}
    />
  );
};

export default SectionFlashList;
