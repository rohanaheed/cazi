import React, { useEffect, useState } from 'react'
import "./withdraw.scss"
import { Card } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {withdraw} from '../../_actions/deposit-withdraw.action';
import { connect } from 'react-redux';
import NotificationModel from '../../components/notificationModel/notificationModel';
import VerificationModal from  '../../components/verificationModal/verificationModal';
import { UPDATE_USER_BALANCE, USER_BALANCE} from '../../_actions/types';
import { useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Switch from "react-switch";
import Enable2FA from '../../components/enable2FA/enable2Fa';
import Disable2FA from '../../components/disable2FA/disable2Fa';
import {getUserProfile} from '../../_actions/welcome.action';
import { getUserBalance } from '../../_actions/game-action'

const Withdraw = (props) => {
    const [userBalance, setUserBalance] =useState(0);
    const [withdrawableBal, setWithdrawableBal] =useState(0);
    const [LivePrice, setLivePrice] = useState(0);
    const [Amount, setAmount] = useState('');
    const [isMax, setIsmax] = useState(false);
    const [userId] = useState(sessionStorage.getItem('id'));
    const [enterAmountErr, setEnterAmountErr] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [showError, setShowError] = useState(false);
    const dispatch = useDispatch();
    const [AmountGet, setAmountGet] = useState(0);
    const [caziAsPerPrice, setCaziAsPerPrice] = useState(0);
    const [showEnable2FaModal, setShowEnable2FaModal] = useState(false);
    const [otp, setOtp] = useState('');
   
    const [showVerification,setShowVerification] = useState(false)
    const [showDisable2FaModal,setShowDisable2FaModal] = useState(false)
    const [notVerified,setNotVirified] = useState(false)
    const [profile,setProfile] = useState({})

    useEffect(()=>{
        const data = props.state.metamaskReducer.user_balance_data
        setUserBalance(data.balance_str !== '' ? Number(data.balance_str) : 0);
        setWithdrawableBal(data.withdrawable_str !== '' ? (data.withdrawable_str): 0);
    }, [props.state.metamaskReducer.user_balance_data, userBalance])


    useEffect(() => {
        setLivePrice(props.state.metamaskReducer.BNBCaziPrice * props.state.metamaskReducer.BNBPrice)
        setRecieveAmount(Amount);
    }, [props.state.metamaskReducer.BNBCaziPrice, props.state.metamaskReducer.BNBPrice])

    useEffect(()=>{
        if(!sessionStorage.getItem('loginUser')){
            props.history.push('/');
        }
    }, [props.state.loginDetails])
    
    useEffect(()=>{
        getProfile();
        getBalance();
    },[])

    const getBalance = ()=> {
        const user = sessionStorage.getItem('loginUser');
        const IsUserLogin = user && JSON.parse(user).AccessToken;
        if (IsUserLogin) {
          props.dispatch(getUserBalance()).then((res) => {
            dispatch({type: UPDATE_USER_BALANCE, payload : false});
            if (res && res.data && res.data.balance) {
              this.setState({ balance: Number(res.data.balance_str) });
              dispatch({type: USER_BALANCE, payload : res.data});
            } else {
              const {dispatch} = this.props;
              dispatch({type: USER_BALANCE, payload : res.data});
              this.setState({ balance: 0 });
            }
          }).catch(err=> {
              dispatch({type: UPDATE_USER_BALANCE, payload : false});
          })
        }
      }

   const getProfile = ()=>{
        props.dispatch(getUserProfile()).then(res=>{
            setProfile(res)
      //      setTwoFaEnable(res.is_2fa_enable);

        }).catch(err=>{
            console.log("inside catch")
        })
    }

    const setRecieveAmount = (amt)=>{
        if(amt){
            const actualRecieveAmt = amt - ((amt) *0.5)/100
            setCaziAsPerPrice((amt) / (props.state.metamaskReducer.BNBCaziPrice * props.state.metamaskReducer.BNBPrice));
            setAmountGet((actualRecieveAmt)/ (props.state.metamaskReducer.BNBCaziPrice * props.state.metamaskReducer.BNBPrice))
        }
        else{
            setCaziAsPerPrice(0);
            setAmountGet(0)
        }
    }

    const onMaxClick = ()=>{
        setAmount((withdrawableBal));
        setIsmax(true);
    }

    const onAmountKeyPress = (e) =>{
        //If caziBalance is 0, show insuffieciebt balance notification
        if(!Number(withdrawableBal)&& e.key){
            showNotification("Insufficient balance");
        }
    }

    const onAmountChange = (event)=>{
        if(!isNaN(Number(event.target.value))){
            //allow only 6 digits after decimal
            const patt = new RegExp(/^\d*(\.\d{0,18})?$/);
            if(!patt.test(event.target.value)&& event.target.value){
                return; 
            }
            if(Number(event.target.value) === Number(withdrawableBal)){
                setIsmax(true);
            }
            else{
                setIsmax(false);
            }
    
            if(Number(event.target.value) > Number(withdrawableBal)){
                setIsmax(true);
                setAmount(Number(withdrawableBal));
                setRecieveAmount(parseFloat(withdrawableBal))
            }
            else{
                setAmount(event.target.value);
                setRecieveAmount(parseFloat(parseFloat(event.target.value)))
            }
        }
    }

    const resetForm = ()=>{
        setAmount('');
        setIsmax(false);
    }

    const showNotification = (message)=>{
        document.getElementsByTagName("BODY")[0].style.paddingTop = "26px";
                setErrorMsg(message);
                setShowError(true);
                setTimeout(()=>{
                    document.getElementsByTagName("BODY")[0].style.paddingTop = "0px";
                    setErrorMsg('');
                    setShowError(false);
        }, 3000)
    }

    const withdrawAmount = (otp) =>{
        if(!Amount){
            document.getElementsByTagName("BODY")[0].style.paddingTop = "26px";
            setEnterAmountErr(true);
            setTimeout(()=>{
                document.getElementsByTagName("BODY")[0].style.paddingTop = "0";
                setEnterAmountErr(false);
            }, 3000) 
            return;
        }else  if(Amount <= 0){
            showNotification('Amount should be greater than 0');
            return;
        }else if(isNaN(Number(Amount))){
            showNotification('Enter valid number');
            return;
        }
        else if((Number(Amount) < 10)){
            showNotification('Minimun 10 CZD required to withdraw');
            return;
        }
        // setTimeout(()=>{
        if(profile.is_2fa_enable && !otp){
                setShowVerification(true);
           }
           else{
               setWithdrawLoading(true);
               const data = {
                   amount : Number(Amount),
                   // address : sessionStorage.getItem('id')
               }
               if(otp){
                data['otp']= (otp);
               }
               props.dispatch(withdraw(data)).then(
                   res=>{
                       setWithdrawLoading(false);
                       if(res && res.status){
                           showNotification('Your withdraw request has been accepted, Our system will process soon!');
                           resetForm();
                           dispatch({type: UPDATE_USER_BALANCE, payload : true});
                       }
                       else{
                           if(res && res.message){
                                showNotification(res.message)
                           }else{
                            showNotification('There is some issue. Please try again.') 
                           }
                       }
                   }
               ).catch(err=>{
                   if(err && err.data && err.data.message){
                       if(typeof err.data.message === 'string'){
                           showNotification(err.data.message)
                       }
                   }
                   setWithdrawLoading(false);
               })
           }
        // }, 1000)
    }

    const onChangeTwoFaToggle = (event) =>{
      //  setTwoFaEnable(event);
        if(event === true){
            setShowEnable2FaModal(true);
        }
        else{
            setShowDisable2FaModal(true)
        }
    }
    const codeVerified = ()=>{
        setNotVirified(true)
    }
    const hideEnabletwoFA = ()=>{
        setShowEnable2FaModal(false);
        getProfile();
    }

    const hideDisabletwoFA = ()=>{
        setShowDisable2FaModal(false);
        getProfile();
    }

    return ( 
        <div className="custom-form-ui-hskdjhf">
           
            <div className="txt ttl">Withdraw</div>
            <Card>
            <Form className="deposit-form">
                <div className="title-wrapper">
                    <div>
                        <p className="mb-1 czd-text form-label" style={{fontWeight: 'bold'}}>CZD balance :</p>
                        <p className="cazi-bal">${withdrawableBal ? Number(withdrawableBal).toFixed(6) : 0.00}</p>
                    </div>
                    <div className="transaction-fee">
                        Transaction Fee : 0.5%
                        <div className="verification-toggle">
                            <label>
    <span>{profile.is_2fa_enable ? 'Disable 2FA' : 'Enable 2Fa'}</span>
                                <Switch height={25} width={55} onColor="#FB207F" onChange={onChangeTwoFaToggle} handleDiameter={25} checked={profile.is_2fa_enable ? profile.is_2fa_enable : false} />
                            </label>
                        </div>
                    </div>
                    
                </div>
                <Form.Group>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control onKeyPress={onAmountKeyPress} onChange={onAmountChange} value={Amount} 
                    className="desposite-input-container" type="text" 
                    placeholder="Enter Withdrawl Amount"/>
                    <div onClick={onMaxClick} className='max'>MAX</div>
                </Form.Group>

                {/* <div className="ml-0 percentage-blocks">
                        <div className="block ml-0">
                            <div>100%</div>
                        </div>
                        <div className="block">
                            <div>50%</div>
                        </div>
                        <div className="block">
                            <div>25%</div>
                        </div>
                    </div> */}
                
                <Form.Group controlId="amount">
                    <Form.Label>Send you CAZI withdrawl to:</Form.Label>
                    <Form.Control readOnly className="desposite-input-container" value={userId} type="text" placeholder="Enter your address"/>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column xs={12}>
                Summary
                </Form.Label>            
            </Form.Group>
            <Form.Group className="mb-0" as={Row} controlId="formHorizontalEmail">
                <Col md={4} xs={6} sm={4} className="pl-right">
                <span><strong>CAZI as per price:</strong></span>
                </Col>
                <Col md={8} xs={6} className="pl-left">
                        {caziAsPerPrice} CAZI
                </Col>
            </Form.Group>
            <Form.Group className="mb-0" as={Row} controlId="formHorizontalEmail">
                <Col md={4} xs={6} sm={4} className="pl-right">
                <span><strong>Transaction fee(0.5%):</strong></span>
                </Col>
                <Col md={8} xs={6} className="pl-left">
                        ${(Amount*0.5)/100}
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalEmail">
                <Col md={4} xs={6} sm={4} className="pl-right">
                    <span><strong>Approx you will get:</strong></span>
                </Col>
                <Col md={8} xs={6} className="pl-left">
                    {AmountGet} CAZI
                </Col>
            </Form.Group>
                <Button disabled={withdrawLoading || !withdrawableBal}  onClick={() =>{withdrawAmount()}} className="deposite-button" type="Button">
                    Withdraw 
                    {withdrawLoading ? <span className="button-loader spinner-border"></span> : null}
                </Button>
            </Form>    
        </Card> 
        <NotificationModel class={enterAmountErr} msg="Please enter amount"/>    
        <NotificationModel class={showError} msg={errorMsg}/> 
        {showEnable2FaModal ? <Enable2FA  hideShow={hideEnabletwoFA}/> : null  }
        {showDisable2FaModal ? <Disable2FA  hideShow={hideDisabletwoFA}/> : null  }
        <NotificationModel class={showError} msg={errorMsg}/>    
        {showVerification ? (
                <VerificationModal
                    show={showVerification} code={(otp) =>{withdrawAmount(otp)}}
                    hideShow={() => setShowVerification(false)} verifiedCode = {codeVerified}
                   
                />
            ) :
                null

            }
        </div>
        );
}

const mapStateToProps = (state, ) => {
    return { state };
};
export default connect(mapStateToProps)(Withdraw);