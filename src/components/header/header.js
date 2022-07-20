import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { IsUserLogin } from '../../_services/auth.service';
import ConnectButton from './connect-button';
import { Navbar, Button, Nav, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import './header.scss';
import { getUserBalance } from '../../_actions/game-action';
import { refreshToken } from '../../_actions/auth.actions';
import { LOGIN_SUCCESS, USER_BALANCE, UPDATE_USER_BALANCE } from '../../_actions/types';
import socketService from '../../services/socketService';
import NotificationModel from '../../components/notificationModel/notificationModel'
import {
  isMobile, isBrowser
} from "react-device-detect";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenuSection: false,
            show: false,
            DefaultTab: 'All',
            balance : 0,
            isLoggedIn : false,
            livePrice : 0,
            showConnectBtn : isBrowser,
            back: false,
            showFlag: false,
            showSpinner: true,
            selectedFlag: "https://cdn.xanalia.com/assets/images/en.svg",
            unSelectedFlag: "https://cdn.xanalia.com/assets/images/ko.svg",
            unSelectedFlag1: "https://cdn.xanalia.com/assets/images/ja.svg",
            // unSelectedFlag2: "https://cdn.xanalia.com/assets/images/zh-hant.png",
            selectedLang: localStorage.getItem("lang") || "en",

            open: false,
            showModal: false,

            showConnectedModal: false,
            showNotificationModal : false,
            showWalletConnectDialog: false,
            notificationMsg : false
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleClickBlur = this.handleClickBlur.bind(this);
        this.getRefreshToken = this.getRefreshToken.bind(this);
        const loginUser = sessionStorage.getItem('loginUser');
        this.getLivePrice = this.getLivePrice.bind(this);
        this.state.isLoggedIn = loginUser && JSON.parse(loginUser).AccessToken;
    }

    componentDidUpdate(prevState, prevProps) {
      if(prevState.state.metamaskReducer.update_user_balance !== this.props.state.metamaskReducer.update_user_balance){
        if(this.props.state.metamaskReducer.update_user_balance){
          this.getUserBalance();
        }
      }
    }

    componentDidMount() {
        const loginUser = sessionStorage.getItem('loginUser');
        this.setState({isLoggedIn : loginUser && JSON.parse(loginUser).AccessToken});
        this.showSidebarChange();
        window.addEventListener('resize', this.showSidebarChange);
        this.getRefreshToken();
        // const handler = e => {
        //     this.setState({showConnectBtn: e.matches && !isMobile})
        // };
        // window.matchMedia("(min-width: 768px)").addListener(handler);
        this.getUserBalance();
        const dispatch  = this.props?.dispatch && this.props?.dispatch;
        const data = (val) => {
          this.setState({ balance: Number(val)})
        }
        if(loginUser){
          socketService && socketService.addEventListener('message', function(event) {
            const json = `${event.data}`;
            const response = JSON.parse(json);
            if (response?.data?.message_details?.cazi) {
              dispatch({ type: USER_BALANCE, payload: {"balance_str" : response?.data?.message_details?.cazi, "withdrawable_str" : response?.data?.message_details?.withdrawable_cazi} });
              data(response?.data);
            }
          })
        }
        const token = loginUser && JSON.parse(loginUser).AccessToken;
        if(localStorage.getItem('alreadyLoggedIn') && !token){
          this.showNotificationFn('You are already login on another tab')
      }
    }

     showNotificationFn = (message) => {
      document.getElementsByTagName("BODY")[0].style.paddingTop = "26px";
      this.setState({showNotificationModal : true, notificationMsg : message})
      setTimeout(() => {
          document.getElementsByTagName("BODY")[0].style.paddingTop = "0px";
      this.setState({showNotificationModal : false, notificationMsg : ''})
      }, 3000)
  }
    
  getUserBalance() {
    const user = sessionStorage.getItem('loginUser');
    const IsUserLogin = user && JSON.parse(user).AccessToken;
    const {dispatch} = this.props;
    if (IsUserLogin) {
      this.props.dispatch(getUserBalance()).then((res) => {
        dispatch({type: UPDATE_USER_BALANCE, payload : false});
        if (res && res.data && res.data.balance) {
          this.setState({ balance: Number(res.data.balance_str) });
          const {dispatch} = this.props;
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

  getRefreshToken() {
    const loginUser = sessionStorage.getItem('loginUser');
    const accessToken = loginUser && JSON.parse(loginUser).AccessToken;
    if (accessToken) {
      //TO DO - time is not clear
      let countdown = 30 * 60 * 1000;
      // let countdown = 1 * 60 * 1000;
      setInterval(() => {
        const user = sessionStorage.getItem('loginUser')
        const refreshTkn = user && JSON.parse(user).RefreshToken;
        const data = {
          refresh: refreshTkn,
        };
        this.props.dispatch(refreshToken(data)).then((res) => {
          if (res && res.AccessToken) {
            sessionStorage.setItem('loginUser', JSON.stringify(res))
            localStorage.setItem("activeUserToken", (res.AccessToken))
            const {dispatch} = this.props;
            dispatch({type: LOGIN_SUCCESS, payload : res})
          }
        });
      }, countdown);
    }
  }

  showSidebarChange = () => {
    if (window.innerWidth > 1024) {
      this.props.onSidebarToggle(true);
    } else {
      this.props.onSidebarToggle(false);
    }
  };

  handleClick() {
    if (this.state.show) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  }

  handleClickBlur(e) {
    if (
      e.target.className === 'nav-link' ||
      e.target.className === 'tab-content' ||
      e.target.className === 'info'
    ) {
      this.setState({ show: true });
    }
  }

  showHideSidebar = () => {
    if (this.props.sidebarExpanded) {
      this.props.onCloseSidebar();
    } else {
      this.props.onSidebarToggle(!this.props.sidebarExpanded);
    }
  };

  getLivePrice(price) {
    this.setState({ livePrice: price ? price.toFixed(5) : 0.0 });
  }



openBuyCaziLink() {
    window.open('https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x45E4ec2d4e2BA648052F1f08C7c73dFdc0744Fc0', '_blank');
}


handleOpen() {
    document.getElementById("mobile-overlay-div").classList.add("mobile-overlay-div");
    document.getElementById("sidebar").classList.remove("hideClass");
    document.getElementById("sidebar").classList.add("showClass");
}

resize() {
    if (window.innerWidth > 1020) {
        document.getElementById("sidebar").classList.add("showClass");
        document.getElementById("sidebar").classList.remove("hideClass");
        document.getElementById("mobile-overlay-div").classList.remove("mobile-overlay-div");
    }
}

  openBuyCaziLink(){
    window.open('https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x45E4ec2d4e2BA648052F1f08C7c73dFdc0744Fc0','_blank');
  }

    render() {
        return (
            <div className="headerMain">
                <div className="row">
                    <Col sm={12} className="headerTop">
                        <Navbar bg="light" expand="lg"  id="header-nav" collapseOnSelect>
                            <img src='https://d2qrsf0anqrpxl.cloudfront.net/assets/images/menu.svg' onClick={() => this.showHideSidebar()} className="menu-bar" alt="menu" />
                            <div className="logo-div">
                                <Link className="headerWithLogo" to={'/'}>
                                    <img className="img-fluid" src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/CAZI-favicon.png" alt="CAZI CAZI" />
                                    <img className="img-fluid" src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/cazi-new-logo.svg" alt="CAZI CAZI" />
                                </Link>
                            </div>
                            { (IsUserLogin()) || (<Nav className="ml-auto my-navbar header-button-container">
                                 <div className="tiger-img"><span><img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/header-tiger.png" alt="header-tiger" /> ${this.state.livePrice}</span></div>
                                 <Button onClick={this.openBuyCaziLink} variant="light" className="buy-cazi-btn">BUY CAZI</Button>
                                 <div className="header-connect-btn">
                                { (isBrowser) && (<ConnectButton 
                                 livePrice={this.getLivePrice}
                                 />)} </div>
                            </Nav>)}
                        </Navbar>
                    </Col>
                </div>
                <NotificationModel class={this.state.showNotificationModal} msg={this.state.notificationMsg}/>
            </div>
        );
    }
}



const mapStateToProps = (state) => {
return{state}
};


const mapDispatchToProps = (dispatch) =>{
  return { dispatch };
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
