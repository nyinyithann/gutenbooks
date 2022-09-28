import React, { createContext, useMemo, useReducer } from 'react';

import { getBooks, searchBooks } from '../http/index';

export const BookContext = createContext(undefined);

const API_SERVER_STATUS = {
  SUCCESS: 'Ok',
  FAIL: 'Error',
};

const ACTIONS = {
  LOADING: 'Loading',
  LOADED: 'Loaded',
  LOADEDMORE: 'LoadedMore',
  ERROR: 'Error',
};

const bookListInitialState = {
  currentPage: 1,
  perPageItems: 20,
  totalHits: 0,
  totalPages: 1,
  loading: false,
  error: '',
  books: [],
};

const bookSearchInitialState = {
  searchInfo: { query: '', fields: ['title', 'author'] },
  loading: false,
  error: '',
  books: [],
};

const convertToBookViewModelList = (hits) =>
  hits.map((hit) => {
    const medium = hit.formats.find(
      (x) =>
        x.type.toLowerCase() === 'image/jpeg' &&
        x.link.toLowerCase().includes('medium')
    );
    const small = hit.formats.find(
      (x) =>
        x.type.toLowerCase() === 'image/jpeg' &&
        x.link.toLowerCase().includes('small')
    );
    const map = new Map();
    hit.formats.forEach(({ type, link }) => {
      if (
        type.toLowerCase() === 'application/epub+zip' &&
        link.toLowerCase().includes('noimages')
      ) {
        map.set('epub', link);
      }
      if (
        type.toLowerCase() === 'application/x-mobipocket-ebook' &&
        link.toLowerCase().includes('noimages')
      ) {
        map.set('kindle', link);
      }
      if (type.toLowerCase() === 'text/plain') {
        map.set('text', link);
      }
      if (type.toLowerCase() === 'text/html') {
        map.set('html', link);
      }
      if (type.toLowerCase() === 'application/zip') {
        map.set('zip', link);
      }
    });

    const links = [];
    map.forEach((value, key) => {
      links.push({ type: key, link: value });
    });
    links.sort((x, y) => {
      const xt = x.type.toLowerCase();
      const yt = y.type.toLowerCase();
      if (xt < yt) return -1;
      if (yt > xt) return 1;
      return 0;
    });

    return {
      id: hit.id,
      indexId: hit.index_id,
      title: hit.title,
      downloadCount: hit.download_count,
      imageSrc: {
        medium: medium && medium.link ? medium.link : '',
        small: small && small.link ? small.link : '',
      },
      authors: hit.authors.map(({ name, webpage }) => ({
        name,
        webpage,
      })),
      links,
    };
  });

const dispatchError = (errorMessage, dispatch) =>
  dispatch({
    type: ACTIONS.ERROR,
    payload: {
      loading: false,
      error: errorMessage,
    },
  });

function bookListReducer(state, action) {
  const {
    currentPage,
    perPageItems,
    totalHits,
    totalPages,
    loading,
    error,
    books,
  } = action.payload;
  switch (action.type) {
    case ACTIONS.ERROR:
      return {
        ...state,
        loading,
        error,
      };
    case ACTIONS.LOADING:
      return { ...state, loading, error };
    case ACTIONS.LOADED:
      return {
        currentPage,
        perPageItems,
        totalHits,
        totalPages,
        loading,
        error,
        books,
      };
    case ACTIONS.LOADEDMORE:
      return {
        currentPage,
        perPageItems,
        totalHits,
        totalPages,
        loading,
        error,
        books: [...state.books, ...books],
      };
    default:
      return state;
  }
}

const getBooksByPage = (dispatch) => async (queryInfo, options) => {
  const fetch = async () => {
    dispatch({
      type: ACTIONS.LOADING,
      payload: {
        loading: true,
        error: '',
      },
    });
    try {
      const response = await getBooks(queryInfo);
      const responseData = response.data;
      if (responseData._status === API_SERVER_STATUS.SUCCESS) {
        const result = responseData._result;
        const { _page, _per_page, _total_hits, _total_pages, _hits } = result;
        const books = convertToBookViewModelList(_hits);
        dispatch({
          type: options.isLoadedMore ? ACTIONS.LOADEDMORE : ACTIONS.LOADED,
          payload: {
            currentPage: _page,
            perPageItems: _per_page,
            totalHits: _total_hits,
            totalPages: _total_pages,
            loading: false,
            error: '',
            books,
          },
        });
      } else {
        dispatchError(responseData._message, dispatch);
      }
    } catch (e) {
      dispatchError(e, dispatch);
    }
  };

  await fetch();
};

function bookSearchReducer(state, action) {
  const { searchInfo, loading, error, books } = action.payload;
  switch (action.type) {
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case ACTIONS.LOADING:
      return { ...state, loading: true, searchInfo };
    case ACTIONS.LOADED:
      return {
        searchInfo,
        loading,
        error,
        books,
      };
    default:
      return state;
  }
}
const getBooksForAutocomplete = (dispatch) => async (searchInfo) => {
  if (!searchInfo.query) {
    dispatch({
      type: ACTIONS.LOADED,
      payload: {
        searchInfo,
        loading: false,
        error: '',
        books: [],
      },
    });
  } else {
    const fetch = async () => {
      dispatch({
        type: ACTIONS.LOADING,
        payload: {
          searchInfo,
          loading: true,
          error: '',
          books: [],
        },
      });
      try {
        const response = await searchBooks(searchInfo);
        const responseData = response.data;
        if (responseData._status === API_SERVER_STATUS.SUCCESS) {
          const result = responseData._result;
          const { _hits } = result;
          const books = convertToBookViewModelList(_hits);
          dispatch({
            type: ACTIONS.LOADED,
            payload: {
              searchInfo,
              loading: false,
              error: '',
              books,
            },
          });
        } else {
          dispatchError(responseData._message, dispatch);
        }
      } catch (e) {
        dispatchError(e, dispatch);
      }
    };
    await fetch();
  }
};

function BookContextProvider({ children }) {
  const [bookListState, bookListDispatch] = useReducer(
    bookListReducer,
    bookListInitialState,
    (x) => x
  );

  const gb = useMemo(
    () => getBooksByPage(bookListDispatch),
    [bookListDispatch]
  );

  const [bookSearchState, bookSearchDispatch] = useReducer(
    bookSearchReducer,
    bookSearchInitialState,
    (x) => x
  );

  const sb = useMemo(
    () => getBooksForAutocomplete(bookSearchDispatch),
    [bookSearchDispatch]
  );

  const contextValue = useMemo(
    () => ({
      bookList: {
        getBooksByPage: gb,
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
      bookSearch: {
        searchBooks: sb,
        loading: bookSearchState.loading,
        error: bookSearchState.error,
        books: bookSearchState.books,
        searchInfo: bookSearchState.searchInfo,
      },
    }),
    [bookListState, bookSearchState, gb, sb]
  );

  return (
    <BookContext.Provider value={contextValue}>{children}</BookContext.Provider>
  );
}

export default BookContextProvider;
