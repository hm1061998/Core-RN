import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';
import PropTypes from 'prop-types';

const WrapFormItem = ({ shouldUpdate, children }) => {
  const { watch } = useFormContext();
  const fields = watch();
  const dependencies = useMemo(() => {
    if (shouldUpdate) {
      return shouldUpdate.map(item => fields[item]);
    }
    return [fields];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => children(fields), dependencies);
};

WrapFormItem.propTypes = {
  shouldUpdate: PropTypes.array,
};
export default WrapFormItem;
