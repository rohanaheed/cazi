import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import './banner.scss';
class Banner extends Component {
    constructor(props) {
        super(props);
        this.state={
            showMenuSection:false,
            cardTitle: "Decentralized Virtual Pleasure Land",
            cardDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
            btn1Text: "Sign up",
            btn2Text: "Read More",
            bgImage: null
        }
    }

    onChange = (key, value) => {
        this.setState({
           [key]: value,
        });
    };

    imageUploader = (event) => {
        if(event.target.files[0]){
        this.setState({
            bgImage: URL.createObjectURL(event.target.files[0])
        })}
    }
    openMenu(){
        this.setState({
        showMenuSection:true
      })
    }
    render() {
        return (
               <Card className="bg-dark text-white home-banner" style={{backgroundImage: this.state.bgImage ? `url(${this.state.bgImage})` : `url(https://d2qrsf0anqrpxl.cloudfront.net/assets/images/main_small.jpg)`}}>
                 <Card.Img alt="banner-image" className="res-img" src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/main_small.jpg"/>
                 <Card.ImgOverlay className="banner-image-overlay">
                    <Card.Title id="banner-card-title" className="banner-title" as="h1" > { this.state.cardTitle } </Card.Title>
                    <div className="home-banner-badges">
                      <div className="home-banner-badge">
                        <div className="banner-icon">
                            <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/banner-play-icon.svg" alt="banner-play-icon"/>
                        </div>
                      <div className="right-content">
                        <h6>Play</h6>
                        <p>Play more than 1,000 titles of the top global games. Players get great returns as high as 98%.</p>
                      </div>
                    </div>
                    <div className="home-banner-badge"> 
                        <div className="banner-icon">
                            <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/banner-farm-icon.svg" alt="banner-farm-icon" />
                        </div>
                       <div className="right-content">
                          <h6>Farm</h6>
                          <p>Provide liquidity on the platform to earn free CAZI. Enjoy passive income with high APY.</p>
                       </div>
                   </div>
                   <div className="home-banner-badge">
                        <div className="banner-icon">
                            <img src="https://d2qrsf0anqrpxl.cloudfront.net/assets/images/banner-house-icon.svg" alt="banner-house-icon" />
                        </div>
                       <div className="right-content">
                           <h6>House</h6>
                           <p>Stake CAZI to be one of the owners of the platform. Earn revenue share of games every day!</p>
                       </div>
                    </div>
                  </div>
                        {/* <Card.Text className="card-btns"> */}
                          {/* <Button onClick={() => this.props.history.push('/signup')} variant="primary">{this.state.btn1Text}</Button> */}
                          {/* <a variant="outline-light" className="btn readMoreButton" href="https://cazicazi.gitbook.io/cazi-cazi/" target="_blank">{this.state.btn2Text}</a>{' '} */}
                        {/* </Card.Text> */}
                 </Card.ImgOverlay>
               </Card>
           );
       }
}

export default withRouter(Banner);
