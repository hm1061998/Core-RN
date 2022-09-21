import React from 'react';

function useForm() {
  const [_, forceUpdate] = React.useState(null);
  const formRef = React.useRef();
  const setFormRef = ref => {
    if (!formRef.current) {
      formRef.current = ref;
      forceUpdate({});
    }
  };

  return [formRef.current, setFormRef];
}

export default useForm;
