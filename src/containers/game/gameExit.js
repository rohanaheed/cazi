
import React, { Component } from 'react';

export default class GameExit extends Component{
    componentDidMount(){
        const location = window.location;
        const homePageUrl = `${location.origin}/`
        window.top.location = homePageUrl;
    }

    render() {
        return (
            <React.Fragment>
                Redirecting...........
            </React.Fragment>
        )
    }
}