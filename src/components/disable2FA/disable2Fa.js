import React from "react";
import { Modal } from "react-bootstrap";
import "../Modal/modal.scss";
import "./disable2FA.scss";
import { connect } from 'react-redux';
import { disable2Fa } from "../../_actions/deposit-withdraw.action";

function Disable2FA(props) {
    const onSubmit = () =>{
            const data ={
                "is_2fa_enable": false
            }
            props.dispatch(disable2Fa(data)).then(res=>{
                props.hideShow();
            }).catch(err =>{
                console.log("error");
            })
    }

    const onCancel = () =>{
       props.hideShow()
       return
}
    
    

  return (
    <>
      <Modal className="connect-modal"
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="enable-2Fa-modal whiteBg" backdropClassName="custom-backdrop" contentClassName="custom-content"
        centered
        show={true}
        onHide={() => props.hideShow()}>
        <Modal.Body>
            <div className="enable-2Fa-modal">
                <h3>Disable 2FA</h3>
                <div className="sub-title">
                Are you sure to disable Two Factor Authentication?
                </div>
                <div className="btn-div">
                    <button onClick={onSubmit}>Yes sure</button>
                    <button onClick={onCancel}>Cancel</button>
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
export default connect(mapStateToProps)(Disable2FA);

