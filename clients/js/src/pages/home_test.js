import isEqual from 'lodash.isequal';
import React, { useContext, useEffect } from 'react';

import { BookList } from '../components/Book';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SearchBox from '../components/SearchBox';
import SortBox from '../components/SortBox';
import { BookContext } from '../context/ContextProvider';
import usePrevious from '../hooks/UsePrevious';
import useQueryParams from '../hooks/UseQueryParams';
import spinner from '../resources/spinner.gif';

export default function Home() {
  const { bookList } = useContext(BookContext);
  const [urlQueryParam, setUrlQueryParam] = useQueryParams('books');
  const previousUrlQueryParam = usePrevious(urlQueryParam);

  const {
    getBooksByPage,
    totalHits,
    currentPage,
    hasMore,
    loading,
    error,
    books,
  } = bookList;
  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col pt-2 w-full h-screen">
        <div className="flex w-full mt-[5rem] md:mt-[4rem]">HOME</div>
      </div>
    </div>
  );
}
