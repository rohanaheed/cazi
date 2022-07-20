import React, { useEffect, useState } from 'react';
import './earn.scss';
import { useDispatch, useSelector } from 'react-redux';
import Big from 'big.js';
import useInterval from './useInterval';
import checkWalletConnection from '../../utils/checkWallentConnection';
import {
  setApprovalForCazi,
  setApprovalForLp,
} from '../../_actions/metamast.action';
import {
  getCaziAllowance,
  getLpAllowance,
} from '../../contractCalls/allowance';
import insertComma from '../../utils/insertComma';
// import { isStaging } from '../../config/stagingSetup';
// import StakingContractAddTestNet from '../../config/contractAddress/StakingContractAddTestNet';
// import StakingAbiTestNet from '../../config/abi/StakingAbiTestNet';
// import LpAbi from '../../config/abi/LpAbi';
// import LPTokenAdd from '../../config/contractAddress/LPTokenAdd';
// import CaziAbi from '../../config/abi/CaziAbi';
// import CaziTokenAdd from '../../config/contractAddress/CaziTokenAdd';
import ValueLoader from '../../components/ValueLoader/valueLoader';
import EarnPopup from './earnPopup';
import { connect } from 'react-redux';
import validateInput from './validateInputFunction';
const Web3 = require('web3'); 
const tiger = 'https://d2qrsf0anqrpxl.cloudfront.net/assets/images/header-cazi.svg';
const bnb = 'https://d2qrsf0anqrpxl.cloudfront.net/assets/images/Bitmap.svg';

const EarnPage = (props) => {
  const dispatch = useDispatch();
  const [expandCardModal, setExpandCardModal] = useState(true);
  const [expandCardModalCAZI, setExpandCardModalCAZI] = useState(false);
  const [formData, setFormData] = useState({
    stakingValueLp: '',
    unStakingValueLp: '',
    stakingValueBNBLp: '',
    unStakingValueBNBLp: '',
  });
  const {
    stakingValueLp,
    unStakingValueLp,
    stakingValueBNBLp,
    unStakingValueBNBLp,
  } = formData;
  const {
    contract,
    stakingContract,
    approvalForCazi,
    BNBCaziPrice,
    BNBPrice,
    caziPriceDollar,
    approvalForLp,
    metaMaskAddress,
    bnbPriceDollar,
    caziBNBPriceDollar,
    totalStakes,
    noOfCazi,
    noOfBNB,
    circulatingSuppLp,
    totalFarms,
  } = useSelector((state) => state.metamaskReducer);
  const [APYBNB, setAPYBNB] = useState(0);
  const [APRBNB, setAPRBNB] = useState(0);
  // const [APYCAZI, setAPYCAZI] = useState(0);
  // const [APRCAZI, setAPRCAZI] = useState(0);
  const [counter, setCounter] = useState(0);
  const [lpBalance, setLpBalance] = useState(0);
  const [caziBalance, setcaziBalance] = useState(0);
  const [lpStaked, setLpStaked] = useState(0);
  const [caziStaked, setCaziStaked] = useState(0);
  const [BNBLpReward, setBNBLpReward] = useState(0);
  const [BNPFarmReward, setBNBFarmReward] = useState(0);
  const [caziReward, setCuziReward] = useState(0);
  const [stakeReward, setStakeReward] = useState(0);
  const [showErrorMsg /*setShowErrorMsg*/] = useState(false);
  const [showPop, setShowPopup] = useState(false);
  const [transactionInProgress, setTransactionInProgress] = useState();
  const userData = sessionStorage.getItem('loginUser');
  const [active, setActive] = useState(userData?.AccessToken ? true : false);
  const [/*tvl,*/ setTvl] = useState({
    farmOf: 0,
    farmOfString: '0',
    tvlForLp: '0.00',
    stakeOf: 0,
    stakeOfString: '0',
    tvlForCuzi: '0.00',
    totalStake: 0,
  });
  const [totalTVLBNBLP, setTotalTVLBNBLP] = useState(0);
  const [totalTVLCAZI, setTotalTVLCAZI] = useState(0);
  const [loaderFor, setLoaderFor] = useState('');

  var web3 = new Web3(props.state.metamaskReducer.provider);
  let stakeContract = new web3.eth.Contract(
    JSON.parse(process.env.REACT_APP_STAKING_ABI),
    process.env.REACT_APP_STAKING_ADDRESS
);
  let lpContract = new web3.eth.Contract(
    JSON.parse(process.env.REACT_APP_LP_ABI),
    process.env.REACT_APP_LP_TOKEN);
  let caziContract = new web3.eth.Contract(
    JSON.parse(process.env.REACT_APP_CAZI_ABI),
    process.env.REACT_APP_CAZI_Add);
  const handleExpandCard = () => {
    setExpandCardModal(!expandCardModal);
  };

  const handleClose = () => {
    setShowPopup(false);
  };
  const handleExpandCardCazi = () => {
    setExpandCardModalCAZI(!expandCardModalCAZI);
  };

  const handleChange = (e) => {
    var re = /^\d*\.?\d*$/;
    const limit = e.target.value.split('.');
    const length = limit[1] ? limit[1].length : 0;
    if (re.test(e.target.value) && length < 19) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const APR = (tokenPerBlock, investment, For) => {
    if (contract) {
      contract.stakingContract.methods
        .tokenPerBlocks()
        .call()
        .then((response) => {
          // console.log("res for token per  block", response);
          let res = parseInt(response) / Math.pow(10, 18);
          let priceOfToken = BNBPrice * BNBCaziPrice;
          let TVL = 0;
          if (For === 'CAZI') {
            // priceOfToken = bnbPriceDollar * caziBNBPriceDollar;
            TVL = priceOfToken * (totalStakes / Math.pow(10, 18));
          } else {
            let totalTVL =
              BNBPrice * BNBCaziPrice * noOfCazi + BNBPrice * noOfBNB;
            let priceOfTokenForLP = totalTVL / circulatingSuppLp;
            TVL = priceOfTokenForLP * (totalFarms / Math.pow(10, 18));
          }

          const daysInMonth = 365;
          const blockPerDay = 28800;

          let valuePercentage;
          let price;
          let dailyAPR;
          let yearlyAPR;
          let investmentLocked;
          let APY;
          if (For === 'LP') {
            contract.stakingContract.methods
              .lpShare()
              .call()
              .then((emissionRate) => {
                valuePercentage = (res * parseFloat(emissionRate)) / 100;
                var LPperDay = blockPerDay * valuePercentage;
                price = LPperDay * priceOfToken;
                dailyAPR = (price / TVL) * 100;
                investmentLocked = investment;
                for (let i = 0; i < 365; i++) {
                  investment = (dailyAPR * investment) / 100 + investment;
                }
                APY = (investment / investmentLocked - 1) * 100;
                yearlyAPR = dailyAPR * 365;
                const APYValue = APY;
                if (APY !== Infinity) {
                  setAPYBNB(isNaN(APY) ? 0 : APYValue);
                  setAPRBNB(isNaN(yearlyAPR) ? 0 : yearlyAPR);
                } else {
                  setAPYBNB(isNaN(APY) ? 0 : 0);
                  setAPRBNB(isNaN(yearlyAPR) ? 0 : yearlyAPR);
                }
              })
              .catch((err) => {
                console.log('err', err);
              });
            // console.log(APY);
          } else if (For === 'CAZI') {
            contract.stakingContract.methods
              .caziShare()
              .call()
              .then((emissionRate) => {
                valuePercentage = (res * parseFloat(emissionRate)) / 100;
                var CAZIPerDay = blockPerDay * valuePercentage;
                price = CAZIPerDay * priceOfToken;
                dailyAPR = (price / TVL) * 100;
                investmentLocked = investment;
                for (let i = 0; i < 365; i++) {
                  investment = (dailyAPR * investment) / 100 + investment;
                }
                APY = (investment / investmentLocked - 1) * 100;
                yearlyAPR = dailyAPR * 365;
                if (APY !== Infinity) {
                  // setAPYCAZI(isNaN(APY) ? 0 : APYValue);
                  //   setAPRCAZI(isNaN(yearlyAPR) ? 0 : yearlyAPR);
                } else {
                  // setAPYCAZI(isNaN(APY) ? 0 : APYValue);
                  // setAPRCAZI(isNaN(yearlyAPR) ? 0 : yearlyAPR);
                }
                // console.log(APY);
              })
              .catch((err) => {
                console.log('err', err);
              });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };


  useEffect(()=>{
    if(props.state.metamaskReducer.provider){
      web3 = new Web3(props.state.metamaskReducer.provider);
      stakeContract = new web3.eth.Contract(
        JSON.parse(process.env.REACT_APP_STAKING_ABI),
        process.env.REACT_APP_STAKING_ADDRESS
    );
      lpContract = new web3.eth.Contract(
        JSON.parse(process.env.REACT_APP_LP_ABI),
        process.env.REACT_APP_LP_TOKEN);
      caziContract = new web3.eth.Contract(
        JSON.parse(process.env.REACT_APP_CAZI_ABI),
        process.env.REACT_APP_CAZI_Add);
    }
  }, [props.state.metamaskReducer.provider])

  useEffect(() => {
    APR(0.4, 100, 'LP');
    APR(0.4, 100, 'CAZI');
    // setTvlPrice(sessionStorage.getItem('tvl'));
  }, [counter]);

  const openBuyCaziLink = () => {
    window.open(
      'https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x45E4ec2d4e2BA648052F1f08C7c73dFdc0744Fc0',
      '_blank'
    );
  };

  const openCaziBnbLink = () => {
    window.open(
      'https://exchange.pancakeswap.finance/#/add/BNB/0x45E4ec2d4e2BA648052F1f08C7c73dFdc0744Fc0',
      '_blank'
    );
  };

  const getStats = () => {
    const metaMaskAddress = sessionStorage.getItem('id');
    if (contract) {
      calculateEstimatedValuesForLp();
      setDecimalsAndApproval(contract, metaMaskAddress);
      lpContract &&
        lpContract.methods
          .balanceOf(metaMaskAddress)
          .call()
          .then((res) => {
            setLpBalance(divideNo(res));
          })
          .catch((err) => {
            // console.log("err", err);
          });
      caziContract.methods
        .balanceOf(metaMaskAddress)
        .call()
        .then((res) => {
          setcaziBalance(divideNo(res));
        })
        .catch((err) => {
          // console.log("err", err);
        });
      stakeContract.methods
        .farmRecords(metaMaskAddress)
        .call()
        .then((res) => {
          setLpStaked(divideNo(res.farmedAmount));
          setTvl({
            farmOf: res.farmedAmount / Math.pow(10, 18),
            farmOfString: res.farmedAmount,
            tvlForLp: (res.farmedAmount * BNBCaziPrice * BNBPrice).toFixed(2),
          });
        })
        .catch((err) => {});
      stakeContract.methods
        .stakeRecords(metaMaskAddress)
        .call()
        .then((res) => {
          setCaziStaked(divideNo(res.stakedAmount));
        });
      // var web3 = new Web3(Web3.givenProvider);
      stakeContract.methods
        .calculateRewardLP(metaMaskAddress)
        .call()
        .then((res) => {
          setBNBLpReward(parseInt(res) / Math.pow(10, 18));
        })
        .catch((err) => {});

      stakeContract.methods
        .farmRewards(metaMaskAddress)
        .call()
        .then((res) => {
          setBNBFarmReward(parseInt(res) / Math.pow(10, 18));
        })
        .catch((err) => {});
      stakeContract.methods
        .stakeRewards(metaMaskAddress)
        .call()
        .then((res) => {
          setStakeReward(parseInt(res) / Math.pow(10, 18));
        })
        .catch((err) => {});
      stakeContract.methods
        .calculateReward(metaMaskAddress)
        .call()
        .then((res) => {
          setCuziReward(parseInt(res) / Math.pow(10, 18));
        })
        .catch((err) => {});
    }
  };

  const [shouldClear, setShouldClear] = useState(false);
  useEffect(() => {
    const userId = sessionStorage.getItem('id');
    const logout = sessionStorage.getItem('clear');
    if (logout && !userId) {
      setFormData({
        stakingValueLp: '',
        unStakingValueLp: '',
        stakingValueBNBLp: '',
        unStakingValueBNBLp: '',
      });
      setShouldClear(true);
    }
    if (!userId && shouldClear) {
      setFormData({
        stakingValueLp: '',
        unStakingValueLp: '',
        stakingValueBNBLp: '',
        unStakingValueBNBLp: '',
      });
      setShouldClear(false);
      sessionStorage.removeItem('clear');
    }
    if (userId && userData) {
      getStats();
      setActive(true);
    } else {
      setLpBalance(0);
      setcaziBalance(0);
      setLpStaked(0);
      setCaziStaked(0);
      setActive(false);
      setBNBLpReward(0);
      setBNBFarmReward(0);
      setCuziReward(0);
      setStakeReward(0);
    }
    calculateTvlForLp();
  }, [counter]);

  useInterval(() => {
    setCounter(counter + 1);
  }, 3000);

  const handleInProgressTransaction = () => {
    // showNotification(
    //   'Transaction in Progress',
    //   'Transaction is already in process. Complete or Abort it first.',
    //   'info',
    //   3000
    // );
  };

  const setDecimalsAndApproval = (contract, metaMaskAddress) => {
    getLpAllowance(metaMaskAddress, contract, setApprovalForLp, dispatch);
    getCaziAllowance(metaMaskAddress, contract, setApprovalForCazi, dispatch);
  };

  const handleErrorTransaction = (err) => {
    // showNotification(
    //   'Error',
    //   'Something went wrong while making the transaction',
    //   'danger',
    //   3000
    // );
  };

  const handleErrorAccount = (err) => {
    // showNotification(
    //   'Error',
    //   'Error while getting your account info',
    //   'danger',
    //   3000
    // );
  };

  const handleSuccessResponse = (res) => {
  //  showNotification('Success', 'Transaction Successful', 'success', 3000);
  };

  const handleStake = (tab, fun) => {
     //check login status first
     if(!sessionStorage.getItem('loginUser')){
      return;
    }
    if (tab === 'bnblp') {
      if (!validateInput(stakingValueBNBLp)) {
        return;
      }
    }

    // console.log("mnbmnj", userData)
    if (userData) {
      setLoaderFor(`${tab}+${fun}`);
      if (transactionInProgress) {
        handleInProgressTransaction();
      }
      if (tab === 'bnblp') {
        if (isNaN(stakingValueBNBLp) || stakingValueBNBLp === '') {
          // showNotification(
          //   'Error',
          //   'Please fill the input field',
          //   'danger',
          //   3000
          // );
          setLoaderFor('');
        }
      } else if (tab === 'cazi') {
        if (isNaN(stakingValueLp) || stakingValueLp === '') {
          // showNotification(
          //   'Error',
          //   'Please fill the input field',
          //   'danger',
          //   3000
          // );
          setLoaderFor('');
        }
      }
      let metaMaskAddress = sessionStorage.getItem('id');
      if (metaMaskAddress ) {
        
        var web3 = new Web3(props.state.metamaskReducer.provider);
        web3.eth
          .getAccounts()
          .then((acc) => {
            if (tab === 'bnblp' && acc[0]) {
              setTransactionInProgress(true);
              console.log(acc, 'acc.............')
              stakeContract.methods
                .createfarm(
                  web3.utils.toWei(stakingValueBNBLp.toString(), 'ether')
                )
                .send({ from: acc[0] })
                .then((res) => {
                  setTransactionInProgress(false);
                  setLoaderFor('');
                  setFormData({ stakingValueBNBLp: '' });
                  setDecimalsAndApproval(contract, metaMaskAddress);
                  handleSuccessResponse();
                })
                .catch((err) => {
                  setLoaderFor('');
                  setTransactionInProgress(false);
                  setFormData({ stakingValueBNBLp: '' });
                  handleErrorTransaction(err);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                });
            } else if (tab === 'cazi') {
              setTransactionInProgress(true);
              stakeContract.methods
                .createStake(
                  web3.utils.toWei(stakingValueLp.toString(), 'ether')
                )
                .send({ from: acc[0] })
                .then((res) => {
                  setTransactionInProgress(false);
                  setFormData({ stakingValueLp: '' });
                  setLoaderFor('');
                  setDecimalsAndApproval(contract, metaMaskAddress);
                })
                .catch((err) => {
                  setLoaderFor('');
                  setTransactionInProgress(false);
                  handleErrorTransaction(err);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                });
            }
          })
          .catch((err) => {
            setTransactionInProgress(false);
            setLoaderFor('');
            // handleErrorAccount(err);
            setDecimalsAndApproval(contract, metaMaskAddress);
            setFormData({ stakingValueBNBLp: '' });
          });
      }
    }
  };
  const handleUnStake = (tab, fun) => {
     //check login status first
     if(!sessionStorage.getItem('loginUser')){
      return;
    }
    if (tab === 'bnblp') {
      if (!validateInput(unStakingValueBNBLp)) {
        return;
      }
    }

    const metaMaskAddress = sessionStorage.getItem('id');
    if (userData) {
      setLoaderFor(`${tab}+${fun}`);
      if (transactionInProgress) {
        handleInProgressTransaction();
      }
      if (tab === 'bnblp') {
        if (isNaN(unStakingValueBNBLp) || unStakingValueBNBLp === '') {
          // showNotification(
          //   'Error',
          //   'Please fill the input field',
          //   'danger',
          //   3000
          // );
          setLoaderFor('');
        }
      } else if (tab === 'cazi') {
        if (isNaN(unStakingValueLp) || unStakingValueLp === '') {
          // showNotification(
          //   'Error',
          //   'Please fill the input field',
          //   'danger',
          //   3000
          // );
          setLoaderFor('');
        }
      }
      if (!showErrorMsg) {
         
        var web3 = new Web3(props.state.metamaskReducer.provider);
        web3.eth
          .getAccounts()
          .then((acc) => {
            if (tab === 'bnblp') {
              setTransactionInProgress(true);
              stakeContract.methods
                .unFarm(
                  web3.utils.toWei(unStakingValueBNBLp.toString(), 'ether')
                )
                .send({ from: acc[0] })
                .then((res) => {
                  setTransactionInProgress(false);
                  setFormData({ unStakingValueBNBLp: '' });
                  setLoaderFor('');
                  setDecimalsAndApproval(contract, metaMaskAddress);
                  handleSuccessResponse();
                })
                .catch((err) => {
                  setTransactionInProgress(false);
                  setFormData({ unStakingValueBNBLp: '' });
                  handleErrorTransaction(err);
                  setLoaderFor('');
                  console.log(err);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                });
            } else if (tab === 'cazi') {
              setTransactionInProgress(true);
              stakeContract.methods
                .unStake(web3.utils.toWei(unStakingValueLp.toString(), 'ether'))
                .send({ from: acc[0] })
                .then((res) => {
                  setTransactionInProgress(false);
                  setLoaderFor('');
                  setFormData({ unStakingValueLp: '' });
                  handleSuccessResponse(res);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                })
                .catch((err) => {
                  setLoaderFor('');
                  setTransactionInProgress(false);
                  handleErrorTransaction(err);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                });
            }
          })
          .catch((err) => {
            setLoaderFor('');
            setTransactionInProgress(false);
            setFormData({ unStakingValueBNBLp: '' });
            // handleErrorAccount(err);
            setDecimalsAndApproval(contract, metaMaskAddress);
          });
      }
    }
  };

  const handleHarvest = (tab, fun) => {
     //check login status first
     if(!sessionStorage.getItem('loginUser')){
      return;
    }
    if (userData) {
      setLoaderFor(`${tab}+${fun}`);
      if (transactionInProgress) {
        handleInProgressTransaction();
      }
      // if (checkWalletConnection(contract, metaMaskAddress)) {
       
        var web3 = new Web3(props.state.metamaskReducer.provider);
        web3.eth
          .getAccounts()
          .then((acc) => {
            if (tab === 'bnblp') {
              setTransactionInProgress(true);
              stakeContract.methods
                .harvestLP()
                .send({ from: acc[0] })
                .then((res) => {
                  setTransactionInProgress(false);
                  setLoaderFor('');
                  setDecimalsAndApproval(contract, metaMaskAddress);
                  setTransactionInProgress(false);
                })
                .catch((err) => {
                  setLoaderFor('');
                  setTransactionInProgress(false);
                  handleErrorTransaction(err);
                });
            } else if (tab === 'cazi') {
              setTransactionInProgress(true);
              stakeContract.methods
                .harvest()
                .send({ from: acc[0] })
                .then((res) => {
                  setLoaderFor('');
                  handleSuccessResponse(res);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                  setTransactionInProgress(false);
                })
                .catch((err) => {
                  setLoaderFor('');
                  setTransactionInProgress(false);
                  handleErrorTransaction(err);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                });
            }
          })
          .catch((err) => {
            setTransactionInProgress(false);
            setLoaderFor('');
            handleErrorTransaction(err);
            setDecimalsAndApproval(contract, metaMaskAddress);
          });
      // }
    }
  };
  // const handleMaxApprove = calledFor => {
  //     if (metaMaskAddress && userData) {
  //         if (checkWalletConnection(contract, metaMaskAddress) && metaMaskAddress) {
  //             if (calledFor === "LP") {
  //                 let number = divideNo(lpBalance ? lpBalance : 0);
  //                 setFormData({
  //                     stakingValueBNBLp: number,
  //                 });
  //             }
  //             else if (calledFor === "CAZI") {
  //                 let number = divideNo(stakingValueLp ? stakingValueLp : 0);
  //                 setFormData({
  //                     stakingValueLp: number,
  //                 });
  //             }
  //         }
  //     }
  // }
  const handleApprove = (tokenType, fun) => {
      //check login status first
      if(!sessionStorage.getItem('loginUser')){
        return;
      }
    if (tokenType === 'LP') {
      if (!validateInput(stakingValueBNBLp)) {
        return;
      }
    }

    const metaMaskAddress = sessionStorage.getItem('id');
    if (userData) {
      setLoaderFor(`${tokenType}+${fun}`);
      if (transactionInProgress) {
        handleInProgressTransaction();
      }
      if (metaMaskAddress) {
        // if (checkWalletConnection(contract, metaMaskAddress)) {
          let appprovalValue = 10000000;

          var web3 = new Web3(props.state.metamaskReducer.provider);
          web3.eth
            .getAccounts()
            .then((acc) => {
              if (tokenType === 'LP') {
                setTransactionInProgress(true);
                // let lpContract = new web3.eth.Contract(LpAbi, LPTokenAdd);
                lpContract.methods
                  .approve(
                    process.env.REACT_APP_STAKING_ADDRESS,
                    web3.utils.toWei(appprovalValue.toString(), 'ether')
                  )
                  .send({ from: acc[0] })
                  .then((res) => {
                    setLoaderFor('');
                    setLpBalance('');
                    setFormData({ ...formData, stakingValueBNBLp: '' });
                    setDecimalsAndApproval(contract, metaMaskAddress);
                    setTransactionInProgress(false);
                  })
                  .catch((err) => {
                    setLoaderFor('');
                    setTransactionInProgress(false);
                    handleErrorTransaction(err);
                    setFormData({ ...formData, stakingValueBNBLp: '' });
                    setDecimalsAndApproval(contract, metaMaskAddress);
                  });
              } else {
                setTransactionInProgress(true);
                caziContract.methods
                  .approve(
                    process.env.REACT_APP_STAKING_ADDRESS,
                    web3.utils.toWei(appprovalValue.toString(), 'ether')
                  )
                  .send({ from: acc[0] })
                  .then((res) => {
                    //   handleSuccessResponse(res);
                    setcaziBalance('');
                    setLoaderFor('');
                    setDecimalsAndApproval(contract, metaMaskAddress);
                    setTransactionInProgress(false);
                  })
                  .catch((err) => {
                    setLoaderFor('');
                    setTransactionInProgress(false);
                    handleErrorTransaction(err);
                    setDecimalsAndApproval(contract, metaMaskAddress);
                  });
              }
            })
            .catch((err) => {
              setLoaderFor('');
              setFormData({ ...formData, stakingValueBNBLp: '' });
              setTransactionInProgress(false);
              handleErrorAccount(err);
              setDecimalsAndApproval(contract, metaMaskAddress);
            });
        // }
      }
    }
  };

  const divideNo = (res) => {
    if (typeof res === 'string' && res === '') {
      res = '0';
    }
    let bigNo = new Big(res);
    let bigNo1 = new Big(Math.pow(10, 18));
    let number = bigNo.div(bigNo1).toFixed(18);
    return number;
  };
  const findMaxBalance = (type, tab) => {
    const metaMaskAddress = sessionStorage.getItem('id');
    if (
      metaMaskAddress &&
      userData 
    ) {
      if (type === 'Stake') {
        if (tab === 'bnblp') {
          lpContract.methods
            .balanceOf(metaMaskAddress)
            .call()
            .then((res) => {
              let number = divideNo(res);
              setFormData({
                ...formData,
                stakingValueBNBLp: number,
              });
            })
            .catch((err) => {
              console.log('err', err);
            });
        } else {
          caziContract.methods
            .balanceOf(metaMaskAddress)
            .call()
            .then((res) => {
              let number = divideNo(res);
              setFormData({
                ...formData,
                stakingValueLp: number,
              });
            })
            .catch((err) => {
              console.log('err', err);
            });
        }
      } else if (type === 'Unstake') {
        if (tab === 'bnblp') {
          stakingContract.methods
            .farmRecords(metaMaskAddress)
            .call()
            .then((res) => {
              let number = divideNo(res.farmedAmount);
              setFormData({
                ...formData,
                unStakingValueBNBLp: number,
              });
            })
            .catch((err) => {
              console.log('err', err);
            });
        } else {
          stakingContract.methods
            .stakeRecords(metaMaskAddress)
            .call()
            .then((res) => {
              let number = divideNo(res.stakedAmount);
              setFormData({
                ...formData,
                unStakingValueLp: number,
              });
            })
            .catch((err) => {
              console.log('err', err);
            });
        }
      }
    }
  };

  const handleCompound = (tab, fun) => {
     //check login status first
     if(!sessionStorage.getItem('loginUser')){
      return;
    }
    if (userData) {
      setLoaderFor(`${tab}+${fun}`);
      if (transactionInProgress) {
        handleErrorTransaction();
      }
      // if (checkWalletConnection(contract, metaMaskAddress)) {
       
        var web3 = new Web3(props.state.metamaskReducer.provider);
        web3.eth
          .getAccounts()
          .then((acc) => {
            if (tab === 'bnblp') {
              setTransactionInProgress(true);
              stakeContract.methods
                .compoundLP()
                .send({ from: acc[0] })
                .then((res) => {
                  setTransactionInProgress(false);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                  setLoaderFor('');
                })
                .catch((err) => {
                  setTransactionInProgress(false);
                  handleErrorTransaction(err);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                  setLoaderFor('');
                });
            } else {
              setTransactionInProgress(true);
              stakeContract.methods
                .compound()
                .send({ from: acc[0] })
                .then((res) => {
                  setTransactionInProgress(false);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                  setLoaderFor('');
                })
                .catch((err) => {
                  setTransactionInProgress(false);
                  handleErrorTransaction(err);
                  setDecimalsAndApproval(contract, metaMaskAddress);
                  setLoaderFor('');
                });
            }
          })
          .catch((err) => {
            setTransactionInProgress(false);
            handleErrorAccount(err);
            setDecimalsAndApproval(contract, metaMaskAddress);
          });
      // }
    }
  };

  const calculateEstimatedValuesForLp = () => {
    let poolPencentageForLp = (lpStaked / totalFarms) * 100;
    let tvlForLp = calculateTvlForLp();
    let ForLp = (tvlForLp * poolPencentageForLp) / 100;
    return ForLp;
  };
  const calculateTvlForLp = () => {
    const caziPrice = BNBPrice * BNBCaziPrice;
    const totalTvl = caziPrice * noOfCazi + BNBPrice * noOfBNB;
    const lpPrice = totalTvl / circulatingSuppLp;
    const tvlLp = lpPrice * (totalFarms / Math.pow(10, 18));
    const tvlForCuzi = caziPrice * (totalStakes / Math.pow(10, 18));
    setTotalTVLBNBLP(tvlLp);
    setTotalTVLCAZI(tvlForCuzi);
  };
  const windowWidth = window.innerWidth;
  const showAfterDec = (value) => {
    let point = parseFloat(value).toFixed(2).toString().split('.');
    let result = insertComma(point[0]) + '.' + point[1].substring(0, 2);
    return result;
  };
  const showSixAfterDec = (value) => {
    let point = parseFloat(value).toFixed(6).toString().split('.');
    let result = insertComma(point[0]) + '.' + point[1].substring(0, 6);
    return result;
  };

  const showComingSoon = () => {
    setShowPopup(true);
  };

  const convertValues = (num) => {
    // if(num > 999 && num < 1000000){
    //     return insertComma((num/1000).toFixed(2),true) + 'K'; // convert to K for number from > 1000 < 1 million
    // }
    if (num > 1000000000000) {
      return insertComma((num / 1000000000000).toFixed(2), true) + 'T'; // convert to M for number from > 1 million
    } else if (num > 1000000000) {
      return insertComma((num / 1000000000).toFixed(2), true) + 'B'; // convert to M for number from > 1 million
    } else if (num > 1000000) {
      return insertComma((num / 1000000).toFixed(2), true) + 'M'; // convert to M for number from > 1 million
    } else if (num < 1) {
      return parseFloat(num).toFixed(2); // just show with two decimal
    } else {
      return insertComma(num, false); // if value < 1000, nothing to do
    }
  };

  const caziPrice = sessionStorage.getItem('cuziPrize');
  return (
    <React.Fragment>
      <div className="col">
        <div className="earn-content">
          <div className="title earnTop">
            <div className="txt ttl">Stake &amp; Earn money</div>
            {/* {totalTVLBNBLP > 0 ? insertComma((totalTVLBNBLP + totalTVLCAZI).toFixed(2)) : "0.00"} */}
            <div className="txt ttl earnTopTVL ml-auto">
              TVL $
              {totalTVLBNBLP > 0
                ? insertComma(totalTVLBNBLP.toFixed(2).toString(), false)
                : 0}
            </div>
          </div>
          <div className="pools">
            <div className="pool-card highlighted new">
              <div className="info">
                <div className="symbols single">
                  <img
                    src={tiger}
                    alt="cazicazi-icon"
                    style={{ zIndex: '2000' }}
                  />
                  <img src={bnb} alt="bnb-icon" />
                </div>
                <div
                  className="pool"
                  style={{ marginRight: windowWidth > 520 ? '0px' : '8px' }}
                >
                  <div className="ttl">CAZI / BNB LP</div>
                  <div className="bottom">
                    {/* <div className="tag multiplier">0.0x</div> */}
                    {/* <div className="tag multiplier m-coming-soon">Coming Soon</div> */}
                    {/* <div className="provider ml-2">Pancake Swap</div> */}
                  </div>
                </div>
                <div className="key-value balance">
                  {/* <div className="val">{lpBalance &&  showAfterDec(lpBalance)}</div> */}
                  <div className="val">
                    {lpBalance
                      ? lpBalance < 1000000
                        ? insertComma(
                            parseFloat(lpBalance).toFixed(2).toString(),
                            true
                          )
                        : convertValues(parseFloat(lpBalance).toFixed(2))
                      : 0}
                  </div>
                  <div className="key">Balance</div>
                </div>
                {windowWidth > 640 && (
                  <>
                    <div className="key-value deposited">
                      {/* <div className="val">{lpStaked && showAfterDec(lpStaked)}</div> */}
                      {/* <div className="val">{lpStaked  ? lpStaked < 1000000 ?  insertComma(parseFloat(lpStaked).toFixed(2).toString(), true)  : convertValues(parseFloat(lpStaked).toFixed(2)) : 0}</div> */}
                      <div className="val">
                        {lpStaked
                          ? convertValues(parseFloat(lpStaked).toFixed(2))
                          : 0}
                      </div>
                      <div className="key">Staked</div>
                    </div>
                    <div className="key-value apy">
                      <div className="val primary">
                        {APRBNB !== Infinity && APRBNB ? convertValues(APRBNB) : 0}%
                      </div>
                      {/* <div className="val">{APYBNB  ? APYBNB < 1000000 ?  insertComma(APYBNB.toFixed(2).toString(), true)  : convertValues(APYBNB) : 0}</div> */}
                      <div className="key">APY</div>
                    </div>
                    <div className="key-value daily daily-value">
                      {/* <div className="val">{APYBNB  ? APYBNB/365  < 1000000 ? insertComma((APYBNB/365).toFixed(2).toString(), true) :   convertValues(APYBNB/365)  : 0}%</div> */}
                      <div className="val">
                        {APRBNB !== Infinity && APRBNB ? convertValues(APRBNB /365) : 0}%
                      </div>
                      <div className="key">APR</div>
                    </div>
                  </>
                )}
                <div className="key-value earn">
                  {/* <div className="val">${totalTVLBNBLP > 0 ? totalTVLBNBLP < 1000000 ?  insertComma(totalTVLBNBLP.toFixed(2).toString(), true)  :  convertValues(totalTVLBNBLP) : 0}</div> */}
                  <div className="val">
                    ${totalTVLBNBLP > 0 ? convertValues(totalTVLBNBLP) : 0}
                  </div>
                  <div className="key">TVL</div>
                </div>
                {windowWidth > 768 && (
                  <div
                    onClick={openCaziBnbLink}
                    className="btn outlined ml-auto get"
                    style={{
                      marginRight: '67px',
                      right: '40px',
                      marginLeft: '250px',
                      overflow: 'hidden',
                      paddingLeft: '0',
                      paddingRight: '0',
                    }}
                  >
                    Get CAZI / BNB LP
                  </div>
                )}
                <div
                  className="btn expand "
                  style={{ transform: expandCardModal ? 'rotate(180deg)' : '' }}
                  onClick={() => handleExpandCard()}
                ></div>
              </div>
              <div
                className={`details ${
                  expandCardModal === true ? 'expand-show' : 'expand-hide'
                }`}
              >
                <div className="line"></div>
                <div className="transactions">
                  <div className="transaction deposit no-bg walletDeposite">
                    <div className="amount">
                      <span className="ttl">Wallet:</span>
                      <span
                        className="val"
                        data-display-decimals="6"
                        style={{ fontSize: '13px' }}
                      >
                        {lpBalance
                          ? showSixAfterDec(lpBalance) + ' CAZI / BNB LP'
                          : '0.00 CAZI / BNB LP'}
                      </span>
                    </div>
                    {/* <div className="swap"><a>GET XCAZI / BNB</a></div> */}
                    {approvalForLp ? (
                      <>
                        <div className="input-container number with-max">
                          <input
                            type="text"
                            data-decimal-places="18"
                            placeholder="0"
                            name="stakingValueBNBLp"
                            value={stakingValueBNBLp}
                            onChange={(e) => handleChange(e)}
                          />
                          <div
                            className="max"
                            onClick={() =>
                              findMaxBalance('Stake', 'bnblp')
                            }
                            style={{ background: active ? '#FB207F' : '' }}
                          >
                            MAX
                          </div>
                        </div>
                        <div
                          className="btn btn-secondary deposit"
                          style={{
                            background:
                              active && stakingValueBNBLp ? '#FB207F' : '',
                          }}
                          onClick={() =>
                           
                            loaderFor === '' &&
                            active &&
                            stakingValueBNBLp &&
                            handleApprove('LP', 'Approve')
                          }
                        >
                          {loaderFor === 'LP+Approve' ? (
                            <div style={{ marginLeft: '45%' }}>
                              <ValueLoader />
                            </div>
                          ) : (
                            'Approval'
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="input-container number with-max">
                          <input
                            type="text"
                            data-decimal-places="18"
                            placeholder="0"
                            name="stakingValueBNBLp"
                            value={stakingValueBNBLp}
                            onChange={(e) => handleChange(e)}
                          />
                          <div
                            className="max"
                            onClick={() =>
                              findMaxBalance('Stake', 'bnblp')
                            }
                            style={{ background: active ? '#FB207F' : '' }}
                          >
                            MAX
                          </div>
                        </div>
                        <div
                          onClick={() =>
                            loaderFor === '' &&
                            active &&
                            stakingValueBNBLp &&
                            handleStake(
                              'bnblp',
                              'Stake',
                              console.log(
                                '1111111111111111111111111111111111111111111111111111111111'
                              )
                            )
                          }
                          style={{
                            background:
                              active && stakingValueBNBLp ? '#FB207F' : '',
                          }}
                          className="btn btn-secondary deposit"
                        >
                          {loaderFor === 'bnblp+Stake' ? (
                            <div style={{ marginLeft: '45%' }}>
                              <ValueLoader />
                            </div>
                          ) : (
                            'Stake'
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="transaction">
                    <div className="amount unStakingValueLp">
                      <span className="ttl">Vault:</span>
                      <span
                        className="val"
                        data-display-decimals="6"
                        style={{ fontSize: '13px' }}
                      >
                        {lpStaked
                          ? showSixAfterDec(lpStaked) + ' CAZI / BNB LP'
                          : '0.00 CAZI / BNB LP'}
                      </span>
                    </div>
                    <div className="input-container number with-max">
                      <input
                        type="text"
                        placeholder="0"
                        name="unStakingValueBNBLp"
                        value={unStakingValueBNBLp}
                        onChange={(e) => handleChange(e)}
                      />
                      <div
                        className="max"
                        onClick={() =>
                          findMaxBalance('Unstake', 'bnblp')
                        }
                        style={{ background: active ? '#FB207F' : '' }}
                      >
                        MAX
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        loaderFor === '' &&
                        active &&
                        unStakingValueBNBLp &&
                        handleUnStake('bnblp', 'Unstake')
                      }
                      style={{
                        background:
                          active && unStakingValueBNBLp ? '#FB207F' : '',
                      }}
                      className="btn btn-secondary unStakingValueLp"
                    >
                      {loaderFor === 'bnblp+Unstake' ? (
                        <div style={{ marginLeft: '45%' }}>
                          <ValueLoader />
                        </div>
                      ) : (
                        'Unstake'
                      )}
                    </div>
                  </div>
                  <div className="transaction ">
                    <div className="ttl harvest">Pending CAZI:</div>
                    <div className="val-img" style={{ marginBottom: '5px' }}>
                      <img
                        src={tiger}
                        alt="cazi-icon"
                      />
                      {BNBLpReward || BNPFarmReward
                        ? insertComma((BNBLpReward + BNPFarmReward).toFixed(6), true)
                        : '0.00'}
                      <h5
                        style={{
                          color: '#828282',
                          marginLeft: '5px',
                          marginTop: '10px',
                        }}
                      >
                        ($
                        {BNBLpReward || BNPFarmReward
                          ? insertComma(
                              (
                                (BNBLpReward + BNPFarmReward) *
                                BNBPrice *
                                BNBCaziPrice
                              ).toFixed(5), true
                            )
                          : '0.00'}
                        )
                      </h5>
                    </div>
                    <div
                      onClick={(e) => showComingSoon(e)}
                      className="btn btn-primary harvest"
                      style={{ marginBottom: '20px', background: '#FF8BBD' }}
                    >
                      {loaderFor === 'bnblp+Compound' ? (
                        <div style={{ marginLeft: '45%' }}>
                          <ValueLoader />
                        </div>
                      ) : (
                        'Compound'
                      )}
                    </div>
                    <div
                      onClick={
                        BNBLpReward + BNPFarmReward
                          ? () =>
                              loaderFor === '' &&
                              active &&
                              handleHarvest('bnblp', 'Harvest')
                          : () => {}
                      }
                      className="btn btn-primary harvest"
                      style={{
                        background:
                          active && BNBLpReward + BNPFarmReward
                            ? '#FB207F'
                            : '#FF8BBD',
                      }}
                    >
                      {loaderFor === 'bnblp+Harvest' ? (
                        <div style={{ marginLeft: '45%' }}>
                          <ValueLoader />
                        </div>
                      ) : (
                        'Harvest'
                      )}
                    </div>
                  </div>
                </div>
                  <div className="farm-info res-farm">
                    <div className="info">
                      <div className="itm head ttl-heading">
                        <span className="ttl ttl-heading">Annual</span>
                      </div>
                      <div className="itm cazi-apy">
                        <span className="ttl">CAZI / BNB LP APR:&nbsp;</span>
                        <span className="val">
                          {APRBNB !== Infinity && APRBNB
                            ? insertComma(APRBNB.toFixed(2).toString(), true)
                            : '0'}
                          %
                        </span>
                      </div>
                      <div className="itm total-apy">
                        <span className="ttl font-color-title">
                          Total Returns:&nbsp;
                        </span>
                        <span className="val highlight">
                          {APRBNB !== Infinity && APRBNB
                            ? insertComma(APRBNB.toFixed(2).toString(), true)
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="info">
                      <div className="itm head">
                        <span className="ttl ttl-heading">Daily</span>
                      </div>
                      <div className="itm cazi-daily-apy">
                        <span className="ttl font-color-title">
                          CAZI / BNB LP Daily:&nbsp;
                        </span>
                        <span className="val font-color-title">
                          {APRBNB !== Infinity && APRBNB
                            ? insertComma(
                                (APRBNB / 365).toFixed(2).toString(),
                                true
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="itm total-daily-apy">
                        <span className="ttl font-color-title">
                          Total Daily:&nbsp;
                        </span>
                        <span className="val highlight">
                          {APRBNB !== Infinity && APRBNB
                            ? insertComma(
                                (APRBNB / 365).toFixed(2).toString(),
                                true
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="info">
                      <div className="itm head">
                        <span className="ttl ttl-heading">Farm</span>
                      </div>
                      <div className="itm cazi-daily-apy">
                        <span className="ttl font-color-title">
                          CAZI / BNB LP TVL:&nbsp;
                        </span>
                        <span className="val highlight">
                          {' '}
                          $
                          {totalTVLBNBLP > 0
                            ? insertComma(
                                totalTVLBNBLP.toFixed(2).toString(),
                                true
                              )
                            : '0.00'}
                        </span>
                      </div>
                    </div>
                    <div className="info learn learnMore">
                      <div className="ttl-heading">
                        <span className="ttl ttl-heading">More</span>
                      </div>

                      <span className="font-color-title">
                        Learn how to buy and add to staking.
                        <br />
                        <a
                          href="https://cazicazi.gitbook.io/cazi-cazi/help/faq"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Tutorial
                        </a>
                      </span>
                    </div>
                  </div>
              </div>
            </div>

            <div className="pool-card highlighted new">
              <div className="info">
                <div className="symbols single"><img src={tiger} alt="cazi-icon" /></div>
                <div
                  className="pool pool-cazi"
                  style={{ marginRight: windowWidth > 520 ? '0px' : '32px' }}
                >
                  <div className="ttl">CAZI</div>
                  <div className="bottom">
                    {/* <div className="tag multiplier">0.0x</div> */}
                    <div className="tag multiplier m-coming-soon">
                      Coming Soon
                    </div>
                  </div>
                </div>
                <div className="key-value balance">
                  <div className="val">
                    {caziBalance && showAfterDec(caziBalance)}
                  </div>
                  <div className="key">Balance</div>
                </div>
                {windowWidth > 640 && (
                  <>
                    <div className="key-value deposited">
                      <div className="val">0</div>
                      <div className="key">Staked</div>
                    </div>
                    <div className="key-value apy">
                      <div className="val primary">0%</div>
                      <div className="key">APY</div>
                    </div>
                    <div className="key-value daily daily-value">
                      <div className="val">0%</div>
                      <div className="key">APR</div>
                    </div>
                  </>
                )}
                <div className="key-value earn">
                  <div className="val">$0</div>
                  <div className="key">TVL</div>
                </div>
                {windowWidth > 768 && (
                  <div
                    onClick={openBuyCaziLink}
                    className="btn outlined ml-auto get"
                    style={{
                      marginRight: '67px',
                      right: '40px',
                      marginLeft: '250px',
                      overflow: 'hidden',
                    }}
                  >
                    Get CAZI
                  </div>
                )}
                <div
                  className="btn expand ml-10"
                  style={{
                    transform: expandCardModalCAZI ? 'rotate(180deg)' : '',
                  }}
                  onClick={() => handleExpandCardCazi()}
                ></div>
              </div>
              <div
                className={`details ${
                  expandCardModalCAZI === true ? 'expand-show' : 'expand-hide'
                }`}
              >
                <div className="line"></div>
                <div className="transactions">
                  <div className="transaction deposit no-bg walletDeposite">
                    <div className="amount">
                      <span className="ttl">Wallet:</span>
                      <span
                        className="val"
                        data-display-decimals="6"
                        style={{ fontSize: '13px' }}
                      >
                        0.00 CAZI
                      </span>
                    </div>
                    {/* <div className="swap"><a>GET XCAZI</a></div> */}
                    {/* {approvalForCazi ? */}
                    {/* <>
                                                <div className="input-container number with-max">
                                                    <input type="number" data-humanize="false" placeholder="0" data-decimal-places="18" name="stakingValueLp" value={stakingValueLp} onChange={(e) => handleChange(e)} />
                                                    <div className="max" onClick={() => isStaging && findMaxBalance("Stake", "cazi")} style={{ background: active ? "#FB207F" : "#FF8BBD" }}>MAX</div>
                                                </div>
                                                <div className="btn btn-secondary deposit" onClick={() => isStaging && loaderFor === "" && active && stakingValueLp && handleApprove("CUZI", "Approve")} style={{ background: active && stakingValueLp ? "#FB207F" : "#FF8BBD" }}>
                                                    {loaderFor === "CUZI+Approve" ?
                                                        <div style={{ marginLeft: "45%" }}>
                                                            <ValueLoader />
                                                        </div>
                                                        : "Approval"
                                                    }
                                                </div>
                                            </> : */}
                    <>
                      <div className="input-container number with-max">
                        <input
                          type="text"
                          data-humanize="false"
                          placeholder="0"
                          data-decimal-places="18"
                          name="stakingValueLp"
                          value={stakingValueLp}
                          onChange={(e) => handleChange(e)}
                        />
                        <div
                          className="max"
                          onClick={(e) => showComingSoon(e)}
                          style={{ background: '#FF8BBD' }}
                        >
                          MAX
                        </div>
                      </div>
                      <div
                        onClick={(e) => showComingSoon(e)}
                        className="btn btn-secondary deposit"
                        style={{
                          background:
                            active && stakingValueLp ? '#FB207F' : '#FF8BBD',
                        }}
                      >
                        {loaderFor === 'cazi+Stake' ? (
                          <div style={{ marginLeft: '45%' }}>
                            <ValueLoader />
                          </div>
                        ) : (
                          'Stake'
                        )}
                      </div>
                    </>
                    {/* } */}
                  </div>
                  <div className="transaction">
                    <div className="amount unStakingValueLp">
                      <span className="ttl">Vault:</span>
                      <span
                        className="val"
                        data-display-decimals="6"
                        style={{ fontSize: '13px' }}
                      >
                        0.00 CAZI
                      </span>
                    </div>
                    <div className="input-container number with-max">
                      <input
                        type="text"
                        data-humanize="false"
                        data-decimal-places="18"
                        placeholder="0"
                        name="unStakingValueLp"
                        value={unStakingValueLp}
                        onChange={(e) => handleChange(e)}
                      />
                      <div
                        className="max"
                        onClick={(e) => showComingSoon(e)}
                        style={{ background: '#FF8BBD' }}
                      >
                        MAX
                      </div>
                    </div>
                    <div
                      onClick={(e) => showComingSoon(e)}
                      className="btn btn-secondary unStakingValueLp"
                      style={{
                        background:
                          active && unStakingValueLp ? '#FB207F' : '#FF8BBD',
                      }}
                    >
                      {loaderFor === 'cazi+Unstake' ? (
                        <div style={{ marginLeft: '45%' }}>
                          <ValueLoader />
                        </div>
                      ) : (
                        'Unstake'
                      )}
                    </div>
                  </div>
                  <div className="transaction ">
                    <div className="ttl harvest">Pending CAZI:</div>
                    <div className="val-img" style={{ marginBottom: '5px' }}>
                      <img
                        src={tiger}
                        alt="cazi-icon"
                      />
                      0.00
                      <h5
                        style={{
                          color: '#828282',
                          marginLeft: '5px',
                          marginTop: '10px',
                        }}
                      >
                        ($0.00)
                      </h5>
                    </div>
                    <div
                      className="btn btn-primary harvest"
                      onClick={(e) => showComingSoon(e)}
                      style={{ marginBottom: '20px', background: '#FF8BBD' }}
                    >
                      {loaderFor === 'cazi+Compound' ? (
                        <div style={{ marginLeft: '45%' }}>
                          <ValueLoader />
                        </div>
                      ) : (
                        'Compound'
                      )}
                    </div>
                    <div
                      onClick={(e) => showComingSoon(e)}
                      className="btn btn-primary harvest"
                      style={{ background: '#FF8BBD' }}
                    >
                      {loaderFor === 'cazi+Harvest' ? (
                        <div style={{ marginLeft: '45%' }}>
                          <ValueLoader />
                        </div>
                      ) : (
                        'Harvest'
                      )}
                    </div>
                  </div>
                </div>
                  <div className="farm-info res-farm">
                    <div className="info">
                      <div className="itm head ttl-heading">
                        <span className="ttl ttl-heading">Annual</span>
                      </div>
                      <div className="itm cazi-apy">
                        <span className="ttl">CAZI APR:&nbsp;</span>
                        <span className="val">0%</span>
                      </div>
                      <div className="itm total-apy">
                        <span className="ttl font-color-title">
                          Total Returns:&nbsp;
                        </span>
                        <span className="val highlight">0%</span>
                      </div>
                    </div>
                    <div className="info">
                      <div className="itm head">
                        <span className="ttl ttl-heading">Daily</span>
                      </div>
                      <div className="itm cazi-daily-apy">
                        <span className="ttl font-color-title">
                          CAZI Daily:&nbsp;
                        </span>
                        <span className="val font-color-title">0%</span>
                      </div>
                      <div className="itm total-daily-apy">
                        <span className="ttl font-color-title">
                          Total Daily:&nbsp;
                        </span>
                        <span className="val highlight">0%</span>
                      </div>
                    </div>
                    <div className="info">
                      <div className="itm head">
                        <span className="ttl ttl-heading">Farm</span>
                      </div>
                      <div className="itm cazi-daily-apy">
                        <span className="ttl font-color-title">
                          CAZI TVL:&nbsp;
                        </span>
                        <span className="val highlight"> $0.00</span>
                      </div>
                    </div>
                    <div className="info learn learnMore">
                      <div className="ttl-heading">
                        <span className="ttl ttl-heading">More</span>
                      </div>

                      <span className="font-color-title">
                        Learn how to buy and add to staking.
                        <br />
                        <a
                          href="https://cazicazi.gitbook.io/cazi-cazi/help/faq"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Tutorial
                        </a>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EarnPopup
        handleClose={handleClose}
        show={showPop}
        value={'CAZI Staking'}
      />
    </React.Fragment>
  );
};
const mapStateToProps = (state, ownProps) => {
  return{state}
  };

export default connect(mapStateToProps)(EarnPage);

/*<div className="pool-card highlighted new">
    <div className="info">
        <div className="symbols single">
            <img src={tiger} alt="" style={{ height: "40px", width: "40px" }} />
        </div>
        <div className="pool" style={{ marginRight: windowWidth > 520 ? "0px" : "32px" }}>
            <div className="ttl">CAZI</div>
            <div className="bottom">
                <div className="tag multiplier">0.0x</div>
                <div className="tag multiplier m-coming-soon">Coming Soon</div>
            </div>
        </div>
        <div className="key-value balance">
            <div className="val">{caziBalance && insertComma(showAfterDec(caziBalance))}</div>
            <div className="key">Balance</div>
        </div>
        {windowWidth > 640 &&
            <>
                <div className="key-value deposited">
                    <div className="val">{caziStaked && insertComma(showAfterDec(caziStaked))}</div>
                    <div className="key">Staked</div>
                </div>
                <div className="key-value apy">
                    <div className="val primary">{APYCAZI > 0 ? insertComma((APYCAZI).toFixed(2)) + convertValue(APYCAZI) : 0}%</div>
                    <div className="key">APY</div>
                </div>
                <div className="key-value daily daily-value">
                    <div className="val">{APYCAZI > 1 ? insertComma((APYCAZI / 365).toFixed(2)) : 0}%</div>
                    <div className="key">Daily</div>
                </div>
            </>
        }
        <div className="key-value earn">
            <div className="val">${totalTVLCAZI ? insertComma((APYCAZI).toFixed(2)) + convertValue(APYCAZI) : "0.00"}</div>
            <div className="key">TVL</div>
        </div>
        {windowWidth > 768 &&
            <div onClick={openBuyCaziLink} className="btn outlined ml-auto get" style={{ marginRight: "67px", right: "40px", marginLeft: "250px", overflow: "hidden" }}>Get CAZI</div>}
        <div className="btn expand ml-10" style={{ transform: expandCardModalCAZI ? "rotate(180deg)" : "" }} onClick={() => handleExpandCardCazi()}></div>
    </div>
    <div className={`details ${expandCardModalCAZI === true ? 'expand-show' : 'expand-hide'}`}>
        <div className="line"></div>
        <div className="transactions">
            <div className="transaction deposit no-bg walletDeposite">
                <div className="amount">
                    <span className="ttl">Wallet:</span>
                    <span className="val" data-display-decimals="6" style={{ fontSize: "13px" }}>{caziBalance ? showSixAfterDec(caziBalance) + " CAZI" : "0.00 CAZI"}</span>
                </div>
                {approvalForCazi ?
                    <>
                        <div className="input-container number with-max">
                            <input type="number" data-humanize="false" placeholder="0" data-decimal-places="18" name="stakingValueLp" value={stakingValueLp} onChange={(e) => handleChange(e)} />
                            <div className="max" onClick={() => isStaging && findMaxBalance("Stake", "cazi")} style={{ background: active ? "#FB207F" : "#FF8BBD" }}>MAX</div>
                        </div>
                        <div className="btn btn-secondary mt-2 deposit" onClick={() => isStaging && loaderFor === "" && active && stakingValueLp && handleApprove("CUZI", "Approve")} style={{ background: active && stakingValueLp ? "#FB207F" : "#FF8BBD" }}>
                            {loaderFor === "CUZI+Approve" ?
                                <div style={{ marginLeft: "45%" }}>
                                    <ValueLoader />
                                </div>
                                : "Approval"
                            }
                        </div>
                    </> :
                    <>
                        <div className="input-container number with-max">
                            <input type="number" data-humanize="false" placeholder="0" data-decimal-places="18" name="stakingValueLp" value={stakingValueLp} onChange={(e) => handleChange(e)} />
                            <div className="max" onClick={() => isStaging && findMaxBalance("Stake", "cazi")} style={{ background: active ? "#FB207F" : "#FF8BBD" }}>MAX</div>
                        </div>
                        <div onClick={() => loaderFor === "" && active && stakingValueLp && handleStake("cazi", "Stake")} className="btn btn-secondary mt-2 deposit" style={{ background: active && stakingValueLp ? "#FB207F" : "#FF8BBD" }}>
                            {loaderFor === "cazi+Stake" ?
                                <div style={{ marginLeft: "45%" }}>
                                    <ValueLoader />
                                </div>
                                : "Stake"
                            }
                        </div>
                    </>
                }
            </div>
            <div className="transaction">
                <div className="amount unStakingValueLp">
                    <span className="ttl">Vault:</span>
                    <span className="val" data-display-decimals="6" style={{ fontSize: "13px" }}>{caziStaked ? showSixAfterDec(caziStaked) + " CAZI" : "0.00 CAZI"}</span>
                </div>
                <div className="input-container number with-max">
                    <input type="number" data-humanize="false" data-decimal-places="18" placeholder="0" name="unStakingValueLp" value={unStakingValueLp} onChange={(e) => handleChange(e)} />
                    <div className="max" onClick={() => isStaging && findMaxBalance("Unstake", "cazi")} style={{ background: active ? "#FB207F" : "#FF8BBD" }}>MAX</div>
                </div>
                <div onClick={() => loaderFor === "" && active && unStakingValueLp && handleUnStake("cazi", "Unstake")} className="btn btn-secondary unStakingValueLp" style={{ background: active && unStakingValueLp ? "#FB207F" : "#FF8BBD" }}>
                    {loaderFor === "cazi+Unstake" ?
                        <div style={{ marginLeft: "45%" }}>
                            <ValueLoader />
                        </div>
                        : "Unstake"
                    }
                </div>
            </div>
            <div className="transaction ">
                <div className="ttl harvest">Pending CAZI:</div>
                <div className="val-img" style={{ marginBottom: "5px" }}>
                    <img src={tiger} alt="" style={{ height: "40px", width: "40px" }} />
                    {(caziReward || stakeReward) ? insertComma((caziReward + stakeReward).toFixed(4)) : "0.00"}
                    <h5 style={{ color: "#828282", marginLeft: "5px", marginTop: "10px" }}>(${(caziReward || stakeReward) ? insertComma(((caziReward + stakeReward) * caziPrice).toFixed(4)) : "0.00"})</h5>
                </div>
                <div className="btn btn-primary harvest" onClick={() => loaderFor === "" && active && handleCompound('cazi', "Compound")} style={{ marginBottom: "10px", background: active ? "#FB207F" : "#FF8BBD" }}>
                    {loaderFor === "cazi+Compound" ?
                        <div style={{ marginLeft: "45%" }}>
                            <ValueLoader />
                        </div>
                        : "Compound"
                    }
                </div>
                <div onClick={() => loaderFor === "" && active && handleHarvest('cazi', "Harvest")} className="btn btn-primary harvest" style={{ background: active ? "#FB207F" : "#FF8BBD" }}>
                    {loaderFor === "cazi+Harvest" ?
                        <div style={{ marginLeft: "45%" }}>
                            <ValueLoader />
                        </div>
                        : "Harvest"
                    }
                </div>
            </div>
        </div>
        {windowWidth > 768 ?
            <div className="farm-info">
                <div className="info">
                    <div className="itm head ttl-heading">
                        <span className="ttl ttl-heading">Annual</span>
                    </div>
                    <div className="itm cazi-apy">
                        <span className="ttl">CAZI APR:&nbsp;</span>
                        <span className="val">{APRCAZI > 1 ? insertComma(APRCAZI.toFixed(2)) : 0}%</span>
                    </div>                    
                    <div className="itm total-apy">
                        <span className="ttl font-color-title">Total Returns:&nbsp;</span>
                        <span className="val highlight">{(APYCAZI > 1 || APRCAZI > 1) ? insertComma((APYCAZI + APRCAZI).toFixed(2)) : 0}%</span>
                    </div>
                </div>
                <div className="info" style={{ marginLeft: "78px" }}>
                    <div className="itm head">
                        <span className="ttl ttl-heading">Daily</span>
                    </div>
                    <div className="itm cazi-daily-apy">
                        <span className="ttl font-color-title">CAZI Daily:&nbsp;</span>
                        <span className="val font-color-title">{APRCAZI > 1 ? insertComma((APRCAZI / 365).toFixed(2)) : 0}%</span>
                    </div>                    
                    <div className="itm total-daily-apy">
                        <span className="ttl font-color-title">Total Daily:&nbsp;</span>
                        <span className="val highlight">{(APYCAZI > 1 || APRCAZI > 1) ? insertComma(((APYCAZI + APRCAZI) / 365).toFixed(2)) : 0}%</span>
                    </div>
                </div>
                <div className="info" style={{ marginLeft: "100px" }}>
                    <div className="itm head">
                        <span className="ttl ttl-heading">Farm</span>
                    </div>
                    <div className="itm cazi-daily-apy">
                        <span className="ttl font-color-title">CAZI TVL:&nbsp;</span>
                                                ${totalTVLCAZI > 0 ? insertComma((APYCAZI).toFixed(2)) + convertValue(APYCAZI) : "0.00"}
                    </div>
                </div>
                <div className="info learn learnMore">
                    <div className="ttl-heading">
                        <span className="ttl ttl-heading">More</span>
                    </div>

                    <span className='font-color-title'>Learn how to buy and add to staking.<br />
                        <a href="https://cazicazi.gitbook.io/cazi-cazi/help/faq" target="_blank" rel="noreferrer">Tutorial</a></span>
                </div>
            </div> :
            <>
                <div className="farm-info" style={{ padding: "30px", marginTop: "-60px", textAlign: "center" }}>
                    <div className="info">
                        <span className="ttl ttl-heading">Annual</span>
                        <br />
                        <div className="itm cazi-apy" style={{ textAlign: "center", display: "inline" }}>
                            <span className="ttl">CAZI APR:&nbsp;</span>
                            <span className="val"><span className="val">{APRCAZI > 1 ? insertComma(APRCAZI.toFixed(2)) : 0}%</span></span>
                        </div>
                        <br />                        
                        <div className="itm total-apy" style={{ textAlign: "center", display: "inline" }}>
                            <span className="ttl font-color-title">Total Returns:&nbsp;</span>
                            <span className="val highlight">{(APYCAZI > 1 || APRCAZI > 1) ? insertComma((APYCAZI + APRCAZI).toFixed(2)) : 0}%</span>
                        </div>
                    </div>
                </div>
                <div className="farm-info" style={{ padding: "30px", marginTop: "-60px", textAlign: "center" }}>
                    <div className="info">
                        <span className="ttl ttl-heading">Daily</span>
                        <br />
                        <div className="itm cazi-daily-apy" style={{ textAlign: "center", display: "inline" }}>
                            <span className="ttl font-color-title">CAZI Daily:&nbsp;</span>
                            <span className="val font-color-title">{APRCAZI > 1 ? insertComma((APRCAZI / 365).toFixed(2)) : 0}%</span>
                        </div>
                        <br />                        
                        <div className="itm total-daily-apy" style={{ textAlign: "center", display: "inline" }}>
                            <span className="ttl font-color-title">Total Daily:&nbsp;</span>
                            <span className="val highlight">{(APYCAZI > 1 || APRCAZI > 1) ? insertComma(((APYCAZI + APRCAZI) / 365).toFixed(2)) : 0}%</span>
                        </div>
                    </div>
                </div>
                <div className="farm-info" style={{ padding: "30px", marginTop: "-60px", textAlign: "center" }}>
                    <div className="info">
                        <span className="ttl ttl-heading">Farm</span>
                        <br />
                        <div className="itm cazi-daily-apy" style={{ textAlign: "center", display: "inline" }}>
                            <span className="ttl font-color-title">CAZI TVL:&nbsp;</span>
                            <span className="val highlight"> ${totalTVLCAZI ? insertComma((APYCAZI).toFixed(2)) + convertValue(APYCAZI) : "0.00"}</span>
                        </div>
                    </div>
                </div>
                <div className="farm-info" style={{ padding: "30px", marginTop: "-60px", textAlign: "center" }}>
                    <div className="info learn learnMore" style={{ textAlign: "center", display: "inline", marginLeft: "15px" }}>
                        <span className="ttl ttl-heading">More</span>
                        <br />
                        <span className='font-color-title' >Learn how to buy and add to staking.<br />
                            <a href="https://cazicazi.gitbook.io/cazi-cazi/help/faq" target="_blank" rel="noreferrer">Tutorial</a>
                        </span>
                    </div>
                </div>
            </>
        }
    </div>
</div>*/
