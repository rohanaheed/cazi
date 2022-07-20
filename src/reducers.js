/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import history from "./utils/history";
import metamaskReducer from './_reducers/metamask.reducer';
import authReducer from './_reducers/auth.reducer';

//import globalReducer from './reducer';
// import languageProviderReducer from 'containers/LanguageProvider/reducer';
/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */


export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    //global: globalReducer,
    // userInfo: userDetailsReducer,
    // userProfile: userProfileReducer,
    loginDetails : authReducer,
    router: connectRouter(history),
    metamaskReducer,
    ...injectedReducers,
  });

  return rootReducer;
}
