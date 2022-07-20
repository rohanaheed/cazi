export default class SessionStorageService {
    // getState = null;
    userInfo = null;
    // constructor(
    //   private store
    // ) {
    //   this.getState = this.store.select(selectAuthState);
    //   this.getState.subscribe(async (state) => {
    //     this.userInfo = await state.user;
    //   });
    // }
  
    // call this function when you set new user register and need to set profile .
    // Pass token then its call => profile api and set user profile in our store state.
    // It used in register & reset-password page.
    updateUserStateWithToken(data) {
      // this.store.dispatch(new SetUserProfile({ token: data.token }));
    }
  
    // call this function when you have to update existing user data.
    // pass whole updated user data to update it update our store state.
    // It used in setting page
    updateUserState(data) {
      // this.store.dispatch(new UpdateUserInfo(data));
    }
  
    // call this function for get user profile detail from our store state.
    getFromSession(key) {
      return this.userInfo;
    }
  
    saveToSession(key, value) {
      sessionStorage[key] = JSON.stringify(value);
    }

    clearAll() {
      sessionStorage.clear();
    }
  
    
  
    getSessionStorage(key) {
      if (sessionStorage[key]) {
        return JSON.parse(sessionStorage[key]);
      } else {
        return false;
      }
    }
 
    
    removeFromSessionStorage(key) {
        sessionStorage.removeItem(key);
    }
    
    saveToLocalStorage = (key, value) => {
        localStorage[key] = JSON.stringify(value);
    }
    
    getFromLocalStorage(key) {
      if (localStorage[key]) {
        return JSON.parse(localStorage[key]);
      } else {
        return false;
      }
    }
  
    removeFromLocalStorage(key) {
      localStorage.removeItem(key);
    }
  
    
  }
  