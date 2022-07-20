import { userConstants } from "../_constants/user.constants";

const initialState = {};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case userConstants.SET_MESSAGE:
      return { message: payload };

    case userConstants.CLEAR_MESSAGE:
      return { message: "" };

    default:
      return state;
  }
}
