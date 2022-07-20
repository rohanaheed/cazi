import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './footer.scss';
import { Row, Col } from 'react-bootstrap';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NavLink } from 'react-router-dom';

export default class Footer extends Component {

  render() {
      const gamesProvider = {
        'games': [
          {'title': '1X2 Network', 'link': '1X2 Network'},
          {'title': 'Leander', 'link': 'Leander'},
          {'title': 'Lotus Gaming', link: 'Lotus Gaming'},
          {'title': 'No Limit City', link: 'No Limit City'},
          {'title': 'One Touch', link: 'One Touch'}
        ]
      }
      const infos = ['General Terms and Conditions','Reward Terms and Conditions','Self-Exclusion Terms and Conditions','Affiliate Terms & Conditions','Privacy Policy','Responsible Gambling'];
      const aboutsData = {
          "abouts":[
            {"title": "Swap Pool", "link": "https://cazicazi.gitbook.io/cazi-cazi/basics/swap-pool"},
            {"title": "Gaming Platform", "link": "https://cazicazi.gitbook.io/cazi-cazi/basics/untitled"},
            {"title": "House Pool", "link": "https://cazicazi.gitbook.io/cazi-cazi/basics/house-pool"},
            {"title": "Tokenomics", "link": "https://cazicazi.gitbook.io/cazi-cazi/basics/tokenomics"},
            {"title": "Smart Contracts", "link": "https://cazicazi.gitbook.io/cazi-cazi/basics/smart-contracts"},
            {"title": "Roadmap", "link": "https://cazicazi.gitbook.io/cazi-cazi/extra-information/untitled"},
            {"title": "Market", "link": "https://cazicazi.gitbook.io/cazi-cazi/extra-information/untitled-1"},
            {"title": "FAQ", "link": "https://cazicazi.gitbook.io/cazi-cazi/help/faq"},
            {"title": "Tutorial", "link": "https://cazicazi.gitbook.io/cazi-cazi/help/tutorial"},
          ]
        }

      return (
          <div className="footer">
            <div className="footer-section">
              <Row className="upper-most-div m-0">
                <Col lg={4} xl={4} sm={12}>
                  <div>
                    <h5 className="footer-header">About cazicazi.com</h5>
                    <p className="left-desc">CAZI CAZI is decentralized virtual entertainment land. It is a fair gaming platform with many advanced features. The platform supports the CAZI token which is based on smart contract and ensures an intuitive & healthy gaming environment for users.
                      CAZI token holders can leverage features like profit-sharing services or reward-generating services.
                    </p>
                  </div>
                </Col>
                <Col lg={7} xl={7} sm={12} className="accordian">
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header" className="game-panel">
                      <Typography className="footer-header m-0">Games</Typography>
                    </AccordionSummary>
                      {gamesProvider.games && gamesProvider.games.map((game, i) => {
                          return (
                            <div key={i}><NavLink to={`/games-list/${game.link}`} className="links">{game.title}</NavLink></div>
                          )
                        })
                      }
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header">
                      <Typography className="footer-header m-0">About</Typography>
                    </AccordionSummary>
                      {aboutsData.abouts && aboutsData.abouts.map((abouts, i) => {
                          return (
                            <div key={i}><a className="links">{abouts.title}</a></div>
                          )
                        })
                      }
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header">
                      <Typography className="footer-header m-0">Info</Typography>
                    </AccordionSummary>
                      {infos && infos.map((info, i) => {
                          return (
                            <div key={i}><a className="links">{info}</a></div>
                          )
                        })
                      }
                  </Accordion>
                </Col>
                <Col lg={2} xl={2} sm={3} className="listing">
                  <div>
                    <h5 className="footer-header">Games</h5>
                    {gamesProvider.games && gamesProvider.games.map((game, i) => {
                        return (
                          <div key={i}><NavLink to={`/games-list/${game.link}`} className="links">{game.title}</NavLink></div>
                        )
                      })
                    }
                  </div>
                </Col>
                <Col lg={2} xl={2} sm={3} className="listing">
                  <div>
                    <h5 className="footer-header">About</h5>
                    {aboutsData.abouts && aboutsData.abouts.map((abouts, i) => {
                        return (
                          <div key={i}><a className="links" href={abouts.link}>{abouts.title}</a></div>
                        )
                      })
                    }
                  </div>
                </Col>
                <Col lg={2} xl={2} sm={3} className="listing">
                  <div>
                    <h5 className="footer-header">Info</h5>
                    {infos && infos.map((info, i) => {
                        return (
                          <div key={i}><a className="links">{info}</a></div>
                        )
                      })
                    }
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        );
    }
}