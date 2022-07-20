import {
  SET_LANGUAGE,
} from "../_actions/types";

const initialState = {
  // lang:localStorage.getItem("lang")
  language: "en",
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_LANGUAGE:
      return {
        ...state,
        language: payload,
      };

    default:
      return state;
  }
}
