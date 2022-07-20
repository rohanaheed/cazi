import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../_actions/types";


const user = sessionStorage.getItem('loginUser')

const initialState = { isLoggedIn: user && JSON.parse(user).AccessToken ? true : false,
 user_token: user ? JSON.parse(user) : null  };

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user_token: payload
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user_token: null,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user_token: null,
      };
    // case RECOVER_PASSWORD_CHANGE_SUCCESS:
    //   return {
    //     ...state,
    //     isLoggedIn: true,
    //     user_token: payload
    //   }
    default:
      return state;
  }
}