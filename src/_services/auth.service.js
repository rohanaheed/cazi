import SessionStorage from './sessionStorageService';
const sessionStorage = new SessionStorage();

export const IsUserLogin = () => {
    return sessionStorage.getSessionStorage('loggedIn') ? sessionStorage.getSessionStorage('loggedIn') : false;
}

