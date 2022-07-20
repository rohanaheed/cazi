import React, {useState} from "react";
import { Modal } from "react-bootstrap";
import "../header/model.scss";
import './verification.scss';
import { connect } from 'react-redux';
import {  enable2Fa } from "../../_actions/deposit-withdraw.action";
function VerificationModal(props) {
  // this will use for connect WalletConnect
  const [googleCode,setGoogleCode] = useState('');
  const [error,setError] = useState(false);
  const [notValid,setNotValid] = useState(false)

  const onSubmit = () =>{
    if(!googleCode){
        setError(true);
    }
    else{
      console.log(googleCode)
        props.code(googleCode);
        props.verifiedCode();
        props.hideShow();
        // setError(false)
        // const data ={
        //     "is_2fa_enable": true,
        //     "otp": googleCode
        // }
        // props.dispatch(enable2Fa(data)).then(res=>{
        //         setNotValid(false);
        //         props.hideShow();
        //      //   props.onVerified();
        // }).catch(err =>{
        //   //  props.hideShow();
        //     setNotValid(true);
        // })
    }
   
}
const changeInput = (e)=>{
    setGoogleCode(e.target.value);
    setError(false);
    setNotValid(false)
}
  return (
    <>
      <Modal className="connect-modal"
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="modal-connect-ui whiteBg verification" backdropClassName="custom-backdrop" contentClassName="custom-content verification-content"
        centered
        show={true}
        onHide={() => props.hideShow()}>
       
        <Modal.Body>
          <div className="wallet-connect-list verification-modal">
          <h5>2FA Verification Code</h5>
          <div className="form-group">
             <input type="number" placeholder="Enter verification code" className="form-control code" onChange={changeInput}></input>
             {error ? <span>Please enter google 2FA code</span> : ''}
                    {notValid ? <span>OTP not valid</span> : ''}
          </div>
          <div style={{width:'100%'}}>
          <button className="deposite-button btn btn-primary" onClick={onSubmit}>Submit</button>
          </div>
         
          
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

const mapStateToProps = (state, ) => {
  return { state };
};
export default connect(mapStateToProps)(VerificationModal);
