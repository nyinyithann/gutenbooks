import isEqual from 'lodash.isequal';
import React, { useContext, useEffect } from 'react';

import { BookList } from '../components/Book';
import Bookshelves from '../components/Bookshelves';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SearchBox from '../components/SearchBox';
import SortBox from '../components/SortBox';
import usePrevious from '../hooks/UsePrevious';
import useQueryParams from '../hooks/UseQueryParams';
import { BookContext } from '../providers/ContextProvider';
import spinner from '../resources/spinner.gif';

export default function Home() {
  const { bookList, bookshelves } = useContext(BookContext);
  const [urlQueryParam, setUrlQueryParam] = useQueryParams('books');
  const previousUrlQueryParam = usePrevious(urlQueryParam);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [bookshelveKey, setBookshelveKey] = React.useState('');

  const {
    getBooksByPage,
    totalHits,
    currentPage,
    hasMore,
    loading,
    error,
    books,
  } = bookList;

  const { getBookshelves, _loading, _error, shelves } = bookshelves;
  const { sortIndex } = urlQueryParam;

  React.useEffect(() => {
    if (
      !(
        urlQueryParam.fields.length === 1 &&
        urlQueryParam.fields[0] === 'bookshelf'
      )
    ) {
      setSearchTerm(urlQueryParam.query || '');
      setBookshelveKey('');
    } else {
      setSearchTerm('');
      setBookshelveKey(urlQueryParam.query);
    }
  }, [urlQueryParam]);

  useEffect(() => {
    if (!isEqual(previousUrlQueryParam, urlQueryParam)) {
      const { query, fields, sort } = urlQueryParam;
      getBooksByPage(
        {
          query,
          fields,
          sort,
          page: 1,
        },
        {
          isLoadedMore: false,
        }
      );
    }
  });

  useEffect(() => getBookshelves(), []);

  const loadMore = (e) => {
    e.preventDefault();
    const { query, fields, sort } = urlQueryParam;
    getBooksByPage(
      {
        query,
        fields,
        sort,
        page: currentPage + 1,
      },
      {
        isLoadedMore: true,
      }
    );
  };

  const handleSortItemSelected = (item) => {
    const { query, fields } = urlQueryParam;
    const info = {
      query,
      fields,
      sortIndex: item.id,
      sort: item.sort,
    };

    setUrlQueryParam(info);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center m-6 p-6 border-[1px] rounded-sm shadow">
        <div>
          <span>
            There was an error in loading the book list.{' '}
            <span>Reload this page.</span>
          </span>
          <details className="pt-2 text-sm text-red-200">
            {error.message}
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen">
      <div className="fixed w-full mt-[-0.7rem] md:mt-[-1.2rem] h-auto z-40">
        <div className="flex flex-col w-full">
          <div className="px-2 pt-3 pb-3 md:pt-2 bg-200">
            <SearchBox searchTerm={searchTerm} />
          </div>
          <div className="flex-auto w-full mt-[-0.5rem] px-3 pt-1 pb-1 text-[0.9rem] md:text-[0.85rem] bg-white">
            <div className="flex pb-1 border-b-[2px] items-center border-300">
              <p className="inline-block pr-1">
                {`${books.length} of ${totalHits} results`}
                {searchTerm || bookshelveKey ? (
                  <span className="inline-block pl-1">{` for ${
                    searchTerm ? '' : bookshelveKey ? 'bookshelf' : ''
                  }`}</span>
                ) : null}
              </p>
              {searchTerm || bookshelveKey ? (
                <>
                  <span className="inline text-rose-500">{`"`}</span>
                  <p className="inline max-w-[96px] md:max-w-[384px] lg:max-w-[768px] text-rose-500 text-ellipsis overflow-hidden line-clamp-1">
                    {`${
                      searchTerm
                        ? searchTerm
                        : bookshelveKey
                        ? bookshelveKey
                        : ''
                    }`}
                  </p>
                  <span className="text-rose-500">{`"`}</span>
                </>
              ) : null}
              <div
                name="sort_box"
                className="flex flex-nowrap mt-[-1px] py-[1px] ml-auto"
              >
                <SortBox
                  selectedIndex={sortIndex}
                  displayField="desc"
                  onSelected={handleSortItemSelected}
                  className="flex w-[8.5rem] md:w-40 text-left text-[0.8rem] md:text-[0.85rem] rounded text-900 bg-white border-[1px] border-300 hover:shadow-lg hover:border-200 focus:border-200 p-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-2 w-full h-screen relative">
        <div className="flex w-full mt-[6rem] md:mt-[5.5rem]">
          <div className="flex flex-[3_0_0%] w-full">
            <BookList books={books} />
          </div>
          <div className="hidden md:flex h-[82vh] md:h-[77.5vh] pl-8 pr-4 sticky right-0 top-[10.5rem] bottom-0 rounded w-[20rem]">
            <Bookshelves shelves={shelves} />
          </div>
        </div>
        {hasMore ? (
          <div className="flex items-stretch flex-none min-h-12">
            <button
              className="flex grow h-12 m-4 rounded shadow md:h-8 bg-400 md:hover:border-[1px] md:hover:border-500 text-white justify-center"
              type="button"
              onClick={loadMore}
            >
              {loading ? (
                <img
                  src={spinner}
                  alt="spinner"
                  className="self-center flex-none w-12 h-12 p-3"
                />
              ) : (
                <span className="self-center flex-none text-lg md:text-base">
                  Load more
                </span>
              )}
            </button>
          </div>
        ) : null}

        <div
          className="flex flex-none shrink-0 justify-center items-center md:bottom-14 bottom-[1rem] right-[18.5rem] fixed hover:cursor-pointer hover:outline-none hover:ring-0 rounded-full"
        >
          <ScrollToTopButton className="bg-400 md:bg-400 shadow h-10 w-10 md:h-10 md:w-10 text-white rounded-full hover:cursor-pointer hover:outline-none hover:ring-0 z-50" />
        </div>
      </div>
    </div>
  );
}
