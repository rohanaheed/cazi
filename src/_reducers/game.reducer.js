import {GET_EVOLUTION_GAMES,GET_GAME_PROVIDERS,GET_LIVE_GAMES,GET_LAST_WINNERS,GET_GAME_SLOTS} from "../_actions/types";

const initialState = { 
  evolution_games_list: [], 
  game_providers_list: [],
  live_games_list: [],
  game_winners_list: [],
  game_slots_list: []
};
  
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      case GET_EVOLUTION_GAMES:
        return {
          ...state,
          evolution_games_list: payload,
        };
      case GET_GAME_PROVIDERS:
        return {
          ...state,
          game_providers_list: payload,
        };
        case GET_LIVE_GAMES:
        return {
          ...state,
          live_games_list: payload,
        };
        case GET_LAST_WINNERS:
        return {
          ...state,
          game_winners_list: payload,
        };
        case GET_GAME_SLOTS:
        return {
          ...state,
          game_slots_list: payload,
        };
      default:
        return state;
    }
  }