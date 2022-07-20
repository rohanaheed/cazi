import { useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";

const useAuth = () => {
  const { activate, deactivate } = useWeb3React();

  const login = useCallback(() => {
    const connector = new WalletConnectConnector({
      rpc: {
        [process.env.REACT_APP_CHAIN_ID]: process.env.REACT_APP_HTTP_PROVIDER,
      },
      bridge: "https://bridge.walletconnect.org",
      qrcode: true,
      pollingInterval: 12000,
    });

    if (connector) {
      activate(connector, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector);
        } else {
          console.log("error whileactivating connecting", error);
        }
      });
    } else {
    }
  }, []);

  return { login, logout: deactivate };
};

export default useAuth;
