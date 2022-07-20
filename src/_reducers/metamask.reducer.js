import {
    SET_ADDRESS,
    SET_CONTRACT,
    DELETE_CONTRACT,
    DELETE_META_MASK_ADDRESS,
    SET_APPROVAL_FOR_LP,
    SET_DECIMALS_FOR_CAZI,
    SET_APPROVAL_FOR_CAZI,
    SET_DECIMALS_FOR_LP,
    DELETE_APPROVAL_FOR_CAZI,
    DELETE_APPROVAL_FOR_LP,
    DELETE_DECIMALS_FOR_CAZI,
    DELETE_DECIMALS_FOR_LP,
    SET_VALUES_FOR_CAZI_PRICE,
    SET_TRANSACTION_IN_PROGRESS,
    SET_LANGUAGE,
    SET_CIR_SUPP_FOR_LP,
    SET_TOTAL_STAKES,
    SET_TOTAL_FARMS,
    LIVE_PRICE,
    USER_BALANCE,
    SET_CAZI_BALANCE,
    UPDATE_USER_BALANCE,
    SET_WALLET_PROVIDER,
    DELETE_WALLET_PROVIDER
} from "../_actions/types";

const initialState = {
    metaMaskAddress: "",
    contract: null,

    stakingContract: null,
    BNBCaziPrice: null,
    BNBPrice: null,
    caziPriceDollar: null,

    decimalsForLp: "",
    decimalsForCazi: "",

    approvalForLp: false,
    approvalForCazi: false,

    bnbPriceDollar: "",
    caziBNBPriceDollar: "",

    transactionInProgress: false,
    language: "en",

    noOfCazi: 0,
    noOfBNB: 0,

    circulatingSuppLp: 0,

    totalFarms: 0,
    totalStakes: 0,
    user_balance_data : '',
    caziBalance : 0,
    update_user_balance : false,
    provider : ''
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_WALLET_PROVIDER:
        return {
            ...state,
            provider: {...payload},
        };
        case DELETE_WALLET_PROVIDER:
        return {
            ...state,
            provider: payload,
        };
        case SET_ADDRESS:
            return {
                ...state,
                metaMaskAddress: payload,
            };
        case SET_CONTRACT:
            return {
                ...state,
                contract: payload,
                stakingContract: {...payload.stakingContract}
            };
        case DELETE_META_MASK_ADDRESS:
            return {
                ...state,
                metaMaskAddress: "",
            };
        case SET_CAZI_BALANCE:
            return {
                ...state,
                caziBalance: payload,
            };
        case DELETE_CONTRACT:
            return {
                ...state,
                contract: "",
            };

        case SET_DECIMALS_FOR_LP:
            return {
                ...state,
                decimalsForLp: payload,
            };
        case SET_DECIMALS_FOR_CAZI:
            return {
                ...state,
                decimalsForCazi: payload,
            };
        case SET_APPROVAL_FOR_LP:
            return {
                ...state,
                approvalForLp: payload,
            };
        case SET_APPROVAL_FOR_CAZI:
            return {
                ...state,
                approvalForCazi: payload,
            };

        case DELETE_DECIMALS_FOR_LP:
            return {
                ...state,
                decimalsForLp: payload,
            };
        case DELETE_DECIMALS_FOR_CAZI:
            return {
                ...state,
                decimalsForCazi: payload,
            };
        case DELETE_APPROVAL_FOR_LP:
            return {
                ...state,
                approvalForLp: payload,
            };
        case DELETE_APPROVAL_FOR_CAZI:
            return {
                ...state,
                approvalForCazi: payload,
            };

        case SET_VALUES_FOR_CAZI_PRICE:
            return {
                ...state,
                caziBNBPriceDollar: payload.caziBNBPriceDollar,
                bnbPriceDollar: payload.bnbPriceDollar,
                noOfCazi: payload.noOfCazi,
                noOfBNB: payload.noOfBNB,
            };

        case SET_CIR_SUPP_FOR_LP:
            return {
                ...state,
                circulatingSuppLp: action.payload,
            };

        case SET_TOTAL_FARMS:
            return {
                ...state,
                totalFarms: action.payload,
            };
        case SET_TOTAL_STAKES:
            return {
                ...state,
                totalStakes: action.payload,
            };

        case SET_TRANSACTION_IN_PROGRESS:
            return {
                ...state,
                transactionInProgress: payload,
            };
        case SET_LANGUAGE:
            return {
                ...state,
                language: payload,
            };

        case LIVE_PRICE:
            return {
                ...state,
                BNBCaziPrice: payload.BNBCaziPrice,
                BNBPrice: payload.BNBPrice,
                caziPriceDollar: payload.BNBCaziPrice * payload.BNBPrice
            };

        case USER_BALANCE:
            return {
                ...state,
                user_balance_data: payload,
        };

        case UPDATE_USER_BALANCE:
            return {
                ...state,
                update_user_balance: payload,
        };

       

        default:
            return state;
    }
}