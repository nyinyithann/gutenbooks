import React, { createContext, useMemo, useReducer } from 'react';

import {
  bookDetailInitialState,
  bookDetailReducer,
  getBookDetailById,
} from './bookDetailReducer';
import {
  bookListInitialState,
  bookListReducer,
  getBooksByPage,
} from './bookListReducer';
import {
  bookSearchInitialState,
  bookSearchReducer,
  getBooksForAutocomplete,
} from './bookSearchReducer';

export const BookContext = createContext(undefined);

function BookContextProvider({ children }) {
  const [bookListState, bookListDispatch] = useReducer(
    bookListReducer,
    bookListInitialState,
    (x) => x
  );

  const getBookList = useMemo(
    () => getBooksByPage(bookListDispatch),
    [bookListDispatch]
  );

  const [bookDetailState, bookDetailDispatch] = useReducer(
    bookDetailReducer,
    bookDetailInitialState,
    (x) => x
  );

  const getBookDetail = useMemo(
    () => getBookDetailById(bookDetailDispatch),
    [bookDetailDispatch]
  );

  const [bookSearchState, bookSearchDispatch] = useReducer(
    bookSearchReducer,
    bookSearchInitialState,
    (x) => x
  );

  const searchBooks = useMemo(
    () => getBooksForAutocomplete(bookSearchDispatch),
    [bookSearchDispatch]
  );

  const contextValue = useMemo(
    () => ({
      bookList: {
        getBooksByPage: getBookList,
        queryInfo: bookListState.queryInfo,
        currentPage: bookListState.currentPage,
        perPageItems: bookListState.perPageItems,
        totalHits: bookListState.totalHits,
        totalPages: bookListState.totalPages,
        hasMore: bookListState.currentPage < bookListState.totalPages,
        loading: bookListState.loading,
        error: bookListState.error,
        books: bookListState.books,
      },
      bookDetail: {
        getBookDetail,
        loading: bookDetailState.loading,
        error: bookDetailState.error,
        book: bookDetailState.book,
      },
      bookSearch: {
        searchBooks,
        loading: bookSearchState.loading,
        error: bookSearchState.error,
        books: bookSearchState.books,
        searchInfo: bookSearchState.searchInfo,
      },
    }),
    [
      bookListState,
      bookSearchState,
      bookDetailState,
      getBookDetail,
      getBookList,
      searchBooks,
    ]
  );

  return (
    <BookContext.Provider value={contextValue}>{children}</BookContext.Provider>
  );
}

export default BookContextProvider;
