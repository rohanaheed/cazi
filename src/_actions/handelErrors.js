import {ClearStorageForNoUser} from './auth.actions';

export const HandleErrors =  (error) => (dispatch) => {
    if(error){
        switch(error.status) {
            case 401 || '401': 
                dispatch(ClearStorageForNoUser(true));
                break;
            default:
                console.log('There is some error');
                break;
        }
    }
   
}