import { httpPost, httpGet, httpPut } from '../_services/httpService';
import { HandleErrors } from './handelErrors';


export const withdraw = (data) => (dispatch) => {
    return httpPost('games/withdraw/', data, true).then(res => {
        return Promise.resolve(res.data);
    }).catch((error) => {
        dispatch(HandleErrors(error.response));
        return Promise.reject(error.response);
    })
}
export const withdrawHistory = (size) => (dispatch) => {
    return httpGet(`games/withdraw-history/?size=${size}` ,true).then(res => {
        return Promise.resolve(res);
    }).catch((error) => {
        return Promise.resolve(error.response);
    })
}
export const withdrawHistoryWithNext = (nextUrl) => (dispatch) => {
    return httpGet(`${nextUrl}` ,true).then(res => {
        return Promise.resolve(res);
    }).catch((error) => {
        return Promise.resolve(error.response);
    })
}

export const depositHistory = (size) => (dispatch) => {
    return httpGet(`games/deposit-history/?size=${size}` ,true).then(res => {
        return Promise.resolve(res);
    }).catch((error) => {
        return Promise.resolve(error.response);
    })
}

export const depositHistoryWithNext = (nextUrl) => (dispatch) => {
    return httpGet(`${nextUrl}` ,true).then(res => {
        return Promise.resolve(res);
    }).catch((error) => {
        return Promise.resolve(error.response);
    })
}

export const betAndWonHistory = (type,size) => (dispatch) => {
    return httpGet(`games/game-play-history/?type=${type}&size=${size}` ,true).then(res => {
        return Promise.resolve(res);
    }).catch((error) => {
        return Promise.resolve(error.response);
    })
}
export const betAndWonHistoryNext = (nextUrl) => (dispatch) => {
    return httpGet(`${nextUrl}` ,true).then(res => {
        return Promise.resolve(res);
    }).catch((error) => {
        return Promise.resolve(error.response);
    })
}


export const totalBalance = ()=>(dispatch)=>{
    return httpGet(`games/user-balance/` ,true).then(res => {
        return Promise.resolve(res);
    }).catch((error) => {
        return Promise.resolve(error.response);
    })
}

export const generateQrCode = ()=>(dispatch)=>{
    return httpGet(`secret-key-2fa/` ,true).then(res => {
        return Promise.resolve(res.data);
    }).catch((error) => {
        return Promise.resolve(error.response);
    })
}

export const enable2Fa = (data)=>(dispatch)=>{
    return httpPut(`update_2fa/` ,data,true).then(res => {
        return Promise.resolve(res.data);
    }).catch((error) => {
        console.log("in catch", error)
        return Promise.reject(error);
    })
}

export const disable2Fa = (data)=>(dispatch)=>{
    return httpPut(`update_2fa/` ,data,true).then(res => {
        return Promise.resolve(res.data);
    }).catch((error) => {
        return Promise.reject(error);
    })
}



