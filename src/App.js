import './App.scss';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import React, { useState } from 'react';
import WelcomePage from './containers/welcome/welcome';
import Sidebar from '../src/components/sidebar/sidebar';
import Header from '../src/components/header/header';
import { Container, Row, Col } from 'react-bootstrap';
import { Provider } from 'react-redux';
import configureStore from './configureStore.js';
import EarnPage from './containers/earn/earn';
import Deposit from './containers/deposit/deposit';
import GameDetail from './containers/game/gameDetail';
import GamesList from './containers/games-list/games-list';
import TransactionHistory from './containers/transaction-history/transaction-history';

import ScrollToTop from './containers/scrolltotop/ScrollToTop';
import GameExit from './containers/game/gameExit';
import Withdraw from './containers/withdraw/withdraw';
const initialState = {};
const store = configureStore(initialState, {});

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = sessionStorage.getItem('loginUser')
  let isUserlogin = user && JSON.parse(user).AccessToken;

  return (
    <Route
      {...rest}
      render={(props) =>
        isUserlogin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

function App(props) {
  const [sidebarExpanded, setSidebarToggle] = useState('');
  const [closingSibebar, setClosingSibebar] = useState(false);
  const toggleSidebar = (sidebarExpanded) => {
    setSidebarToggle(sidebarExpanded);
  };

  const closeSidebar = () => {
    setClosingSibebar(true);
    setTimeout(() => {
      toggleSidebar(window.innerWidth > 1024 ? true : false);
      setClosingSibebar(false);
    }, 500);
  };

  return (
    <div className="App">
      <Provider store={store}>
        <Container fluid>
          <Row>
            {window.location.pathname === '/login' ||
              window.location.pathname === '/signup' ||
              window.location.pathname === '/exit-game/' || (
                <Sidebar
                  sidebarExpanded={sidebarExpanded}
                  closingSibebar={closingSibebar}
                  onSidebarToggle={toggleSidebar}
                  onCloseSidebar={closeSidebar}
                />
              )}
            <Col id="header" className="page-container" sm={10}>
              {window.location.pathname === '/login' ||
                window.location.pathname === '/signup' ||
                window.location.pathname === '/exit-game/' || (
                  <Header
                    sidebarExpanded={sidebarExpanded}
                    closingSibebar={closingSibebar}
                    onSidebarToggle={toggleSidebar}
                    onCloseSidebar={closeSidebar}
                  />
                )}
              <div className="child-container new-child-container" id="child-cont">
                <ScrollToTop />
                <Switch>
                  <Route exact path="/" component={WelcomePage} />
                  <Route exact path="/earn" component={EarnPage} onSidebarToggle={toggleSidebar} />
                  <Route exact path="/game-detail/:gameId" component={GameDetail}/>
                  <Route exact path="/games-list/:providerId" component={GamesList}/>
                  <Route exact path="/exit-game/" component={GameExit}/>
                  <PrivateRoute exact path="/deposit/" component={Deposit}/>
                  <PrivateRoute exact path="/withdraw/" component={Withdraw}/>
                  <PrivateRoute exact path="/transaction-history/" component={TransactionHistory}/>
                  <Redirect to="/" />
                </Switch>
              </div>
            </Col>
          </Row>
        </Container>
      </Provider>
    </div>
  );
}

export default (withRouter(App));