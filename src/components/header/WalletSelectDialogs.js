import React from "react";
import { Modal } from "react-bootstrap";

import "./model.scss";
import {
  isMobile
} from "react-device-detect";

function WalletSelectDialog(props) {
  return (
    <>
      <Modal className="connect-modal"
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName={isMobile ?  'modal-connect-ui modal-connect-ui-mobile whiteBg' : "modal-connect-ui  whiteBg"} backdropClassName="custom-backdrop" contentClassName="custom-content"
        centered
        show={true}
        onHide={() => props.hideShow()}>
       

        <Modal.Body>
          <div className="wallet-connect-list">
            {(!isMobile)? <div className="wallet-connect-item metaMask">
              <div className="cta-" onClick={() => {
                props.connectWithWallet('metamask')
                props.hideShow()
              }}>
                <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/metmask-icon.svg" alt="metamask-icon"/>
                <h5>Metamask</h5>
                <p>Connect to your MetaMask Wallet</p>
              </div>
            </div> : null }
            {(!isMobile) ? <div className="wallet-connect-item second-child binance">
              <div className="cta-" onClick={() => {
                props.connectWithWallet("binanceSmartChain")
                props.hideShow()
                }}>
                <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/binance-icon.svg" alt="binance-icon"/>
                <h5 style={{cursor:'pointer'}} >Binance Chain Wallet</h5>
                 <p>Binance Chain Wallet</p>
              </div>
            </div> : null}
            <div className="wallet-connect-item" onClick={() => {
              props.connectWithWallet("mobileWallet")
            }}>
              <div className="cta-">
                <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/WalletConnect.svg" className="wallet" alt="walletConnect-icon"/>
                <h5 style={{cursor:'pointer'}} >Wallet Connect</h5>  
           <p className="mb-0">Connect metamask via walletconnet</p>
           <p className="smallText">(Other wallet will be coming soon)</p>
              </div>
            </div>

          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(WalletSelectDialog);
