//import { showNotification } from "../components/Notifications/showNotification";

function checkWalletConnection(contract, metaMaskAddress) {
  if (contract !== "" && contract !== {} && metaMaskAddress !== "") {
    if (
      window.ethereum.networkVersion === process.env.REACT_APP_CHAIN_ID ||
      window.ethereum.networkVersion === process.env.REACT_APP_CHAIN_ID
    ) {
      return true;
    }
    // showNotification(
    //   "Error",
    //   "Make sure you are connected with your binance smart chain wallet"
    // );
    return false;
  } else {
    // showNotification(
    //   "Error",
    //   "Make sure you are connected with your metamask wallet"
    // );
    return false;
  }
}

export default checkWalletConnection;
