import { getBookshelves } from '../http/index';
import { ACTIONS, API_SERVER_STATUS, dispatchError } from './common';

const bookshelvesInitialState = {
  loading: false,
  error: '',
  shelves: [],
};

function bookshelvesReducer(state, action) {
  const { loading, error, shelves } = action.payload;
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
        shelves,
      };
    default:
      return state;
  }
}

const getAllBookshelves = (dispatch) => async () => {
  const fetch = async () => {
    dispatch({
      type: ACTIONS.LOADING,
      payload: {
        loading: true,
        error: '',
      },
    });
    try {
      const response = await getBookshelves();
      const responseData = response.data;
      if (responseData._status === API_SERVER_STATUS.SUCCESS) {
        const result = responseData._result;
        dispatch({
          type: ACTIONS.LOADED,
          payload: {
            loading: false,
            error: '',
            shelves: result.bookshelves.sort((x, y) => {
              if (x.key > y.key) {
                return 1;
              } else if (x.key < y.key) {
                return -1;
              } else {
                return 0;
              }
            }),
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

export { bookshelvesInitialState, bookshelvesReducer, getAllBookshelves };
