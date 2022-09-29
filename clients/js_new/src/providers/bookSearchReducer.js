import { searchBooks } from '../http/index';
import {
  ACTIONS,
  API_SERVER_STATUS,
  convertToBookViewModelList,
  dispatchError,
} from './common';

const bookSearchInitialState = {
  searchInfo: { query: '', fields: ['title', 'author'] },
  loading: false,
  error: '',
  books: [],
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

export { bookSearchInitialState, bookSearchReducer, getBooksForAutocomplete };
