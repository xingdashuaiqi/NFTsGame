import React, { Component, Fragment } from 'react';
import '../static/App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MyPolo from "./MyPolo";
import PoloDetail from "./PoloDetail"
import PoloMarket from "./PoloMarket";
import PoloArmy from './PoloArmy';
import Attack from './Attack';
import MySVG from '../static/1-5.SVG';
import * as d3 from 'd3';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aaa: "123534",
            svgContent: '',
            modifiedSVG: '',
        };
        this.loadSVGContent = this.loadSVGContent.bind(this);
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
    loadSVGContent = () => {
        // 替换 'your-svg-file-path.svg' 为你的SVG文件路径
        fetch(MySVG)
            .then((response) => response.text())
            .then((data) => {
                this.setState({ svgContent: data }, () => {
                    this.modifySVGContent(); // 在SVG内容加载后执行修改
                });
            })
            .catch((error) => console.error('Error loading SVG:', error));
    }

    modifySVGContent = () => {
        let modifiedSVG = this.state.svgContent;

        // 定义颜色数组
        const colors = ["#010101", "#52557f", "#868693","#f8f5f6","#483245","#423d6e","#ebe3b8","#ccc7dc","#968fcf"];

        // 查找所有矩形元素
        const path = modifiedSVG.match(/<path[^>]*>/g);

        // 遍历每个矩形，并为其设置随机颜色
        if (path) {
            for (let i = 0; i < path.length; i++) {
                const randomColorIndex = Math.floor(Math.random() * colors.length);
                const color = colors[randomColorIndex];
                modifiedSVG = modifiedSVG.replace(path[i], path[i].replace(/fill="[^"]*"/, `fill="${color}"`));
                modifiedSVG = modifiedSVG.replace(/123456/g, this.state.aaa);
            }
        }

        this.setState({ svgContent: modifiedSVG });
        // 创建一个临时的HTML元素
        const tempElement = document.createElement('div');

        // 将 modifiedSVG 内容添加到临时元素
        const decodedSVG = decodeURIComponent(modifiedSVG); // 反转URL编码
        tempElement.innerHTML = decodedSVG;
        // 获取SVG元素
        const svgElement = tempElement.querySelector('svg');
        if (svgElement) {
            // 如果找到了SVG元素，将其内容编码为base64
            const base64SVG = btoa(new XMLSerializer().serializeToString(svgElement));
            this.setState({ base64: `data:image/svg+xml;base64,${base64SVG}` });
        } else {
            console.error('未找到SVG元素');
        }

    }

    render() {
       
        return (
            <Fragment>
                <Router>
                    <section className="polos-hero no-webp block app-block-intro pt-5 pb-0">
                        <div>
                            <img src={this.state.base64} alt="Modified SVG" />
                        </div>
            

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
                                            <span><Link to="/PoloSimulator">魄罗diy</Link></span>
                                        </button>
                                    </li>
                                    <li>
                                        <button className="start-course-btn" onClick={this.loadSVGContent}>
                                            <span>显示</span>
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
