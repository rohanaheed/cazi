
import { httpGet } from '../_services/httpService';


export const getDeatils = ()=> (dispatch) =>{
    return httpGet('betrnk/provider-list/', false).then(res => {
        return Promise.resolve(res.data);
    }, err => {

        return Promise.resolve();
    })
}
export const getUserProfile = ()=> (dispatch) =>{
    return httpGet('profile/', true).then(res => {
        return Promise.resolve(res.data);
    }, err => {

        return Promise.resolve();
    })
}
