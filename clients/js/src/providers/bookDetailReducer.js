import { getBookById } from '../http/index';
import { ACTIONS, API_SERVER_STATUS, dispatchError } from './common';

const bookDetailInitialState = {
  loading: false,
  error: '',
  book: null,
};

function bookDetailReducer(state, action) {
  const { loading, error, book } = action.payload;
  switch (action.type) {
    case ACTIONS.ERROR:
    case ACTIONS.LOADING:
      return {
        ...state,
        loading,
        error,
      };
    case ACTIONS.LOADED:
    case ACTIONS.LOADEDMORE:
      return {
        loading,
        error,
        book,
      };
    default:
      return state;
  }
}

const getBookDetailById = (dispatch) => async (book_index_id) => {
  const fetch = async () => {
    dispatch({
      type: ACTIONS.LOADING,
      payload: {
        loading: true,
        error: '',
      },
    });
    try {
      const response = await getBookById(book_index_id);
      const responseData = response.data;
      if (responseData._status === API_SERVER_STATUS.SUCCESS) {
        const book = responseData._result;
        dispatch({
          type: ACTIONS.LOADED,
          payload: {
            loading: false,
            error: '',
            book,
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

export { bookDetailInitialState, bookDetailReducer, getBookDetailById };
