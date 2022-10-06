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
import {
  bookshelvesInitialState,
  bookshelvesReducer,
  getAllBookshelves,
} from './bookshelvesReducer';

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

  const [bookshelvesState, bookshelvesDispatch] = useReducer(
    bookshelvesReducer,
    bookshelvesInitialState,
    (x) => x
  );

  const getBookshelves = useMemo(
    () => getAllBookshelves(bookshelvesDispatch),
    [bookshelvesDispatch]
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
        bookListLoading: bookListState.loading,
        bookListError: bookListState.error,
        books: bookListState.books,
      },
      bookDetail: {
        getBookDetail,
        bookDetailLoading: bookDetailState.loading,
        bookDetailError: bookDetailState.error,
        book: bookDetailState.book,
      },
      bookshelves: {
        getBookshelves,
        bookshelvesLoading: bookshelvesState.loading,
        bookshelvesError: bookshelvesState.error,
        shelves: bookshelvesState.shelves,
      },
      bookSearch: {
        searchBooks,
        bookSearchLoading: bookSearchState.loading,
        bookSearchError: bookSearchState.error,
        books: bookSearchState.books,
        searchInfo: bookSearchState.searchInfo,
      },
    }),
    [
      bookListState,
      bookSearchState,
      bookDetailState,
      bookshelvesState,
      getBookDetail,
      getBookList,
      searchBooks,
      getBookshelves,
    ]
  );

  return (
    <BookContext.Provider value={contextValue}>{children}</BookContext.Provider>
  );
}

export default BookContextProvider;
