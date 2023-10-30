import React, { Component, Fragment } from 'react';
import '../static/App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MyPolo from "./MyPolo";
import PoloDetail from "./PoloDetail"
import PoloMarket from "./PoloMarket";
import PoloArmy from './PoloArmy';
import Attack from './Attack';
import PoloPower from './PoloPower';
import MySVG from '../static/5555.SVG';
import * as d3 from 'd3';
import PoloSimulator from "./PoloSimulator";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        let ethereum = window.ethereum;
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            ethereum.on('accountsChanged', function (accounts) {
                console.log("accountsChanged:" + accounts);
                //window.location.reload()
            });
            ethereum.on('chainChanged', function (chainId) {
                console.log("chainChanged:" + chainId);
                //window.location.reload()
            });
            ethereum.on('chainChanged', function (networkVersion) {
                console.log("chainChanged:" + networkVersion);
                //window.location.reload()
            });
        } else {
            alert('You have to install MetaMask !');
        }
    }
    render() {
       
        return (
            <Fragment>
                <Router>
                    <section className="polos-hero no-webp block app-block-intro pt-5 pb-0">            
                        <div className="container">
                            <div className="menu">
                                <ul>
                                    <li>
                                        <button className="start-course-btn">
                                            <span><Link to="/PoloArmy">魄罗图鉴</Link></span>
                                        </button>
                                    </li>
                                    <li>
                                        <button className="start-course-btn">
                                            <span><Link to="/MyPolo">我的魄罗</Link></span>
                                        </button>
                                    </li>
                                    <li>
                                        <button className="start-course-btn">
                                            <span><Link to="/PoloMarket">魄罗市场</Link></span>
                                        </button>
                                    </li>
                                    <li>
                                        <button className="start-course-btn">
                                            <span><Link to="/PoloPower">魄罗diy</Link></span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    <section className="polo-container block bg-walls no-webp">
                        <div className="container">
                            <div className="area">
                                <Routes>
                                    <Route path="/MyPolo" element={<MyPolo />} />
                                    <Route path="/PoloDetail" element={<PoloDetail />} />
                                    <Route path="/PoloMarket" element={<PoloMarket />} />
                                    <Route path="/PoloArmy" element={<PoloArmy />} />
                                    <Route path="/PoloSimulator" element={<PoloSimulator />} />
                                    <Route path="/PoloPower" element={<PoloPower />} />
                                    <Route path="/Attack" element={<Attack />} />
                                </Routes>

                            </div>
                        </div>
                    </section>
                </Router>
            </Fragment>
        );
    }
}

export default App;
