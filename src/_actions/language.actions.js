import {
    SET_LANGUAGE,
  } from "../_actions/types";
  

export const setLanguage = (content) => {
    return { type: SET_LANGUAGE,
        payload: content,
    }
};