import React, { Component } from 'react'
import { Row, Col, Table } from "react-bootstrap"
import './transaction-history.scss'
import { connect } from 'react-redux';
import { withdrawHistory, depositHistory, betAndWonHistory, totalBalance, depositHistoryWithNext, withdrawHistoryWithNext,betAndWonHistoryNext } from '../../_actions/deposit-withdraw.action';
import moment from 'moment';
import InfiniteScroll from "react-infinite-scroll-component";
export class TransactionHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeWithdraw: false,
            activeDeposit: true,
            activeBet: false,
            activeWin: false,
            transactionHistory: [],
            Header: [],
            page: 1,
            limit: 10,
            pageCount: [],
            totalPage: 0,
            activePage: false,
            activeTabType: 'totalDeposit',
            totalWin: 0,
            totalWithdraw: 0,
            totalBet: 0,
            totalDeposit: 0,
            totalBalance: {},
            nextPage:true,
            loadingList:false,
            nextUrl:'',
            fetchMore:false,
            type:''
        }
        
    }
    componentDidMount() {
        this.getDeposit();
        this.getTotalBalance();
        document.getElementById('child-cont').classList.add('trans-history')
    }


    componentDidUpdate(prevState, prevProps){
        if(prevState.state.loginDetails.user_token !== this.props.state.loginDetails.user_token){
            if(!sessionStorage.getItem('loginUser')){
                this.props.history.push('/');
            }
        }
    }

    componentWillUnmount(){
        document.getElementById('child-cont').classList.remove('trans-history')
    }

    showTransactionHash(item){
        if(item.transaction_id){
            window.open(process.env.REACT_APP_BSC_URL + item.transaction_id,'_blank' );
        }
    }

    getTotalBalance() {
        this.props.dispatch(totalBalance()).then((res) => {
            this.setState({
                totalBalance: res.data.data
            })
        })
    }
    getDeposit() {
        this.setState({
            loadingList:true
        })
            this.props.dispatch(depositHistory(10))
                .then((res) => {
                    this.setState({
                        loadingList:false,
                        transactionHistory: res.data.results,
                        nextUrl:res.data.next ? res.data.next.substring((res.data.next.indexOf('api/')+4)) : null,
                        fetchMore:res.data.next ? true : false
                    }, ()=>{
                      //  console.log("next url", this.state.nextUrl)
                    })
                })
                .catch((err) => console.log("Deposit history API failed", err))
    }
    getWithdraw() {
        this.setState({
            loadingList:true
        })
            this.props.dispatch(withdrawHistory(10))
                .then((res) => {
                    console.log(res.data, 'res')
                    this.setState({
                        loadingList:false,
                        transactionHistory: res.data.results,
                        nextUrl:res.data.next ? res.data.next.substring((res.data.next.indexOf('api/')+4)) : null,
                        fetchMore:res.data.next ? true : false
                    }, ()=>{
                      //  console.log("next url in withdraw", this.state.nextUrl)
                    })
                })
                .catch((err) => console.log("Withdraw history API failed", err))
    }
    getBetAndWon(type) {
        this.setState({
            loadingList:true
        })
        this.props.dispatch(betAndWonHistory(type, 10))
            .then((res) => {
                this.setState({
                    loadingList:false,
                    transactionHistory: res.data.results,
                    nextUrl:res.data.next ? res.data.next.substring((res.data.next.indexOf('api/')+4)) : null,
                    fetchMore:res.data.next ? true : false
                }, ()=>{
                 //   console.log("next url in withdraw", this.state.nextUrl)
                })
            })
            .catch((err) => console.log("Bet and Win history API failed", err))
    }
    activeTab(tabType) {
        this.setState({
            transactionHistory:[],
            activeTabType:tabType
        });
            if (tabType === 'totalWithdraw') {
                this.getWithdraw();
                this.setState({
                    activeWithdraw: true,
                    activeDeposit: false,
                    activeWin: false,
                    activeBet: false
                })
            }
            if (tabType === 'totalDeposit') {
                this.getDeposit();
                this.setState({
                    activeWithdraw: false,
                    activeDeposit: true,
                    activeWin: false,
                    activeBet: false
                })
            }
            if (tabType === 'totalBet') {
                this.getBetAndWon('debit');
                this.setState({
                    activeWithdraw: false,
                    activeDeposit: false,
                    activeWin: false,
                    activeBet: true
                })
            }
            if (tabType === 'totalWin') {
                this.getBetAndWon('credit');
                this.setState({
                    activeWithdraw: false,
                    activeDeposit: false,
                    activeWin: true,
                    activeBet: false
                })
            }
    }
    fetchMoreData = () => {
        if (this.state.activeTabType === 'totalDeposit') {
            this.setState({
                loadingList:true
            });
            this.props.dispatch(depositHistoryWithNext(this.state.nextUrl)).then((res) => {
                this.setState({
                    loadingList:false,
                    transactionHistory: this.state.transactionHistory.concat(res.data.results),
                    nextUrl:res.data.next ? res.data.next.substring((res.data.next.indexOf('api/')+4)) : null,
                    fetchMore:res.data.next ? true : false
                }, ()=>{
                 //   console.log("next url in deposit", this.state.nextUrl)
                })
            })
            .catch((err) => console.log("Deposit history API failed", err))
        }
        else if(this.state.activeTabType === 'totalWithdraw'){
            this.setState({
                loadingList:true
            });
            this.props.dispatch(withdrawHistoryWithNext(this.state.nextUrl)).then((res) => {
                console.log(res.data, 'res..........')
                this.setState({
                    loadingList:false,
                    transactionHistory: this.state.transactionHistory.concat(res.data.results),
                    nextUrl:res.data.next ? res.data.next.substring((res.data.next.indexOf('api/')+4)) : null,
                    fetchMore:res.data.next ? true : false
                }, ()=>{
                //    console.log("next url in withdraw", this.state.nextUrl)
                })
            })
            .catch((err) => console.log("Deposit history API failed", err)) 
        }
        else if(this.state.activeTabType === 'totalBet' || this.state.activeTabType === 'totalWin'){
            if(this.state.activeTabType === 'totalBet'){
                this.setState({
                    type:'credit'
                })
            }
            else if(this.state.activeTabType === 'totalWin'){
                this.setState({
                    type:'debit'
                })
            }
            this.setState({
                loadingList:true
            });
            this.props.dispatch(betAndWonHistoryNext(this.state.nextUrl)).then((res) => {
                this.setState({
                    loadingList:false,
                    transactionHistory: this.state.transactionHistory.concat(res.data.results),
                    nextUrl:res.data.next ? res.data.next.substring((res.data.next.indexOf('api/')+4)) : null,
                    fetchMore:res.data.next ? true : false
                }, ()=>{
                //    console.log("next url in withdraw", this.state.nextUrl)
                })
            })
            .catch((err) => console.log("Deposit history API failed", err)) 
        }
        

      }
    render() {
        return (
            <div className="trans-history">
                <div className="txt ttl">Transaction History</div>
                <Row className="transaction-history form-row">
                    <Col md={3} xs={6}>
                        <div className="transaction-inner">
                            <h3 className="transaction-type">Total Withdraw</h3>
                            <p className="amount">${Number(this.state.totalBalance?.total_withdraw) ? Number(this.state.totalBalance?.total_withdraw).toFixed(5) : 0}</p>
                        </div>
                    </Col>
                    <Col md={3} xs={6}>
                        <div className="transaction-inner">
                            <h3 className="transaction-type">Total Deposit</h3>
                            <p className="amount">${Number(this.state.totalBalance?.total_deposit) ? Number(this.state.totalBalance?.total_deposit).toFixed(5) : 0}</p>
                        </div>
                    </Col>
                    <Col md={3} xs={6}>
                        <div className="transaction-inner">
                            <h3 className="transaction-type">Total Bet</h3>
                            <p className="amount">${Number(this.state.totalBalance?.bet_total) ? Number(this.state.totalBalance?.bet_total).toFixed(5) : 0}</p>
                        </div>
                    </Col>
                    <Col md={3} xs={6}>
                        <div className="transaction-inner">
                            <h3 className="transaction-type">Total Payout</h3>
                            <p className="amount">${Number(this.state.totalBalance?.win_total) ? Number(this.state.totalBalance?.win_total).toFixed(5) : 0}</p>
                        </div>
                    </Col>
                </Row>
                <Row className="transaction-history-table">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => this.activeTab('totalDeposit')} className={this.state.activeDeposit ? 'active' : ''}>Deposit</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => this.activeTab('totalBet')} className={this.state.activeBet ? 'active' : ''}>Bet</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => this.activeTab('totalWin')} className={this.state.activeWin ? 'active' : ''}>Payout</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => this.activeTab('totalWithdraw')} className={this.state.activeWithdraw ? 'active' : ''}>Withdraw</a>
                        </li>
                    </ul>
                </Row>
                {
                    (this.state.activeDeposit || this.state.activeBet || this.state.activeWin || this.state.activeWithdraw) ?
                        <Row className="transaction-history-table listing" id="scrollableDiv">
                            {/* to do hasMore={this.state.nextPage} */}
                            {
                              this.state.transactionHistory && this.state.transactionHistory.length > 0 ? 
                               <InfiniteScroll   dataLength={this.state.transactionHistory?.length > 0 ? this.state.transactionHistory?.length : null} next={() => this.fetchMoreData()} hasMore={this.state.fetchMore} loader={this.state.transactionHistory?.length <=0 ? <p className="loadingBox">Loading...</p> : ''} scrollableTarget="scrollableDiv">
                                {this.state.transactionHistory && this.state.transactionHistory?.length > 0 ?
                                    <Col xs={12}>
                                        <Table className="transaction-table" responsive>
                                            <tbody>
                                                {this.state.transactionHistory &&
                                                    this.state.transactionHistory.map((item, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                {/* bet and won */}
                                                                <td>{moment(item.created_ts).format('YY.MM.DD')}</td>
                                                                <td className={this.state.activeDeposit || this.state.activeWithdraw ? 'hidden' : ''}>{item.game_name}</td>
                                                                <td className={this.state.activeDeposit || this.state.activeWithdraw ? 'hidden' : ''}>{item.provider}</td>
                                                                <td className={this.state.activeDeposit || this.state.activeWithdraw ? 'hidden' : ''}>{Number(item.amount).toFixed(5)}</td>

                                                                {/* deposit */}
                                                                <td className={this.state.activeBet || this.state.activeWithdraw || this.state.activeWin ? 'hidden' : ''}>{Number(item.amount).toFixed(6)}</td>
                                                                <td className={this.state.activeBet || this.state.activeWithdraw || this.state.activeWin ? 'hidden' : ''}>{Number(item.given_amount).toFixed(6)}</td>

                                                                {/* withdraw */}
                                                                <td className={this.state.activeBet || this.state.activeDeposit || this.state.activeWin ? 'hidden' : ''}>${Number(item.cazi_dollar_amount).toFixed(6)}</td>
                                                                <td className={this.state.activeBet || this.state.activeDeposit || this.state.activeWin ? 'hidden' : ''}>{Number(item.fee).toFixed(6)}</td>
                                                                <td className={this.state.activeBet || this.state.activeDeposit || this.state.activeWin ? 'hidden' : item.transaction_id ? 'show-link' : ''} onClick={() => this.showTransactionHash(item)}>{Number(item.amount).toFixed(6)} CAZI</td>
                                                                <td className={this.state.activeBet || this.state.activeDeposit || this.state.activeWin ? 'hidden' : ''}>{item.status === 'pending' ? 'Pending' : item.status === 'failed' ? ' Admin Rejected' : 'Completed'}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }

                                            </tbody>
                                        </Table>
                                        {/* {this.state.activePage} */}
                                        {/* <Pagination pageCount={this.state.pageCount} pageClickEvent={this.pageClick} activeTabType={this.state.activeTabType} totalPage={this.state.totalPage}></Pagination> */}
                                    </Col>
                                   :
                                    !this.state.loadingList && this.state.transactionHistory.length === 0 ?
                                    <Col xs={12} className="no-trans-data">
                                        <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/wallet_icon.svg" alt="wallet-icon" />
                                        <p>No transaction found for<br /> this time period</p>
                                    </Col>
                                   : ''
                                }
                          </InfiniteScroll>
                              :  <Col xs={12} className="no-trans-data">
                              <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/wallet_icon.svg" alt="wallet_icon" />
                              <p>No transaction found for<br /> this time period</p>
                          </Col> 
                            }
                             
                        </Row>

                        : ''
                }
            </div>
        )
    }
}

const mapStateToProps = (state, ) => {
    return { state };
};
export default connect(mapStateToProps)(TransactionHistory);