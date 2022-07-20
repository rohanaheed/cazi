import axios from 'axios';
// import React, { Component } from 'react';
// import {environment} from '../environment';
// import {ClearStorageForNoUser} from '../_actions/auth.actions';
// import configureStore from './../configureStore';
// import { LOGOUT } from '../_actions/types';
// const store = configureStore()
/*
let userToken = null;
const checkUserToken = () => {
    userToken = 'asdasd';
    return;
    // const sessionUserToken = this.sessionStorage.getSessionStorage('userToken');
    // this.storageService.getSessionStorage().then((res) => {
    //     if (res) {
    //         this.userToken = res.token;
    //         // this.replaceToken(sessionUserToken.token, res.token);
    //     }
    //     else{
    //         // this.logoutUser(sessionUserToken.token)
    //     }
    // });
};
*/
const getToken = () => {
    let sessionUserToken;
    try {
        const user = sessionStorage.getItem('loginUser');
        sessionUserToken = user && JSON.parse(user).AccessToken;
     //  sessionUserToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjE5MDk2NTEyLCJqdGkiOiJjMjRmZDFmOGI2YWE0OTIyOTY1MjdhZjVhZjdkOGFjNCIsInVzZXJfaWQiOjMwfQ.lLwo6lV9WLYEj6HcW_q1dqlZhr8nk6w84zIsblFD5EI';
        return sessionUserToken.replace(/['"]+/g, '');
    } catch (e) {
    }
};



/*const setHeaders = () => {
    let headers = new Headers();
        
    // if (sendJWT) {
    //   userToken = '';
    //   this.checkUserToken();
    //   checkUserToken();
    //   const sessionUserToken = JSON.parse(sessionStorage.userToken || null);
    //   if (this.socialUserToken) {
    //     headers = headers.append('Authorization', 'JWT ' + this.socialUserToken);
    //   } else if (this.getToken()) {
    headers.append('Authorization', 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1MzU2OCwidXNlcm5hbWUiOiJ6YWhpZCIsImV4cCI6MTYxMTA1NTAyNiwiZW1haWwiOiJ6YWhpZDEyM0B5b3BtYWlsLmNvbSIsIm9yaWdfaWF0IjoxNjExMDUxNDI2fQ.Gpx5JvTVCpYLXfvau4WIwt9dJF1T_AjXexll6bJL6HQ');
    //   }
    // }
    return headers;
};
*/

export const httpPost = (url, data, sendToken) => {
    let authToken = "";
    if (sendToken) {
        authToken = 'JWT '+ getToken();
    }
    return axios.post(process.env.REACT_APP_API_URL + url, data, {
        headers: {
            'Authorization': authToken //'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjEyMjY3MTI1LCJqdGkiOiI5NjIzYzMyNmFlOWM0NjA2ODUwN2I0MDE2ZGQ1YTRkMyIsInVzZXJfaWQiOjEwfQ.7Hc2eQBYLfdDrRBwHnTW49jLYjsnQq0Y7xNJHcxOWyg'
        }
    });
};

export const httpPostForLogin = (url, data, sendToken) => {
    let authToken = "";
    if (sendToken) {
      authToken = "JWT " + getToken()
    }
    return axios.post(url, data, {
      headers: {
        Authorization: authToken, //'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjEyMjY3MTI1LCJqdGkiOiI5NjIzYzMyNmFlOWM0NjA2ODUwN2I0MDE2ZGQ1YTRkMyIsInVzZXJfaWQiOjEwfQ.7Hc2eQBYLfdDrRBwHnTW49jLYjsnQq0Y7xNJHcxOWyg'
      },
    });
  };

export const httpGet = (url, sendToken) => {
    let authToken = "";
    if (sendToken) {
        authToken = 'JWT '+ getToken();
    }
    return axios.get(process.env.REACT_APP_API_URL+ url, {
        headers: {
            'Authorization': authToken
            // 'Authorization' : 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjEyMjY3MTI1LCJqdGkiOiI5NjIzYzMyNmFlOWM0NjA2ODUwN2I0MDE2ZGQ1YTRkMyIsInVzZXJfaWQiOjEwfQ.7Hc2eQBYLfdDrRBwHnTW49jLYjsnQq0Y7xNJHcxOWyg'
        }
    })
}

export const httpGetNews = (url, sendToken) => {
    // let authToken = "";
    return axios.get(process.env.REACT_APP_MEDIUM_FEED_URL+ url, {
    })
}



export const httpPut = (url, dataTosend, sendToken) => {
    let authToken = "";
    if (sendToken) {
        authToken = 'JWT '+ getToken();
    }
    return axios.put(process.env.REACT_APP_API_URL + url, dataTosend, {
        headers: {
            'Authorization': authToken 
        }
    });
}
export const httpDelete = (url, sendToken) => {
    let authToken = "";
    if (sendToken) {
        authToken = 'JWT '+ getToken();
    }
    return axios.delete(process.env.REACT_APP_API_URL + url, {
        headers: {
            'Authorization': authToken 
        }
    });
}

