import React , {useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import "./deposit.scss"
import {depositBalance} from "../../_actions/transaction.action"
import insertComma from "../../utils/insertComma";
import ReactTooltip from "react-tooltip";
import { Card } from "react-bootstrap"
import { connect } from 'react-redux';
import NotificationModel from '../../components/notificationModel/notificationModel'
import { UPDATE_USER_BALANCE} from '../../_actions/types';
import { Prompt } from 'react-router'
const Web3 = require("web3");

const Deposit = (props) => {
    
    const dispatch = useDispatch();
    const [caziBalance,setcaziBalance] = useState('')
    const [LivePrice, setLivePrice] = useState(0);
    const [AmountGet, setAmountGet] = useState(0);
    const [depositeAmount,setDepositeAmount] = useState('')
    const [enterAmountErr,setEnterAmountErr] = useState('')
   // const { contract , metaMaskAddress, BNBCaziPrice, BNBPrice, caziPriceDollar } = useSelector(state => state.metamaskReducer);
    const [transactionInProgress, setTransactionInProgress] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState(false);
    const [depositLoading, setDepositLoading] =useState(false);
    const [isMax, setIsMax] = useState(false);
    const CaziContractTestNet = JSON.parse(process.env.REACT_APP_NET_ABI);
    const depositAddress = process.env.REACT_APP_DEPOSIT_ADDRESS;
    const tokenAddress = process.env.REACT_APP_TOKEN_ADD;
    const [shouldBlockNavigation, setShouldBlockNavigation] = useState(false);

  
    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
      }, [shouldBlockNavigation]);

      const alertUser = e => {
          if(shouldBlockNavigation){
            e.preventDefault();
            e.returnValue = '';
          }
      }

    useEffect(() => {
        setLivePrice(props.state.metamaskReducer.BNBCaziPrice * props.state.metamaskReducer.BNBPrice)
        setAmountGet(depositeAmount * props.state.metamaskReducer.BNBCaziPrice * props.state.metamaskReducer.BNBPrice)
    }, [props.state.metamaskReducer.BNBCaziPrice, props.state.metamaskReducer.BNBPrice])
 
    useEffect(()=>{
        setcaziBalance(props.state.metamaskReducer.caziBalance);
    }, [props.state.metamaskReducer.caziBalance])

    

    useEffect(()=>{
        if(!sessionStorage.getItem('loginUser')){
            props.history.push('/');
        }
    }, [props.state.loginDetails])


    const showNotificationFn = (message)=>{
        document.getElementsByTagName("BODY")[0].style.paddingTop = "26px";
                setNotificationMsg(message);
                setShowNotification(true);
                setTimeout(()=>{
                    document.getElementsByTagName("BODY")[0].style.paddingTop = "0px";
                    setNotificationMsg('');
                    setShowNotification(false);
        }, 3000)
    }




    const changeDepositeAmount = (e) => {
        if(!isNaN(Number(e.target.value))){
            const patt = new RegExp(/^\d*(\.\d{0,18})?$/);
            if(!patt.test(e.target.value)&& e.target.value){
                return; 
            }
            if(Number(e.target.value) === Number(caziBalance)){
                setIsMax(true);
            }
            else{
                setIsMax(false);
            }
    
            if(Number(e.target.value) > Number(caziBalance)){
                setIsMax(true);
                setDepositeAmount(Number(caziBalance));
                setAmountGet(parseFloat(caziBalance)* parseFloat(LivePrice))
    
            }
            else{
                e.target.value !=='' ? setDepositeAmount((e.target.value))  : setDepositeAmount((e.target.value))      
                setAmountGet(parseFloat(e.target.value)* parseFloat(LivePrice))
            }
    
        }
    }

    const handleErrorAccount = err => {
       showNotificationFn('Error while getting your account info')
    }

    

    const handleInProgressTransaction = () => {
        showNotificationFn('Transaction is already in process. Complete or Abort it first.')
    }

    const handleErrorTransaction = (err) => {
        showNotificationFn('Something went wrong while making the transaction.')
    }

    const resetForm = ()=>{
        setDepositeAmount('');
        setAmountGet(0);
    }

    const onMaxClick = ()=>{
        setDepositeAmount((caziBalance));
        setIsMax(true);
        setAmountGet(parseFloat(caziBalance) * parseFloat(LivePrice))
    }

    const onAmountKeyPress = (e) =>{
        //If caziBalance is 0, show insuffieciebt balance notification
        if(!Number(caziBalance)&& e.key){
            showNotificationFn("Insufficient balance");
        }
    }
    

    const handleAccountDeposite = async () => {
        //check login status first
        if(!sessionStorage.getItem('loginUser')){
            props.history.push('/');
            return;
        }
        if(!depositeAmount){
            document.getElementsByTagName("BODY")[0].style.paddingTop = "26px";
            setEnterAmountErr(true);
            setTimeout(()=>{
                document.getElementsByTagName("BODY")[0].style.paddingTop = "0";
                setEnterAmountErr(false);
            }, 3000) 
            return;
        }
        else  if(depositeAmount <= 0){
            showNotificationFn('Amount should be greater than 0');
            return;
        }
        else if(isNaN(Number(depositeAmount))){
            showNotification('Enter valid number');
            return;
        }
        else if (transactionInProgress) {
            handleInProgressTransaction();
        }
        if(sessionStorage.getItem('id')){
            var web3 = new Web3(props.state.metamaskReducer.provider);
            web3.eth
            .getAccounts()
            .then((acc) => {
                if (acc[0]) {
                    setShouldBlockNavigation(true);
                    setDepositLoading(true);
                    setTransactionInProgress(true);
                    let caziContract = new web3.eth.Contract(CaziContractTestNet,tokenAddress)
                    caziContract.methods.transfer(depositAddress,web3.utils.toWei(depositeAmount.toString()))
                        .send({ from: acc[0] })
                        .then((res) => {
                            dispatch(depositBalance({hash: res.transactionHash}))
                            .then((res) => {
                                setShouldBlockNavigation(false);
                                setDepositLoading(false);
                                if(res && res.success){
                                    resetForm();
                                    setTransactionInProgress(false);
                                    showNotificationFn(res.message);
                                    dispatch({type: UPDATE_USER_BALANCE, payload : true});
                                }
                            })
                            .catch((err) => {
                                setDepositLoading(false);
                                showNotificationFn('There is some issue. Please try again.');
                                console.log("err after depositBalance",err)})
                        })
                        .catch((err) => {
                            setShouldBlockNavigation(false);
                            setDepositLoading(false);
                            console.log("err in caziContract",err)
                            setTransactionInProgress(false);
                            handleErrorTransaction(err);
                        });
                }
            })
            .catch((err) => {
                setShouldBlockNavigation(false);
                setDepositLoading(false);
                setTransactionInProgress(false);
                handleErrorAccount(err);
            });
        }
    }



    return ( 
        <>
         <Prompt
            when={shouldBlockNavigation}
            message='Changes that you made may not be saved.'/>

<div className="custom-form-ui-hskdjhf">
        <div className="txt ttl">Deposit</div>
        <Card>
        <Form className="deposit-form">
            <div className="row">
                <div className="col-sm-12">
                <Form.Group controlId="amount">
                    <Form.Label>Currency</Form.Label>
                    <Form.Control className="desposite-input-container" 
                    type="text" readOnly defaultValue="CAZI"/>         
                </Form.Group>
                </div>
                <div className="col-sm-12">
                <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <span className="val" data-display-decimals="6">
                        /{caziBalance ? Number(caziBalance).toFixed(6) : 0}
                    </span>
                    <Form.Control onKeyPress={onAmountKeyPress} className="desposite-input-container" 
                    type="text" placeholder="Enter Amount" 
                    onChange={changeDepositeAmount} value={depositeAmount}/>
                    <div onClick={onMaxClick} className='max'>MAX</div>
                </Form.Group>
                </div>
            </div>
            
           
            <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column xs={12}>
                Summary
                </Form.Label>            
            </Form.Group>
            <Form.Group className="mb-0" as={Row} controlId="formHorizontalEmail">
                <Col md={3} xs={6} sm={4} className="pl-right">
                <span><strong>CAZI Live Price</strong></span>
                </Col>
                <Col md={9} xs={6} className="pl-left">
                    { LivePrice ? '$' + LivePrice.toFixed(5) : '$0.00000'}
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalEmail">
                <Col md={3} xs={6} sm={4} className="pl-right">
                    <span><strong>You get</strong></span>
                    <span data-tip="Estimated amount you receive which may vary due to price volatility." data-for='toolTip1' data-place='top' className="tooltipci"></span>
                    <ReactTooltip id="toolTip1" />
                </Col>
                <Col md={9} xs={6} className="pl-left">
                    {AmountGet > 0 ?"$"+  insertComma(AmountGet.toFixed(6).toString(), true) : "$0.000000"}
                </Col>
            </Form.Group>
            <Button disabled={depositLoading  || !props.state.metamaskReducer.caziBalance} className="deposite-button" type="Button" onClick={handleAccountDeposite}>
                Deposit 
                {depositLoading ? <span className="button-loader spinner-border"></span> : null}
            </Button>
        </Form>    
    </Card>  
    <NotificationModel class={enterAmountErr} msg="Please enter amount"/>
    <NotificationModel class={showNotification} msg={notificationMsg}/>  
    </div>
    </>
    
    );
}
const mapStateToProps = (state, ) => {
    return { state };
};
export default connect(mapStateToProps)(Deposit);
