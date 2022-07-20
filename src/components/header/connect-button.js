import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useMetamask } from "use-metamask";
import Web3 from 'web3';
import Big from "big.js";
import '../header/header.scss';
// import {
//     providerUrlForCaziPrice
// } from "../../config/chainIds";
// import sampleAbi from "../../config/abi/sample";
// import LpAbi from "../../config/abi/LpAbi";
// import CaziAbi from "../../config/abi/CaziAbi";
// import StakingAbiTestNet from "../../config/abi/StakingAbiTestNet";
// import panCakeSwapAbi from "../../config/abi/panCakeSwapAbi";
// import caziBNBReserveAbi from "../../config/abi/caziBNBReserveAbi";
// import sampleAddress from "../../config/contractAddress/sample";
// import LPTokenAdd from "../../config/contractAddress/LPTokenAdd";
// import CaziTokenAdd from "../../config/contractAddress/CaziTokenAdd";
// import StakingContractAddTestNet from "../../config/contractAddress/StakingContractAddTestNet";
// import pancakeSwapAdd from "../../config/contractAddress/pancakeSwapAdd";
// import caziBNBReserveAdd from "../../config/contractAddress/caziBNBReserveAdd";
import { setContract, setLPCirSupp, setMetaMask, setTotalFarms, setTotalStakes, setValuesForCaziPrice } from '../../_actions/metamast.action';
import { LIVE_PRICE, SET_WALLET_PROVIDER, SET_ADDRESS, SET_CAZI_BALANCE, UPDATE_USER_BALANCE } from '../../_actions/types';
//import { showNotification } from '../Notifications/showNotification';
import { httpPost } from '../../_services/httpService';
import { LOGIN_SUCCESS, LOGOUT } from "../../_actions/types";
import { connect } from 'react-redux';
import DisconnectWalletModal from './disconnect-wallet-modal';
// import Web3 from 'web3';
import NotificationModel from '../notificationModel/notificationModel.js';
import insertComma from "../../utils/insertComma";
import { v4 as uuidv4 } from 'uuid';


import { ClearStorageForNoUser } from '../../_actions/auth.actions';
import { useWeb3React } from "@web3-react/core";
import '../header/header.scss';
import WalletSelectDialog from './WalletSelectDialogs';
import useAuth from './useAuth';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { convertLgNum } from '../../utils/convertValue';


const ConnectButton = (props) => {
    const [show] = useState(false);
    const userId = sessionStorage.getItem("id")
    const { metaMaskAddress, contract } = useSelector(state => state.metamaskReducer);
    const [user, setUser] = useState(userId ? [userId] : metaMaskAddress ? metaMaskAddress : '');
    const { metaState } = useMetamask();
    const [shouls, setShould] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [BNBPrice, setBNBPrice] = useState(0);
    const [BNBCaziPrice, setBNBCaziPrice] = useState(0);
    const [caziPrice, setCaziPrice] = useState(0);
    const [bnbPool, setBnbPool] = useState(0);
    const [caziPool, setCaziPool] = useState(0);
    const dispatch = useDispatch();
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    const [connectWalletLoader, setConnectWalletLoader] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState(false);
    const [caziDollarPrice, setCaziDollarPrice] = useState(0);
    let web3  = null;
    const [showWalletConnectDialog, setShowWalletConnectDialog] = useState(false);
    const { library } = useWeb3React();
    const disconnect = localStorage.getItem("disconnect");

    useEffect(() => {
        const loginUser = sessionStorage.getItem('loginUser')
        if (!web3) {
            if(sessionStorage.getItem('connectedWith') === 'metamask'){
                web3 = new Web3(window.ethereum);
                web3.eth.getAccounts(function (err, accounts) {
                    if ((accounts && !accounts.length) || (!accounts)) {
                        resetStorageOnLogout();
                    }
                    if ((typeof window.ethereum !== 'undefined') && (window.ethereum.networkVersion !== process.env.REACT_APP_CHAIN_ID) && loginUser) {
                        logoutUser();
                    }
                })
            }
            else if(sessionStorage.getItem('connectedWith') === 'binanceSmartChain'){
                web3 = new Web3(window.BinanceChain);
            }
        }
       
    })


    useEffect(() => {
        setInterval(() => {
            getBNBPrice();
            getBNBCaziPrice();
            getCaziPrice();
        }, 3000);
        checkCurrentLoginToken();
        setTimeout(()=>{
            addContract(sessionStorage.getItem('connectedWith'));
        }, 1000);
        const loginUser = sessionStorage.getItem('loginUser');
        const token = loginUser && JSON.parse(loginUser).AccessToken;
        setIsLoggedIn(loginUser && JSON.parse(loginUser).AccessToken);
        if (loginUser && JSON.parse(loginUser).AccessToken) {
            if(sessionStorage.getItem('connectedWith') === 'mobileWallet'){
                if(localStorage.getItem('walletconnect')){
                    login();
                }else{
                    resetStorageOnLogout();
                }
            }
           
            localStorage.setItem('alreadyLoggedIn', true);
        }
       
        if (!isLoggedIn) {
            sessionStorage.setItem('uuid', uuidv4())
        }

        //// If click anywhere, check current login token matches with session storage token, if not, log out the user
        document.body.addEventListener('click', checkCurrentLoginToken , true); 
    }, []);

    useEffect(() => {
        const data = props.state.metamaskReducer.user_balance_data
        setCaziDollarPrice(data.balance_str!=='' ? Number(data.balance_str) : 0)
    }, [props.state.metamaskReducer.user_balance_data]);
    const { login, logout } = useAuth();



    useEffect(() => {
        // if (window.screen.width > 768) {
        if(typeof library === "undefined" &&  
        sessionStorage.getItem('connectedWith') == 'mobileWallet' 
        && !localStorage.getItem('walletconnect')){
            resetStorageOnLogout();
        }
        if (typeof library !== "undefined") {
            const connector = new WalletConnect({
                bridge: "https://bridge.walletconnect.org", // Required
                qrcodeModal: QRCodeModal,
                rpc: {
                    [process.env.REACT_APP_CHAIN_ID]: process.env.REACT_APP_HTTP_PROVIDER,
                },
            });
            const loggedIn = sessionStorage.getItem('loginUser') && JSON.parse(sessionStorage.getItem('loginUser')).AccessToken;
            if(!sessionStorage.getItem('id') && localStorage.getItem('walletconnect')){
                handleMobileWalletSignIn(library, connector);
            }else if(loggedIn && library && 
                sessionStorage.getItem('connectedWith') == 'mobileWallet'){
                setTimeout(()=>{
                    addContract('mobileWallet', library);
                }, 1000)
            }
        }
        if(disconnect){
            logoutUser();
        }
    // }
      }, [library, disconnect]);

    window.onbeforeunload = (e) => {
        if (sessionStorage.getItem('id') && !sessionStorage.getItem('signature') && 
        sessionStorage.getItem('connectedWith') !== 'mobileWallet') {
            resetStorageOnLogout();
        }
    };

    const showNotificationFn = (message) => {
        document.getElementsByTagName("BODY")[0].style.paddingTop = "26px";
        setNotificationMsg(message);
        setShowNotificationModal(true);
        setTimeout(() => {
            document.getElementsByTagName("BODY")[0].style.paddingTop = "0px";
            setNotificationMsg('');
            setShowNotificationModal(false);
        }, 3000)
    }

   

    const checkCurrentLoginToken = ()=>{
        const user = sessionStorage.getItem('loginUser');
        const sessionToken = user && JSON.parse(user).AccessToken;
        const activeUserToken = localStorage.getItem('activeUserToken');
        if(activeUserToken && sessionToken && (sessionToken !== activeUserToken)){
            dispatch(ClearStorageForNoUser(false));
        }
    }

    useEffect(() => {
        if (!sessionStorage.getItem('loginUser')) {
            setIsLoggedIn(false);
            setUser('');
        }
    }, [props.state.loginDetails])


    useEffect(() => {
        if (BNBCaziPrice && BNBPrice) {
            props.livePrice(BNBCaziPrice * BNBPrice);
            let livePrice = BNBCaziPrice * BNBPrice;
            dispatch({
                type: LIVE_PRICE,
                payload: {
                    BNBCaziPrice,
                    BNBPrice
                }
            })
        }
    }, [BNBCaziPrice, BNBPrice])


   

    const handleSignIn = () => {
        if (typeof window.ethereum === 'undefined') {
            showNotificationFn('Please install metamask to connect wallet');
            return;
        }
        else if (window.ethereum.networkVersion !== process.env.REACT_APP_CHAIN_ID) {
            document.getElementsByTagName("BODY")[0].style.paddingTop = "26px";
            showNotificationFn('Please change your metamask network.');
            return;
        }
        else if (!metaState.isConnected) {
            (async () => {
                try {
                    const account = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    if (!sessionStorage.getItem("id")) {
                        sessionStorage.setItem("id", account);
                        sessionStorage.setItem('connectedWith', 'metamask');
                        setShould(true);
                        setUser(account);
                        dispatch({
                            type: SET_ADDRESS,
                            payload: account
                        });
                    }

                } catch (error) {
                    // showNotification(
                    //     "Error",
                    //     `${error.message}`,
                    //     "danger",
                    //     4000
                    // );
                }
            })();
        }
        setTimeout(() => {
            document.getElementsByTagName("BODY")[0].style.paddingTop = "0";
        }, 3000)
    };


    const handleBinanceChainSignIn = ()=>{
        web3 = new Web3(window.BinanceChain)
        if(typeof window.BinanceChain === 'undefined'){
            showNotificationFn('Please install binance chain wallet to connect');
            return;
        }
        // if (window.screen.width > 768) {
            if (typeof window.BinanceChain !== "undefined") {
            let ethereum = window.BinanceChain;
            if (window.BinanceChain.chainId !== process.env.REACT_APP_BINANCE_CHAIN_ID) {
                showNotificationFn('Please change your network');
                return;
            }
            (async () => {
                try {
                    
                    const accounts = await ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    if(accounts && accounts.length > 0){
                        const userInfo = {
                            metamask_id: accounts[0],
                            metamask_token: accounts[0]
                        }
                        if(!sessionStorage.getItem('id')){
                            sessionStorage.setItem('id', accounts[0]);
                            sessionStorage.setItem('connectedWith', 'binanceSmartChain')
                            setUser(accounts);
                            dispatch({
                                type: SET_ADDRESS,
                                payload: accounts[0]
                            });
                            web3 = new Web3(window.BinanceChain);
                            setConnectWalletLoader(true);

                        httpPost(`get_metamask_nonce/`, userInfo)
                            .then(async res =>  {
                                setConnectWalletLoader(false);
                                let nonceToken = res.data.nonce;
                                let sign = await window.BinanceChain.request(
                                {method: "eth_sign", 
                                params: [accounts[0], 
                                `I am signing my one-time nonce: ${nonceToken}`]})
                                if(sign){
                                    sessionStorage.setItem("signature", sign)
                                    loginUser(sign, accounts[0])
                                    addContract('binanceSmartChain');
                                }
                                else{
                                    sessionStorage.removeItem('id');
                                    sessionStorage.removeItem('signature');
                                    setUser('');
                                }
                            })
                            .catch(err => {
                                setConnectWalletLoader(false);
                                resetStorageOnLogout();
                            })
                        }
                    }
                } catch(error){

                }
            })()
            
            // sessionStorage.setItem("id", accounts);
            }   
    }

    const handleMobileWalletSignIn = (library, connector)=>{
        if(library.accounts && library.accounts.length > 0){
            dispatch({
                type: SET_ADDRESS,
                payload: library.accounts
            });
            sessionStorage.setItem('id', library.accounts[0]);
            sessionStorage.setItem('connectedWith', 'mobileWallet');
            setUser(library.accounts);
            const userInfo = {
                metamask_id: library.accounts[0],
                metamask_token: library.accounts[0]
            }
            httpPost(`get_metamask_nonce/`, userInfo)
            .then(res => {
                const msgParams = [
                    ( `I am signing my one-time nonce: ${res.data.nonce}`),                                                 // Required
                    library.accounts[0] // Required
                ];
                let sign = connector.signPersonalMessage(msgParams);
                sign.then(response => {
                    sessionStorage.setItem("signature", response);
                    loginUser(response, library.accounts[0]);
                    addContract('mobileWallet', library);
                }).catch(err =>{
                    sessionStorage.removeItem('id');
                    sessionStorage.removeItem('signature');
                    setUser('');
                    logout();
                    localStorage.removeItem('walletconnect');
                    console.log(err)
                })
            })
            .catch(err => {
                setConnectWalletLoader(false);
                resetStorageOnLogout();
            })
        }
        
    }

   



    const afterSignIn = (sign) => {
        sign.then(response => {
            sessionStorage.setItem('id', user)
            sessionStorage.setItem("signature", response);
            addContract('metamask');
            loginUser(response);
        })

        sign.catch(err => {
            sessionStorage.removeItem('id');
            sessionStorage.removeItem('signature');
            setShould(false);
            setUser('');
            // showNotification(
            //     "ERROR",
            //     `${err.message}`,
            //     "danger",
            //     4000
            // );
        })
    }

    useEffect(() => {
        if (user && shouls && sessionStorage.getItem('connectedWith') === 'metamask') {
            const userInfo = {
                metamask_id: user[0],
                metamask_token: user[0]
            }
            if (!web3) {
                web3 = new Web3(window.ethereum);
            }
            setConnectWalletLoader(true);
            httpPost(`get_metamask_nonce/`, userInfo)
                .then(res => {
                    setConnectWalletLoader(false);
                    let nonceToken = res.data.nonce
                    let sign = web3.eth.personal.sign(`I am signing my one-time nonce: ${nonceToken}`, user[0], '');
                    afterSignIn(sign)
                    setShould(false);
                })
                .catch(err => {
                    setConnectWalletLoader(false);
                    resetStorageOnLogout();
                    // showNotification(
                    //     "ERROR",
                    //     `${err.message}`,
                    //     "danger",
                    //     4000
                    // );
                })
        }
    }, [user, shouls, show])


    window.ethereum !== undefined && window.ethereum.on("accountsChanged", (accounts) => {
        if (!accounts || !accounts.length) {
            resetStorageOnLogout();
        }
        else if (accounts && user) {
            if (accounts[0] !== user[0]) {
                logoutUser();
            }
        }
    });



    const getStatsWithOutMetaMask = (conObj) => {
        const contrt = contract ? contract : conObj;
        if (contrt) {
            contrt.panCakeSwapContract.methods
                .getReserves()
                .call()
                .then((res) => {
                    const bnbPriceDollar = parseInt(res[1]) / parseInt(res[0]);
                    contrt.caziBNBReserveContract.methods
                        .getReserves()
                        .call()
                        .then((res) => {
                            const caziBNBPriceDollar = parseInt(res[1]) / parseInt(res[0]);
                            dispatch(setValuesForCaziPrice({
                                bnbPriceDollar,
                                caziBNBPriceDollar,
                                noOfCazi: parseInt(res[0]) / Math.pow(10, 18),
                                noOfBNB: parseInt(res[1]) / Math.pow(10, 18),
                            }));
                        })
                        .catch((err) => {
                        });
                })
                .catch((err) => {
                });

            contrt?.caziBNBReserveContract?.methods
                .totalSupply()
                .call()
                .then((res) => {
                    dispatch(setLPCirSupp(parseInt(res) / Math.pow(10, 18)));
                })
                .catch((err) => {
                    // console.log("err in LP CS", err);
                });

            contrt.stakingContract.methods
                .totalFarms()
                .call()
                .then((res) => {
                    dispatch(setTotalFarms(parseInt(res)));
                })
                .catch((err) => {
                    // console.log("err totalFarms in nav", err);
                });

            contrt.stakingContract.methods
                .totalStakes()
                .call()
                .then((res) => {
                    dispatch(setTotalStakes(parseInt(res)));
                })
                .catch((err) => {
                    // console.log("err totalStakes in sidenav", err);
                });
        }
    }

    useEffect(() => {
        getStatsWithOutMetaMask();
    }, [contract]);

    const loginUser = (sign, address) => {
        let signature = sessionStorage.getItem("signature");
        if (signature) {
            const userInfoData = {
                signature: sign,
                metamask_token: address ? address : user[0]
            }
            httpPost(`metamask_login/`, userInfoData)
                .then(res => {
                    if (res && res.data && res.data.status === true) {
                        sessionStorage.setItem("loginUser", JSON.stringify(res.data))
                        localStorage.setItem("activeUserToken", (res.data.AccessToken))
                        setIsLoggedIn(true);
                        getCaziPrice();
                        sessionStorage.removeItem('uuid')
                        localStorage.setItem('alreadyLoggedIn', true);
                        dispatch({
                            type: LOGIN_SUCCESS,
                            payload: res.data,
                        });
                        dispatch({ type: UPDATE_USER_BALANCE, payload: true });

                        // showNotification(
                        //     "Logged In",
                        //     `${res.data.message}`,
                        //     "success",
                        //     4000
                        // );
                    }
                    else if(res && res.data && res.data.status === false){
                        setUser('');
                        resetStorageOnLogout();
                        showNotificationFn('Login failed')
                    }
                }).catch(err =>{
                    setUser('');
                    resetStorageOnLogout();
                    showNotificationFn('Login failed')
                })
        }
    }

    const logoutUser = () => {
        dispatch({
            type: LOGOUT,
            payload: null,
        });
        if(sessionStorage.getItem('connectedWith') === 'mobileWallet'){
            logout();
        }
        resetStorageOnLogout();
        // showNotification(
        //     "Logged Out",
        //     `You are succesfully logged out`,
        //     "success",
        //     4000
        // );
    }

    const resetStorageOnLogout = () => {
        sessionStorage.clear();
        localStorage.removeItem('alreadyLoggedIn');
        localStorage.removeItem('walletconnect');
        setIsLoggedIn(false);
        setUser('');
        sessionStorage.setItem("clear", true);
        sessionStorage.setItem('uuid', uuidv4())
    }
    const openDisconnectWalletModal = () => {
        setShowDisconnectModal(true);
    }

    const disconnectWallet = () => {
        hideDisconnectModal();
        logoutUser();
    }

    const hideDisconnectModal = () => {
        setShowDisconnectModal(false);
    }

    const showAfterDec = (value) => {
        let point = (parseFloat(value).toFixed(2)).toString().split(".");
        let result = (point[0]) + "." + point[1].substring(0, 2);
        return result
    }

    const divideNo = (res) => {
        if (typeof res === "string" && res === "") {
            res = "0";
        }
        let bigNo = new Big(res);
        let bigNo1 = new Big(Math.pow(10, 18));
        let number = bigNo.div(bigNo1).toFixed(18);
        return number;
    }

    const getCaziPrice = () => {
        (async () => {
            try {
                let minABI = JSON.parse(process.env.REACT_APP_NET_ABI);
                let tokenAddress = process.env.REACT_APP_TOKEN_ADD;
                const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_HTTP_PROVIDER));
                let contract = new web3.eth.Contract(minABI, tokenAddress);
                if (contract) {
                    await contract.methods.balanceOf(sessionStorage.getItem('id')).call()
                        .then((res) => {
                            setCaziPrice(divideNo(res));
                            sessionStorage.setItem("cuziPrize", showAfterDec(divideNo(res)))
                            dispatch({
                                type: SET_CAZI_BALANCE,
                                payload: (divideNo(res)),
                            });
                        })
                        .catch((err) => {
                        })
                }
            }
            catch { }
        })();

    }


    const getBNBPrice = () => {
        (async () => {
            try {
                return new Promise(async (resolve, reject) => {
                    //pancake spawe
                    let newPoolAddr = "0x1B96B92314C44b159149f7E0303511fB2Fc4774f";
                    let newPoolAbi = [{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount1", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount1", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount0In", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount1In", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount0Out", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount1Out", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "Swap", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint112", "name": "reserve0", "type": "uint112" }, { "indexed": false, "internalType": "uint112", "name": "reserve1", "type": "uint112" }], "name": "Sync", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "constant": true, "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "MINIMUM_LIQUIDITY", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "PERMIT_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }], "name": "burn", "outputs": [{ "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "internalType": "uint256", "name": "amount1", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getReserves", "outputs": [{ "internalType": "uint112", "name": "_reserve0", "type": "uint112" }, { "internalType": "uint112", "name": "_reserve1", "type": "uint112" }, { "internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_token0", "type": "address" }, { "internalType": "address", "name": "_token1", "type": "address" }], "name": "initialize", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "kLast", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }], "name": "mint", "outputs": [{ "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "price0CumulativeLast", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "price1CumulativeLast", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }], "name": "skim", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "amount0Out", "type": "uint256" }, { "internalType": "uint256", "name": "amount1Out", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "swap", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "sync", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "token0", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "token1", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }]

                    const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
                    const contract = new web3.eth.Contract(newPoolAbi, newPoolAddr)
                    if (contract) {
                        await contract.methods.getReserves().call().then(function (info) {
                            var newCaziPool = info[0].toString();
                            var newBNBPool = info[1].toString();
                            const bnbPrice = newBNBPool / newCaziPool;
                            setBNBPrice(bnbPrice);
                            resolve(bnbPrice); // this need to multiple with getBNBCaziPrice contract to get BNB price of CAZI
                        })
                    } else {
                        reject({ success: false, data: 'Smart contract not deployed to detected network.' });
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })();
    }


    const getBNBCaziPrice = () => {
        (async () => {
            try {
                return new Promise(async (resolve, reject) => {
                    //pancake spawe
                    let newPoolAddr = "0x3F75f3eCD202C1f1417789C6fc27a5F92330fB35";
                    let newPoolAbi = [{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount1", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount1", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount0In", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount1In", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount0Out", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount1Out", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "Swap", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint112", "name": "reserve0", "type": "uint112" }, { "indexed": false, "internalType": "uint112", "name": "reserve1", "type": "uint112" }], "name": "Sync", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "constant": true, "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "MINIMUM_LIQUIDITY", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "PERMIT_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }], "name": "burn", "outputs": [{ "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "internalType": "uint256", "name": "amount1", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getReserves", "outputs": [{ "internalType": "uint112", "name": "_reserve0", "type": "uint112" }, { "internalType": "uint112", "name": "_reserve1", "type": "uint112" }, { "internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_token0", "type": "address" }, { "internalType": "address", "name": "_token1", "type": "address" }], "name": "initialize", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "kLast", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }], "name": "mint", "outputs": [{ "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "price0CumulativeLast", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "price1CumulativeLast", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }], "name": "skim", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "amount0Out", "type": "uint256" }, { "internalType": "uint256", "name": "amount1Out", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "swap", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "sync", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "token0", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "token1", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }]

                    const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
                    const contract = new web3.eth.Contract(newPoolAbi, newPoolAddr)
                    if (contract) {
                        await contract.methods.getReserves().call().then(function (info) {
                            var newCaziPool = info[0].toString();
                            var newBNBPool = info[1].toString();
                            setBnbPool(newBNBPool);
                            setCaziPool(newCaziPool);
                            const bnbPrice = newBNBPool / newCaziPool;
                            setBNBCaziPrice(bnbPrice);
                            resolve(bnbPrice); // this need to multiple with other contract to get BNB price of CAZI
                        })
                    } else {
                        reject({ success: false, data: 'Smart contract not deployed to detected network.' });
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })();
    }

    const changWalletIconOnHover = (e) => {
        document.getElementById('unlock-wallet-button').src = "https://d2qrsf0anqrpxl.cloudfront.net/assets/images/wallet_w.svg";
    }
    const changeWalletIcon = (e) => {
        document.getElementById('unlock-wallet-button').src = 'https://d2qrsf0anqrpxl.cloudfront.net/assets/images/wallet_b.svg';
    }

   

    // connect wallet function
    function connectWithWallet(calledFor) {
        if(calledFor === 'metamask'){
            handleSignIn();
        }
        else if(calledFor === 'binanceSmartChain'){
            handleBinanceChainSignIn();
        }
        else if(calledFor === 'mobileWallet'){
            login();
        }
        setShowWalletConnectDialog(false);
    }


  const addContract = (calledFor, provider = null) => {
    if (calledFor === "metamask") {
        web3 = new Web3(Web3.givenProvider);
        dispatch({
            type : SET_WALLET_PROVIDER,
            payload : Web3.givenProvider
        })
    } else if (calledFor === "binanceSmartChain") {
        web3 = new Web3(window.BinanceChain);
        dispatch({
            type : SET_WALLET_PROVIDER,
            payload : window.BinanceChain
        })
    } else if (calledFor === "mobileWallet") {
        web3 = new Web3(provider);
        dispatch({
            type : SET_WALLET_PROVIDER,
            payload : { ...provider }
        })
    } 

    if(!web3){
        web3 = new Web3(process.env.REACT_APP_HTTP_PROVIDER)
    }


    let web3ForCaziPrice = new Web3(process.env.REACT_APP_PROVIDED_URL);
    let sampleContract = new web3.eth.Contract(
        JSON.parse(process.env.REACT_APP_CAZI_ABI),
        process.env.REACT_APP_SAMPLE_ADD);
    let lpContract = new web3.eth.Contract(
        JSON.parse(process.env.REACT_APP_LP_ABI),
        process.env.REACT_APP_LP_TOKEN);
    let caziContract = new web3.eth.Contract(
        JSON.parse(process.env.REACT_APP_CAZI_ABI),
        process.env.REACT_APP_CAZI_Add);
    let stakingContract = new web3.eth.Contract(
        JSON.parse(process.env.REACT_APP_STAKING_ABI),
        process.env.REACT_APP_STAKING_ADDRESS
    );
    let panCakeSwapContract = new web3ForCaziPrice.eth.Contract(
        JSON.parse(process.env.REACT_APP_PANCAKE_SWAP_ABI),
        process.env.REACT_APP_PANCAKE_SWAP_ADD
    );
    let caziBNBReserveContract = new web3ForCaziPrice.eth.Contract(
        JSON.parse(process.env.REACT_APP_CAZI_BNB_RESERVE_ABI),
        process.env.REACT_APP_CAZI_BNB_RESERVE_ADD
    );
    // let sampleContract = new web3.eth.Contract(sampleAbi, sampleAddress);
    // let lpContract = new web3.eth.Contract(LpAbi, LPTokenAdd);
    // let caziContract = new web3.eth.Contract(CaziAbi, CaziTokenAdd);
    // let stakingContract = new web3.eth.Contract(
    //   StakingAbiTestNet,
    //   StakingContractAddTestNet
    // );
    // let panCakeSwapContract = new web3ForCaziPrice.eth.Contract(
    //   panCakeSwapAbi,
    //   pancakeSwapAdd
    // );
    // let caziBNBReserveContract = new web3ForCaziPrice.eth.Contract(
    //   caziBNBReserveAbi,
    //   caziBNBReserveAdd
    // );
    let obj = {
      sampleContract,
      lpContract,
      caziContract,
      stakingContract,
      panCakeSwapContract,
      caziBNBReserveContract,
    };
    dispatch(setContract(obj));
    dispatch(setMetaMask(user[0]));
    return obj;
  }
   

    return (
        <>

            {isLoggedIn && !props.gameLoginBtn ?
                <>
                <div onClick={openDisconnectWalletModal} style={{ textAlign: "center"}} className="address-div">
                    <span style={{ textAlign: "center"}}>
                       <img className="btn-price-icon" src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/chip.svg" alt="chip" /> 
                       ${caziDollarPrice ? convertLgNum(showAfterDec(caziDollarPrice)): '0.00'} 
                    </span>
                    <div>
                        <span style={{ textAlign: "center"}}>
                         {user ? user.toString().substring(0,6) + '...' + user.toString().substr(user.length - 4) : ''}
                        </span>
                    </div>

                </div>
                </>
                : null
            }
            {!isLoggedIn && !props.gameLoginBtn ? 
                <div className="unlock-btn-wrapper">
                    <Button onMouseLeave={changeWalletIcon} onMouseOver={changWalletIconOnHover} 
                    onClick={() => setShowWalletConnectDialog(true)} variant="light" className="login-btn unlock-btn">
                        <img id="unlock-wallet-button" src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/wallet_b.svg" alt="wallet"/>
                        Unlock Wallet
                        {connectWalletLoader ? 
                        <span className="button-loader spinner-border"></span> : null}
                    </Button>
                    <NotificationModel class={showNotificationModal} msg={notificationMsg}/>
                </div>
            : null}
            {props.gameLoginBtn ?
                <button className="btn" type="button" onClick={() => handleSignIn()}>
                    Connect Wallet to play</button> : null}
            <DisconnectWalletModal
                handleClose={hideDisconnectModal}
                address={user}
                show={showDisconnectModal}
                disconnect={disconnectWallet} 
                // disconnect={disconnectWalletAcc}
            />

            {showWalletConnectDialog ? (
                <WalletSelectDialog
                    show={showWalletConnectDialog}
                    hideShow={() => setShowWalletConnectDialog(false)}
                    connectWithWallet={connectWithWallet}
                />
            ) :
                null

            }
        </>
    )

}


const mapStateToProps = (state, ownProps) => {
    return { state };
};
export default connect(mapStateToProps)(ConnectButton);