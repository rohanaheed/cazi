import { httpPost } from '../_services/httpService';
//import { showNotification } from "../components/Notifications/showNotification";

export const depositBalance = (amountInfo) => (dispatch) => {
    return httpPost('games/deposit/', amountInfo ,true).then(res => {
        // showNotification(
        //     "Success",
        //     `${res.data.message}`,
        //     "success",
        //     3000
        // );
        return Promise.resolve(res.data);
    }).catch((error) => {
        // showNotification(
        //     "Error",
        //     "Something went wrong while making the transaction",
        //     "danger",
        //     3000
        // );
        return Promise.resolve(error.response);
    })
}




