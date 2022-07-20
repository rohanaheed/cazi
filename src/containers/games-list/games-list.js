import React, { Component } from 'react';
import "./games-list.scss";
import {getGamesList, getProviderGameType} from '../../_actions/game-action';
import { connect } from 'react-redux';
import { Card, Row, Col } from "react-bootstrap";
import MultiSelect from "react-multi-select-component";
const loader_image = 'https://d2qrsf0anqrpxl.cloudfront.net/assets/images/site_image/loader.gif';


class GamesList extends Component{
    constructor(props){
        super(props);
        this.state = {
            provider_id : props.match.params.providerId,
            games: [],
            gameTypes: [],
            selectedCategory : [],
            isLoading: true,
            previouslySelectedOptions : []
        }
        this.getTypes = this.getTypes.bind(this);
        this.goToGameDetails = this.goToGameDetails.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
    }

    goToGameDetails(item){
        this.props.history.push({
        pathname : `/game-detail/${item.id}`,
        state: item});
    }

    componentDidMount(){
        this.getTypes();
    }

    getTypes(){
        this.props.dispatch(getProviderGameType(this.state.provider_id)).then(
            res=>{
                this.setState({isLoading : false});
                if(res && res.data){
                    this.setState({gameTypes : res.data})
                    this.setState({selectedCategory : [{value: res.data[0], label: res.data[0]}]});
                    this.getGames(res.data);
                }
            }
        ).catch(err =>{
            this.setState({isLoading : false});
        })
    }

    getGames(types){
        this.setState({isLoading : true});
        if(types && types.length > 0){
            this.props.dispatch(getGamesList(this.state.provider_id, types[0])).then(
                res=>{
                    this.setState({isLoading : false});
                    if(res && res.results){
                        this.setState({games : [...res.results]})
                    }
                }
            ).catch(err =>{
                this.setState({isLoading : false});
            })
        }
        else{
            this.setState({games : []})
        }
    }
    getGamesCategory(types){
        this.setState({isLoading : true});
        this.props.dispatch(getGamesList(this.state.provider_id, types)).then(
            res=>{
                if(res && res.results){
                    this.state.games.push(...res.results);
                    this.setState({isLoading : false});
                }
            }
        ).catch(err =>{
            this.setState({isLoading : false});
        })
    }
  

    onChangeType(e){
        let previous = this.state.selectedCategory.map(item => {
            return item.value
        })
        let current = e.map(item => {
            return item.value
        })
        this.setState({selectedCategory : e});
        let removed = [];
        for(let i=0;i < e.length;i++){
            if(!previous.includes(e[i].value)){
                this.getGamesCategory(e[i].value);
            }
        }

        for(let i=0;i < previous.length;i++){
            if(!current.includes(previous[i])){
                removed.push(previous[i]);
            }
        }
        if(removed.length > 0){
            let games = [...this.state.games];
            for(let i=games.length - 1;i >=0;i--){
                if(games[i].game_type === removed[0]){
                    games.splice(i,1);
                }
            }
            this.setState({games : games})
        }
        
    }

    customValueRenderer = (selected, _options) => {
        return `Category ${selected.length}`;
    }
    addDefaultSrc = (ev, i)=>{
        ev.target.src = loader_image;
        document.getElementById('image-outer-div-' + i).classList.add('loader-img-div');
      }

    render(){
        return(
            <React.Fragment>
                <section className="gamesList">
                    <div className="row gamesListHeader">
                        <div className="col-md-6">
                            <h1 className="headerText">
                                {this.state.provider_name}
                            </h1>
                        </div>
                        <div className="col-md-6">
                            <MultiSelect valueRenderer={this.customValueRenderer} value={this.state.selectedCategory} labelledBy={'Category'} 
                            disableSearch={true} onChange={this.onChangeType} onClick={this.onChangeType} hasSelectAll={false} 
                            options={this.state.gameTypes.map(item=>{return({value: item, label: item})})}/>
                        </div>
                    </div>
                    <Row>
                        {this.state.games.length> 0 && this.state.games.map((item, i) => {
                            return(
                                <Col xl={3} lg={3} md={4} xs={12} sm={6} key={i} className={`col-spacing ${item.game_name === 'Hive Test Game' || item.game_name === '7 Lucky Dwarfs'? 'hide-hive': ''}`}>
                                    <Card onClick={()=> this.goToGameDetails(item)} key={i}>
                                        <div className="outer-div">
                                            <div className="inner-div">
                                                <div className="play-icon-div">
                                                <img alt="play-icon" src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/play-triangle.svg" className="play-icon"></img>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-img-wr" id={`image-outer-div-${i}`}>
                                            <Card.Img style={{ width: '100%'}} src={item.game_name === 'Humpty Dumpty'? ('https://d2qrsf0anqrpxl.cloudfront.net/assets/images/Humpty-Dumpty.png') : item.game_name === 'UltraPlay' ? "https://d2qrsf0anqrpxl.cloudfront.net/assets/images/ultraPlay.png" : item.game_icon} onError={(e)=> this.addDefaultSrc(e, i)} className={item.game_name} />
                                        </div>
                                        <Card.Body> 
                                            <Card.Subtitle className="text-overflow" as="h6">
                                                {item.game_name}
                                            </Card.Subtitle>
                                            <Card.Text className="text-overflow">
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                        {(this.state.games.length === 0 && !this.state.isLoading) && <div className="no-record">No Record Found</div>}
                    {this.state.isLoading ? 
                        <div className="game-loader"><div className="spinner-border"></div></div>
                    : null}
                    </Row>
                </section>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state, ) => {
    return { state };
};
export default connect(mapStateToProps)(GamesList);