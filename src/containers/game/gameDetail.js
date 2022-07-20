import React, { Component } from 'react';
import "./game.scss";
import validator from 'validator'
import {getGameUrl, getGameUrlOpen} from '../../_actions/game-action';
import { connect } from 'react-redux';
import EarnPopup from '../../containers/earn/earnPopup';
import { Button } from 'react-bootstrap';
import NotificationModel from '../../components/notificationModel/notificationModel';
const FullScreen = 'https://d2qrsf0anqrpxl.cloudfront.net/assets/images/full-screen.svg';

class GameDetail extends Component{
    constructor(props){
        super(props);
        const  gameDetails  = this.props.history.location.state;
        this.state={
            gameProvider : '',
            gameId: props.match.params.gameId,
            gameName : '',
            game_url: '',
            isLoading: true,
            isUserLoggedIn : false,
            addClass: true,
            showLaunchingSoonPopup : false,
            showMaintainanceMSg : false,
            showNotification : false,
            notificationMsg : '',
            maxbet: 'N/A',
            minbet : 'N/A',
            data: {
                TheoreticalRTP: '96.36',
                time: '125.49',
                week: '62.51',
                month: '59.81',
                volatility: 'Super-high volatility',
                hitRatio: '30.27',
            }
        }
        this.state.isLoading = true;
        const user =sessionStorage.getItem('loginUser');
        this.state.isUserLoggedIn = user && JSON.parse(user).AccessToken;
        this.playGame = this.playGame.bind(this);
        this.fullScreen = this.fullScreen.bind(this);
        this.defaultMode = this.defaultMode.bind(this);
        this.closeLaunchingSoonPopup = this.closeLaunchingSoonPopup.bind(this);
    }
   
    componentDidMount(){
        this.playGame();
    }

    componentDidUpdate(prevState, prevProps){
        if(prevState.state.loginDetails.user_token !== this.props.state.loginDetails.user_token){
            this.setState({isLoading : true});
            this.playGame();
        }
    }

     showNotificationFn (message){
        document.getElementsByTagName("BODY")[0].style.paddingTop = "26px";
            this.setState({notificationMsg : message});
            this.setState({showNotification : true});
            setTimeout(()=>{
                document.getElementsByTagName("BODY")[0].style.paddingTop = "0px";
                this.setState({notificationMsg : ''});
                this.setState({showNotification : false});
        }, 3000)
    }

    playGame =()=>{
            const location = window.location;
            const exitUrl =  `${location.origin}/exit-game/`;
            let apiCall = getGameUrl(this.state.gameId, exitUrl)
            if(!sessionStorage.getItem('loginUser')){
                const uuid = sessionStorage.getItem('uuid')
                apiCall = getGameUrlOpen(this.state.gameId, uuid, exitUrl)
            }
            this.props.dispatch(apiCall).then(
                res => {
                    this.setState({isLoading: false});
                    if(res && res?.success === true){
                        this.setState({maxbet : res?.game_details?.max_bet ? res?.game_details?.max_bet : 'N/A'})
                        this.setState({minbet : res?.game_details?.min_bet ? res?.game_details?.min_bet : 'N/A'})
                        this.setState({gameName : res?.game_details?.game_name})
                        this.setState({gameProvider : res?.game_details?.game_provider})
                    }
                    if(res && res.data && res.data.game_launch === false){
                        this.setState({showMaintainanceMSg : true});
                    }
                    else{
                        this.setState({showMaintainanceMSg : false});
                    }
                    
                    // Alert in case of 500 response code
                    if (res.data && res.data.code && (res.data.code === 500)) {
                        this.setState({showMaintainanceMSg : true});
                    }

                    // Alert in case of sucess false
                    if (res.data && res.data.success && (res.data.success === false)) {
                        this.setState({showMaintainanceMSg : true});
                    }
            
                    if(res && res.data && res.data.url){
                        if (validator.isURL(res.data.url)) {
                            this.setState({game_url: res.data.url})
                        } else {
                            this.setState({showMaintainanceMSg : true});
                        }
                    }
                    else{
                        this.setState({game_url: ''})
                    }
                }
            ).catch(
                err =>{
                    this.setState({game_url: ''});
                    this.setState({isLoading : false});
                    if(err && err.status === 400){
                        this.setState({showMaintainanceMSg : true});
                    }
                    if(err && err.status !== 400){
                        this.setState({showMaintainanceMSg : false});
                        this.showNotificationFn('There is some issue. Please try again later.')
                    }
                }
            )
    }

    fullScreen = () => {
        var elem = document.getElementById("full-screen");
        if(elem !== null) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        }
       
    }

    defaultMode = () => {
        this.setState({addClass: !this.state.addClass});
        if(this.state.addClass){
            document.getElementsByTagName("BODY")[0].classList.add("default-mode");
        } else {
            document.getElementsByTagName("BODY")[0].classList.remove("default-mode");
        }
    }

    
    getLivePrice(){

    }

    closeLaunchingSoonPopup(){
        this.setState({showLaunchingSoonPopup : false});
    }

    showLaunchingSoonPopup(){
        this.setState({showLaunchingSoonPopup : true});
    }

    render() {
        return (
            <div className="game-detail-main">
                <div className="col-12">
                <div className="game-board">
                <div className="game-board-main">
                    <section className="game-board-header">
                        <div className="game-board-heading">
                            <div className="game-board-heading-main">
                            <div className="game-board-heading-child1">
                                {/* <img src={starIcon} height="14" width="14" alt=""></img> */}
                            </div>
                            <div>
                            <a href="#">
                                <p color="trunks.100" className="caption-heading">{this.state.gameProvider}</p>
                            </a>
                            <h1 size="18" id="gameName" color="bulma.100" className="caption-description">{this.state.gameName}</h1>
                            </div>
                            </div>
                        </div>
                    </section>
                </div>
                </div>
                <div  id="game-placeholder" 
                className={this.state.isLoading || !this.state.game_url || this.state.showMaintainanceMSg ? 'game-placeholder show-bg-image sc-hLGeHF hqPRkS' : 'game-placeholder sc-hLGeHF hqPRkS'}>
                 {this.state.showMaintainanceMSg && !this.state.isLoading  ? 
                        <div className="msg-div">
                            <Button  variant="light" className="login-btn unlock-btn btn-coming-soon">Game provides's issue. Please check after sometime.</Button>
                        </div>
                        : null }
                    {this.state.game_url && !this.state.isLoading && !this.state.showMaintainanceMSg  ? 
                    <iframe id="full-screen" src={this.state.game_url} className="game-iframe" frameBorder="0"></iframe> : null}
                    {this.state.isLoading ? 
                        <div className="game-loader"><div className="spinner-border"></div></div>
                    : null}
                </div>
                <div data-testid="game-footer" className="sc-eCjkpP ehteiz game-footer">
                    <section className="sc-eCssSg sc-irOQnY hmocIu bhfAri">
                        <div className="sc-dHntBn hoynti">
                            <div className="sc-fFubgz lmjwiP">
                                <button className="Button__StyledButton-sc-1xtdszg-0 gFyXrg" data-testid="button-component" data-gtm-event-element="true" data-gtm-event-category="button">
                                    <div className="Button__InnerContainer-sc-1xtdszg-1 llPLzd"><span data-translation="game.quick_deposit">Quick deposit</span></div></button></div></div><div className="sc-ezront fmBQoE"><div className="sc-iuGMqu kKOGoe"><div className="sc-fkubWd iXQHrd"><a id="btn-LIKE" className="sc-fnlXYz fCoZLE"><div type="LIKE" className="sc-jcRDWI gHZeSM">
                                    </div>
                                </a><a id="btn-DISLIKE" className="sc-fnlXYz fCoZLE"><div type="DISLIKE" className="sc-jcRDWI fmBCQr">
                                    </div>
                                    </a></div></div>
                                    {/* TODO Later */}
                                    {/* <div className="sc-hguquU kZsUpz"><p color="trunks.100" className="Caption-sc-1jvwbix-0 gDgPst"><span data-translation="game.fun_mode">Fun mode</span></p>
                                    <input onClick={() => this.showLaunchingSoonPopup() } type="checkbox" data-gtm-event-element="true" data-gtm-event-category="toggler_button" data-gtm-event-label="real mode" data-gtm-event-location="Game_screen" className="sc-fiKUUL ePDhwg" />
                                    <p color="bulma.100" className="Caption-sc-1jvwbix-0 hShlDk"><span data-translation="game.real_mode">Test mode</span></p></div> */}
                                    {/* <div onClick={() => this.defaultMode() } data-testid="mode-toggler-casino.theater-mode" title="Theatre mode" className="sc-hlWvWH dgxEoC"> */}
                                        {/* <img src={Rectangle} width="24" height="24" alt=""></img> */}
                                    {/* </div> */}
                                    <div className="sc-lgqmxq FGHoO ml-2" onClick={() => this.fullScreen() }>
                                        <img src={FullScreen} width="24" height="24" alt="fullscreen-icon"></img>
                                    </div>
                        </div>
                    </section>
                </div>
                <div className="sc-fFubgz sc-fKFyDc sc-bBXqnf sc-ha-DqYV dHncMn dGOgVd gClWdr fduQSa">
                    <h4 size={20} color="bulma.100" className="Heading-sc-1fj2bsx-0 jLpxQA">
                        <span data-translation="casino.game_stats">Game stats</span>
                    </h4>
                    <table className="sc-gyUeRy fFXEDN sc-kTaSZA lkHebe">
                        <tbody>
                            <tr className="sc-gVgnHT fVqplI">
                                <td className="sc-fWPcDo dEPeiI">
                                    <span data-translation="casino.min_bet">Min. bet</span>
                                </td>
                                <td className="sc-fHYxKZ cLktaq">
                                    <span>{this.state.minbet !== 'N/A' && '$'}{this.state.minbet}</span>
                                </td>
                            </tr>
                            <tr className="sc-gVgnHT fVqplI">
                                <td className="sc-fWPcDo dEPeiI">
                                    <span data-translation="casino.max_bet">Max. bet</span>
                                </td>
                                <td className="sc-fHYxKZ cLktaq">
                                    <span>{this.state.maxbet !== 'N/A' && '$'}{this.state.maxbet} </span>
                                </td>
                            </tr>
                            {/* <tr className="sc-gVgnHT fVqplI">
                                <td className="sc-fWPcDo dEPeiI">
                                    <span data-translation="casino.volatility">Volatility</span>
                                </td>
                                <td className="sc-fHYxKZ cLktaq">
                                    <span data-translation="casino.volatility_6">{this.state.data.volatility}</span>
                                </td>
                            </tr>
                            <tr className="sc-gVgnHT fVqplI">
                                <td className="sc-fWPcDo dEPeiI">
                                    <span data-translation="casino.hit_ratio">Hit ratio %</span>
                                </td><td className="sc-fHYxKZ cLktaq">{this.state.data.hitRatio}%</td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
                <div size={40} className="sc-lmoMRL fqweQE" />
                </div>
                <NotificationModel class={this.state.showNotification} msg={this.state.notificationMsg}/>
                <EarnPopup handleClose={this.closeLaunchingSoonPopup} show={this.state.showLaunchingSoonPopup} />
            </div>
        )
    }
};

const mapStateToProps = (state, ) => {
    return { state };
};
export default connect(mapStateToProps)(GameDetail);
