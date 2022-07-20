// import { showNotification } from "../component/Notifications/showNotification";

export function getLpAllowance(metaMaskAddress, contract, setApprovalForLp, dispatch) {
  contract.lpContract.methods
    .allowance(metaMaskAddress, process.env.REACT_APP_STAKING_ADDRESS)
    .call()
    .then((res) => {
      if (parseInt(res) === 0) {
        dispatch(setApprovalForLp(true))
      } else if (parseInt(res) > 0) {
        dispatch(setApprovalForLp(false))
      }
    })
    .catch((err) => {
      return false;
    });
}

export function getCaziAllowance(
  metaMaskAddress,
  contract,
  setApprovalForCazi,
  dispatch
) {
  contract.caziContract.methods
    .allowance(metaMaskAddress, process.env.REACT_APP_STAKING_ADDRESS)
    .call()
    .then((res) => {
      if (parseInt(res) === 0) {
        dispatch(setApprovalForCazi(true))
      } else if (parseInt(res) > 0) {
        dispatch(setApprovalForCazi(false))
      }
    })
    .catch((err) => {
      return false;
    });
}

// export function getAliaAllowance(
//   metaMaskAddress,
//   contract,
//   setApprovalForAlia
// ) {
//   contract.aliaContract.methods
//     .allowance(metaMaskAddress, process.env.REACT_APP_STAKING_ADDRESS)
//     .call()
//     .then((res) => {
//       // console.log("allowance for alia", typeof res, res);
//       if (parseInt(res) === 0) {
//         setApprovalForAlia(true);
//       } else if (parseInt(res) > 0) {
//         setApprovalForAlia(false);
//       }
//     })
//     .catch((err) => {
//       //console.log("err allowance in alia", err);
//       //   showNotification("Error", err.message, "danger", 4000);
//       return false;
//     });
//   }


  