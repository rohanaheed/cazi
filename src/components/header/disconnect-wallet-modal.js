import React, { useState } from 'react';
//import { showNotification } from '../../components/Notifications/showNotification';
import '../Modal/modal.scss';
import { Modal } from "react-bootstrap";

const DisconnectWalletModal = (props) => {

    const [msgCopied, setMsgCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(props.address)
        setMsgCopied(true);
        setTimeout(() => {
            setMsgCopied(false);
        }, 3000)
        // showNotification(
        //     "Copy Adsress",
        //     `Address copied to clipboard`,
        //     "success",
        //     4000
        // );
    }

    const showHideClassName = props.show ? "modal display-block" : "modal display-none";
    return (
        <Modal id="connect" className={`connect-modal`}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName= {`modal-connect-ui whiteBg`}
        backdropClassName="custom-backdrop" contentClassName="custom-content"
        centered
        show={props.show}
        onHide={() => showHideClassName}>
       

        <Modal.Body>
        <section className="modal-main disconnect-wallet-modal">
               <div className="modal fade" >
                   <div className="modal-dialog">
                       <div className="modal-content">
                           <div className="modal-header">
                               <button type="button" className="close" data-dismiss="modal" onClick={props.handleClose}>&times;</button>
                               <h3 className="modal-title" style={{'color': '#000'}}>Account</h3>
                           </div>
                           <div className="modal-body">
                               <div className="modal-body-inner">
                                   <span style={{'color': '#000'}}><svg id="Layer_1" enableBackground="new 0 0 508.495 508.495" height="512" viewBox="0 0 508.495 508.495" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m151.938 102.708h-135.938c-8.836 0-16 7.163-16 16v81.104c0 8.837 7.164 16 16 16 21.193 0 38.435 17.242 38.435 38.436s-17.242 38.434-38.435 38.434c-8.836 0-16 7.163-16 16v81.105c0 8.837 7.164 16 16 16h135.938z" /><path d="m492.495 215.812c8.836 0 16-7.163 16-16v-81.104c0-8.837-7.164-16-16-16h-308.557v303.08h308.557c8.836 0 16-7.163 16-16v-81.105c0-8.837-7.164-16-16-16-21.193 0-38.435-17.241-38.435-38.435s17.242-38.436 38.435-38.436z" /></svg> 
                                   {props.address ? props.address.toString().substring(0, 6) + '.....' + props.address.toString().substr(props.address.length - 4) : ''}</span>
                                   <span className="copy" onClick={copyAddress}>Copy address</span>
                                   <div className={msgCopied ? 'copy-msg fadeIn' : 'copy-msg fadeOut'}>
                                       <span>Address Copied</span>
                                   </div>
                               </div> 

                               <div className="disconnect-btn">
                                   <button className="btn"
                                       onClick={props.disconnect}>Disconnect wallet</button>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </section>
        </Modal.Body>
      </Modal>

    )
}
export default DisconnectWalletModal;