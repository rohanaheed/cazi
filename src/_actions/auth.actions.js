
import { httpPost } from '../_services/httpService';
import {
    LOGOUT,
} from "./types";
import { HandleErrors } from './handelErrors';
import { v4 as uuidv4 } from 'uuid';
import { push } from "connected-react-router";



export const refreshToken = (data) => (dispatch) => {
    return httpPost('token/refresh/', data, true).then(res => {
        return Promise.resolve(res.data);
    }).catch((error) => {
        dispatch(HandleErrors(error.response))
        return Promise.reject(error.response);
    })
}


export const ClearStorageForNoUser = (redirect = false) => (dispatch) => {
    sessionStorage.clear();
    sessionStorage.setItem("clear", true);
    sessionStorage.setItem('uuid', uuidv4())
    localStorage.removeItem('alreadyLoggedIn');
    // todo: clear the store also
    dispatch({
        type: LOGOUT,
        payload: null,
    });
    if(redirect){
        dispatch(push("/"));
    }
  };