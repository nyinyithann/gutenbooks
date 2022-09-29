import * as JSURL from 'jsurl';
import * as React from 'react';
import { useSearchParams } from 'react-router-dom';

const useQueryParam = (key) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramValue = searchParams.get(key);

  let value = React.useMemo(() => JSURL.parse(paramValue), [paramValue]);
  if (!value) {
    value = {
      query: '',
      fields: [],
      sortIndex: 0,
      sort: [{ field: 'index_id', order: 'asc' }],
    };
  }
  const setValue = React.useCallback(
    (newValue, options) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, JSURL.stringify(newValue));
      setSearchParams(newSearchParams, options);
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setValue];
};

export default useQueryParam;
