import { getBooks } from '../http/index';
import {
  ACTIONS,
  API_SERVER_STATUS,
  convertToBookViewModelList,
  dispatchError,
} from './common';

const bookListInitialState = {
  currentPage: 1,
  perPageItems: 20,
  totalHits: 0,
  totalPages: 1,
  bookListLoading: false,
  bookListError: '',
  books: [],
};

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
        dispatchError(responseData.toString(), dispatch);
      }
    } catch (e) {
      dispatchError(e.toString(), dispatch);
    }
  };

  await fetch();
};

export { bookListInitialState, bookListReducer, getBooksByPage };
