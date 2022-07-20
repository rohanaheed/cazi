import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "../Modal/modal.scss";
import "./enable2FA.scss";
import { connect } from 'react-redux';
import { generateQrCode, enable2Fa } from "../../_actions/deposit-withdraw.action";

function Enable2FA(props) {
    const [qrCode, setQrCode] = useState('')
    const [secretKey, setSecretKey] = useState('')
    const [googleCode, setGoogleCode] = useState('');
    const [error, setError] = useState(false);
    const [notValid, setNotValid] = useState(false)
    useEffect(() => {
        qrCodeGeneration();
    }, [])

    const qrCodeGeneration = () => {
        props.dispatch(generateQrCode()).then(
            res => {
                setQrCode(res.qr_code);
                setSecretKey(res.secret_key);
            },
        ).catch(err => {

        })
    }

    const onSubmit = () => {
        if (!googleCode) {
            setError(true);
        }
        else {
            setError(false)
            const data = {
                "is_2fa_enable": true,
                "otp": googleCode
            }
            props.dispatch(enable2Fa(data)).then(res => {
                setNotValid(false);
                props.hideShow();
            }).catch(err => {
                //  props.hideShow();
                setNotValid(true);
            })
        }

    }
    const changeInput = (e) => {
        setGoogleCode(e.target.value);
        setError(false);
        setNotValid(false)
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
                        <h3>Enable 2FA</h3>
                        <div className="sub-title">
                            Scan the following QR code or enter the following secret key in Google Authenticator app
                </div>
                        <div className="qr-code-div">
                            <p>QR Code</p>
                            <img alt="qrcode" src={qrCode} alt="" />
                            <p>Secret Key: {secretKey}</p>
                        </div>
                        <div className="google-code">
                            <p>Google Code:</p>
                            <input className="gogle-code-input form-control" name="otp" value={googleCode} onChange={changeInput}></input>
                            {error ? <span>Please enter google 2FA code</span> : ''}
                            {notValid ? <span>OTP not valid</span> : ''}

                        </div>
                        <div className="btn-div">
                            <button onClick={onSubmit}>Enable 2FA</button>
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
export default connect(mapStateToProps)(Enable2FA);

