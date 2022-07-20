import { httpGet, httpGetNews } from '../_services/httpService';
//import { showNotification } from "../components/Notifications/showNotification";
import { HandleErrors } from './handelErrors';

export const getEvolutionGamesList = ()=> (dispatch) =>{
    return httpGet('betrnk/provider-game-list/?provider_name=EvolutionGaming%20Direct', false).then(res => {
        return Promise.resolve(res.data);
    }, err => {
        // showNotification(
        //     "Home",
        //     `There is some issue. Please try again`,
        //     "danger",
        //     4000
        // );
        return Promise.resolve();
    })
}



export const getLiveGamesList = ()=> (dispatch) =>{
    return httpGet('cb/slotegrator-game-types/', false).then(res => {
        return Promise.resolve(res.data);
    }, err => {
        // showNotification(
        //     "Home",
        //     `There is some issue. Please try again`,
        //     "danger",
        //     4000
        // );
        return Promise.resolve();
    })
}

export const getWinnersList = ()=> (dispatch) =>{
    return httpGet('rolling/lastest-winner/?page=1 ', false).then(res => {
        return Promise.resolve(res.data);
    }, err => {
        // showNotification(
        //     "Home",
        //     `There is some issue. Please try again`,
        //     "danger",
        //     4000
        // );
        return Promise.resolve();
    })
}


export const getSlotsList = ()=> (dispatch) =>{
    return httpGet('cb/slotegrator-games/v2/?type=slots', false).then(res => {
        return Promise.resolve(res.data);
    }, err => {
        // showNotification(
        //     "Home",
        //     `There is some issue. Please try again`,
        //     "danger",
        //     4000
        // );
        return Promise.resolve();
    })
}

export const getGameUrl = (id, exit_url)=>(dispatch) =>{
    let url = `betrnk/get_game_url/?game_id=${id}`
    if(exit_url){
        url = `betrnk/get_game_url/?game_id=${id}&exit_url=${exit_url}`
    }
    return httpGet(url, true).then(res => {
        return Promise.resolve(res.data);
    }).catch(error=>{
            dispatch(HandleErrors(error.response));
            let msg = 'There is some issue. Please try again.';
            if(error.response.data.code === 'token_not_valid'){
                msg = 'Please login first to play the game.'
            }
            // showNotification(
            //     "Game",
            //     msg,
            //     "danger",
            //     4000
            // );
            return Promise.reject(error.response);
    })
}

export const getGameUrlOpen = (id, uuid, exit_url)=>(dispatch) =>{
    let url = `betrnk/v2/get_game_url/?game_id=${id}&uuid=${uuid}`
    if(exit_url){
        url = `betrnk/v2/get_game_url/?game_id=${id}&uuid=${uuid}&exit_url=${exit_url}`
    }
    return httpGet(url, false).then(res => {
        return Promise.resolve(res.data);
    }).catch(error=>{
            let msg = 'There is some issue. Please try again.';
            if(error.response.data.code === 'token_not_valid'){
                msg = 'Please login first to play the game.'
            }
            // showNotification(
            //     "Game",
            //     msg,
            //     "danger",
            //     4000
            // );
            return Promise.reject(error.response);
    })
}



export const getProvidersList = ()=> (dispatch) =>{
    return httpGet('betrnk/providers/?limit=65', false).then(res => {
        return Promise.resolve(res.data.results);
    }, err => {
        // showNotification(
        //     "Home",
        //     `There is some issue. Please try again`,
        //     "danger",
        //     4000
        // );
        return Promise.resolve();
    })
}

export const getProviderGameType = (provider)=>(dispatch) =>{
    return httpGet(`betrnk/v2/game_types/?provider_id=${provider}`, false).then(res => {
        return Promise.resolve(res.data);
    }, err => {
        // showNotification(
        //     "Home",
        //     `There is some issue. Please try again`,
        //     "danger",
        //     4000
        // );
        return Promise.resolve();
    })
}


export const getGamesList = (provider,type)=>(dispatch) =>{
    return httpGet(`betrnk/v2/provider_games/?provider_id=${provider}&game_type=${type}`, false).then(res => {
        return Promise.resolve(res.data);
    }, err => {
        // showNotification(
        //     "Home",
        //     'There is some issue. Please try again.',
        //     "danger",
        //     4000
        // );
        return Promise.resolve();
    })
}
export const getLiveGameList = ()=>(dispatch) =>{
    return httpGet(`betrnk/games/`, false).then(res => {
        return Promise.resolve(res.data);
    }, err => {
        // showNotification(
        //     "Home",
        //     'There is some issue. Please try again.',
        //     "danger",
        //     4000
        // );
        return Promise.resolve();
    })
}
export const getSlotGameList = (game_type)=>(dispatch) =>{
    return httpGet(`betrnk/games/?game_type=${game_type}`, false).then(res => {
        return Promise.resolve(res.data);
    }, err => {
        // showNotification(
        //     "Home",
        //     'There is some issue. Please try again.',
        //     "danger",
        //     4000
        // );
        return Promise.resolve();
    })
}



export const getNewsList = (clientId)=>(dispatch) =>{
    return httpGetNews(`@${clientId}`, false).then(res => {
        return Promise.resolve(res.data);
    }, err => {
        // showNotification(
        //     "Home",
        //     'There is some issue. Please try again.',
        //     "danger",
        //     4000
        // );
        return Promise.resolve();
    })
}


export const getUserBalance = (provider,type)=>(dispatch) =>{
    return httpGet(`games/user-balance/`, true).then(res => {
        return Promise.resolve(res.data);
    }, err => {
        dispatch(HandleErrors(err.response));
        return Promise.resolve();
    })
}
