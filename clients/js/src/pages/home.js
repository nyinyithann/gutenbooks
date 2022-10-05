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

  if (error || _error) {
    return (
      <div className="m-6 flex flex-col items-center rounded-sm border-[1px] p-6 shadow">
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
    <div className="flex h-screen w-full dark:bg-slate-600">
      <div className="fixed z-40 mt-[-0.7rem] h-auto w-full md:mt-[-1.2rem]">
        <div className="flex w-full flex-col">
          <div className="dark-bg-md bg-200 px-2 pt-3 pb-3 md:pt-3">
            <SearchBox searchTerm={searchTerm} />
          </div>
          <div className="dark-bg mt-[-0.5rem] w-full flex-auto bg-white px-3 pt-1 pb-1 text-[0.9rem] dark:border-b-[1px] dark:border-b-slate-500/80 md:text-[0.85rem]">
            <div className="dark-text flex items-center border-b-[2px] border-300 pb-1 dark:border-0 dark:pb-0">
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
                  <p className="inline max-w-[96px] overflow-hidden text-ellipsis text-rose-500 line-clamp-1 md:max-w-[384px] lg:max-w-[768px]">
                    {`${searchTerm || bookshelveKey || ''}`}
                  </p>
                  <span className="text-rose-500">{`"`}</span>
                </>
              ) : null}
              <div
                name="sort_box"
                className="mt-[-1px] ml-auto flex flex-nowrap py-[1px]"
              >
                <SortBox
                  selectedIndex={sortIndex}
                  displayField="desc"
                  onSelected={handleSortItemSelected}
                  className="dark-text dark-border dark-bg-light flex w-[8.5rem] rounded border-[1px] border-300 bg-white p-1 text-left text-[0.8rem] text-900 hover:border-200 hover:shadow-lg focus:border-200 dark:text-slate-900 dark:hover:border-slate-500 dark:focus:border-slate-500 md:w-40 md:text-[0.85rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dark-bg-md relative flex h-screen w-full flex-col pt-2">
        <div className="dark-bg-md mt-[6rem] flex w-full md:mt-[5.5rem]">
          <div className="dark-bg-md flex w-full flex-[3_0_0%]">
            <BookList books={books} />
          </div>
          <div className="sticky right-0 top-[10.5rem] bottom-1 hidden h-[82vh] w-[20rem] rounded pl-8 pr-4 md:flex md:h-[77vh]">
            <Bookshelves shelves={shelves} />
          </div>
        </div>
        {hasMore ? (
          <div className="min-h-12 dark-bg flex flex-none items-stretch">
            <button
              className="dark-bg-md dark-text m-4 flex h-12 grow justify-center rounded bg-400 text-white shadow dark:hover:border-slate-500 md:h-8 md:hover:border-[1px] md:hover:border-500"
              type="button"
              onClick={loadMore}
            >
              {loading || _loading ? (
                <img
                  src={spinner}
                  alt="spinner"
                  className="h-12 w-12 flex-none self-center p-3"
                />
              ) : (
                <span className="flex-none self-center text-lg md:text-base">
                  Load more
                </span>
              )}
            </button>
          </div>
        ) : null}

        <div className="m:right-[18.5rem] fixed bottom-[1rem] right-[1rem] flex flex-none shrink-0 items-center justify-center rounded-full hover:cursor-pointer hover:outline-none hover:ring-0 md:bottom-[1.3rem]">
          <ScrollToTopButton className="z-50 h-10 w-10 rounded-full bg-400 text-white shadow hover:cursor-pointer hover:bg-500 hover:outline-none hover:ring-0 dark:border-[1px] dark:border-slate-500 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 md:h-10 md:w-10 md:bg-400" />
        </div>
      </div>
    </div>
  );
}
