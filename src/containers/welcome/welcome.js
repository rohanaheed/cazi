import React, { Component } from 'react';
import './welcome.scss'
import { getProvidersList, getGamesList, getLiveGameList ,getSlotGameList, getNewsList} from '../../_actions/game-action'
import { connect } from 'react-redux';
import { Card, Container, Row, Col } from 'react-bootstrap';
import Carousel from '../../components/carousel/slider/carousel'
import ProvidersCarousel from '../../components/carousel/providers-slider/providers-sliders';
import Banner from "../../components/banner/banner";
import NewsCarousels from "../../components/carousel/casino-news-slider/news-carousels"

class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            myData: [],
            newsData:[],
            loadingProvider: true,
            loadingEvolution: true,
            loadingGameSlot: true,
            loadingLive: true,
            loadingTheme: true,
            loadingOneTouch: true,
            loadingNews: true,
            evolution_games_data: [],
            providers_data: [],
            live_games_data: [],
            winners_list_data: [],
            providers_list: [],
            game_slots_data: [],
            game_new_love:[],
            
        }
    }
    
    componentDidMount() {
        this.getDetails();
        this.getLists();
        this.getNewsList();
    }

    getNewsList(){
        const clientId = process.env.REACT_APP_MEDIUM_CLIENT_ID;
        this.props.dispatch(getNewsList(clientId)).then(res=>{
            if(res){
                 this.setState({
                newsData: res.items
            })
            }
        })
    }

   
    getDetails() {
        this.setState({ loadingTheme: true })
        this.props.dispatch(getProvidersList()).then(res => {
            if (res) {
                setTimeout(() => {
                    this.setState({ loadingTheme: false })
                }, 500)
                this.setState({
                    myData: res,
                    data: res.map((data, i) => {
                        return (
                            <Card key={i} style={{ width: '18rem' }}>
                                <Card.Img variant="top" style={{ width: '100px', height: '100px' }} src={data.icon} />
                                <Card.Body>
                                    <Card.Title className="text-overflow">{data.provider_name}</Card.Title>
                                    <Card.Text className="text-overflow">
                                        {data.provider_id}
                                    </Card.Text>
                                </Card.Body>
                            </Card>);
                    })
                })
            }
        })
    }

    async getLists() {
        this.setState({
            loadingProvider: true,
            loadingEvolution: true,
            loadingGameSlot: true,
            loadingLive: true,
            loadingNews: true,
            loadingOneTouch: true
        });
        this.props.dispatch(getSlotGameList('trending')).then((res) => {
            if(res){
            this.setState({ evolution_games_data: res.results });
            setTimeout(() => {
                this.setState({ loadingEvolution: false })
            }, 500)
            }
        })

        this.props.dispatch(getGamesList('sp49', 'Live Table')).then((res) => {
            if(res){
            this.setState({ providers_data: res.results });
            setTimeout(() => {
                this.setState({ loadingOneTouch: false })
            }, 500)
            }
        })
        this.props.dispatch(getGamesList('sp53', 'Slots')).then((res) => {
            if(res) {
            this.setState({game_new_love: res.results });
            setTimeout(() => {
                this.setState({ loadingProvider: false, loadingGameSlot: false })
            }, 500)
            }
           
        })

        //get live game list
        this.props.dispatch(getLiveGameList()).then((res) => {
            if(res) {
            this.setState({ live_games_data: res.results });
            setTimeout(() => {
                this.setState({ loadingProvider: false, loadingGameSlot: false })
            }, 500)
            // this.setState({ providers_list: res })
            }
           
        })

        this.props.dispatch(getSlotGameList('slots')).then((res) => {
            if(res) {
            this.setState({ game_slots_data: res.results });
            setTimeout(() => {
                this.setState({ loadingProvider: false, loadingGameSlot: false })
            }, 500)
            // this.setState({ providers_list: res })
            }
           
        })


        this.props.dispatch(getProvidersList()).then(res => {
            if(res) {
            this.setState({ providers_list: res })
            setTimeout(() => {
                this.setState({ loadingProvider: false })
            }, 500)
            }  
        })
    }

    render() {
        return (
            <React.Fragment>
                <Container fluid>
                    <Row>
                        <Col sm={12} className="">
                            <Row>
                                <Col>
                                    <Banner></Banner>
                                    <Carousel provider="Endorphina Gaming" data={this.state.evolution_games_data} title="Evolution" headerName="Trending games" loading={this.state.loadingEvolution} timing="3000" />
                                    <Carousel provider="One Touch" data={this.state.live_games_data} title="Providers" headerName="Best Live games" loading={this.state.loadingOneTouch} timing="4500" />
                                    <Carousel provider="One Touch" data={this.state.game_slots_data} title="Providers" headerName="Best Slot games" loading={this.state.loadingOneTouch} timing="4000" />
                                    <Carousel provider="Iconic Gaming" data={this.state.game_new_love} title="Game_Slots" headerName="New games we love" loading={this.state.loadingGameSlot} timing="3500" />
                                     <ProvidersCarousel data={this.state.providers_list} headerName="Game Providers" loading={this.state.loadingProvider} />
                                    {
                                        (this.state.newsData && this.state.newsData.length) > 0 ? 
                                        <NewsCarousels data={this.state.newsData} headerName="CAZI CAZI news..." /> : ''
                                    }
                                  
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}
const mapStateToProps = (state, ) => {
    return { state };
};
export default connect(mapStateToProps)(WelcomePage);
