import {
    SET_ADDRESS,
    SET_CONTRACT,
    DELETE_CONTRACT,
    DELETE_META_MASK_ADDRESS,
    SET_APPROVAL_FOR_CAZI,
    SET_APPROVAL_FOR_LP,
    SET_DECIMALS_FOR_CAZI,
    SET_DECIMALS_FOR_LP,
    DELETE_APPROVAL_FOR_CAZI,
    DELETE_APPROVAL_FOR_LP,
    DELETE_DECIMALS_FOR_LP,
    DELETE_DECIMALS_FOR_CAZI,
    SET_VALUES_FOR_CAZI_PRICE,
    SET_TRANSACTION_IN_PROGRESS,
    SET_LANGUAGE,
    SET_CIR_SUPP_FOR_LP,
    SET_TOTAL_FARMS,
    SET_TOTAL_STAKES,
    LOGIN_SUCCESS,
} from "../_actions/types";
import { httpPost } from "../_services/httpService";


export const setMetaMask = (content) => ({
    type: SET_ADDRESS,
    payload: content,
});

export const deleteMetaMask = () => ({ type: DELETE_META_MASK_ADDRESS });

export const setContract = (content) => ({
    type: SET_CONTRACT,
    payload: content,
});

export const deleteContract = () => ({
    type: DELETE_CONTRACT,
});

export const setApprovalForLp = (content) => ({
    type: SET_APPROVAL_FOR_LP,
    payload: content,
});

export const setApprovalForCazi = (content) => ({
    type: SET_APPROVAL_FOR_CAZI,
    payload: content,
});

export const deleteApprovalForLp = (content) => ({
    type: DELETE_APPROVAL_FOR_LP,
    payload: content,
});

export const deleteApprovalForCazi = (content) => ({
    type: DELETE_APPROVAL_FOR_CAZI,
    payload: content,
});

//decimals
export const setDecimalsForLp = (content) => ({
    type: SET_DECIMALS_FOR_LP,
    payload: content,
});

export const setDecimalsForCazi = (content) => ({
    type: SET_DECIMALS_FOR_CAZI,
    payload: content,
});

export const deleteDecimalsForLp = (content) => ({
    type: DELETE_DECIMALS_FOR_LP,
    payload: content,
});

export const deleteDecimalsForCazi = (content) => ({
    type: DELETE_DECIMALS_FOR_CAZI,
    payload: content,
});

export const setTransactionInProgress = (content) => ({
    type: SET_TRANSACTION_IN_PROGRESS,
    payload: content,
});

export const setValuesForCaziPrice = (content) => ({
    type: SET_VALUES_FOR_CAZI_PRICE,
    payload: content,
});

export const setLPCirSupp = (content) => ({
    type: SET_CIR_SUPP_FOR_LP,
    payload: content,
});

export const setTotalStakes = (content) => ({
    type: SET_TOTAL_STAKES,
    payload: content,
});
export const setTotalFarms = (content) => ({
    type: SET_TOTAL_FARMS,
    payload: content,
});

export const setLanguage = (content) => {
    return { type: SET_LANGUAGE, payload: content };
};



export const metaMaskeLoginToken = userInfo => dispatch => {
    httpPost(`get_metamask_nonce/`, userInfo)
        .then(res => {
            return Promise.resolve(res.data);
            // localStorage.setItem('nonceToken', res.data.nonce);
            // dispatch({
            //     type: LOGIN_SUCCESS,
            //     payload: res.data,
            // });
            // showNotification(
            //     "Login Successfully!",
            //     `${res.message}`,
            //     "success",
            //     4000
            // );
        });
};
export const metaMaskeLogin = userInfo => dispatch => {
    httpPost(`metamask_login/`, userInfo)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });
            return Promise.resolve(res);
            // showNotification(
            //     "Login Successfully!",
            //     `${res.message}`,
            //     "success",
            //     4000
            // );
        });
};