import React, { Component } from 'react'
import '../static/PoloPreview.css';
import PoloPreview from "./PoloPreview";
import MyWeb3 from '../MyWeb3';
import moment from "moment"
import MySVG from '../static/3-5.SVG';
// import  ZombieToggler  from "./ZombieToggler";
import {
    BrowserRouter as
        Route,
    Link
} from "react-router-dom"
class PoloSimulator extends Component {
    constructor(props) {
        super(props)
        const searchParams = new URLSearchParams(window.location.search)
        const id = searchParams.get('id')
        this.state = {
            id: id,
            Polo: {},
            bo: 2,
            svgContent: '',
            modifiedSVG: '',
            FeedArea: () => {
            },

        }
        this.levelUp = this.levelUp.bind(this)
        this.loadSVGContent = this.loadSVGContent.bind(this);
    }
    componentDidMount() {
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function (res) {
                that.GetPoloById(that.state.id)
            })
        } else {
            alert('You have to install MetaMask !')
        }
    }
    GetPoloById(Poloid) {
        let that = this
        MyWeb3.GetPoloById(Poloid).then(function (result) {
            that.setState({ Polo: result })
            if (that.state.Polo.level = 5) {
                that.setState({
                    FeedArea: () => {
                        return (
                            <button className="pay-btn" style={{ marginTop: '-40px' }} onClick={that.levelUp}>
                                <span>
                                    矢量化
                                </span>
                            </button>
                        )
                    },
                })
            }
            that.setState({ Polo: result })
        })
    }
    levelUp() {
        let that = this
        if (window.defaultAccount !== undefined) {
            MyWeb3.levelUp(this.state.id)
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
        const colors = ["#010101", "#52557f", "#868693", "#f8f5f6", "#483245", "#423d6e", "#ebe3b8", "#ccc7dc", "#968fcf"];

        // 查找所有矩形元素
        const path = modifiedSVG.match(/<path[^>]*>/g);

        // 遍历每个矩形，并为其设置随机颜色
        if (path) {
            for (let i = 0; i < path.length; i++) {
                const randomColorIndex = Math.floor(Math.random() * colors.length);
                const color = colors[randomColorIndex];
                modifiedSVG = modifiedSVG.replace(path[i], path[i].replace(/fill="[^"]*"/, `fill="${color}"`));
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
        var FeedArea = this.state.FeedArea
        return (<div className="App" style={{ paddingLeft: '240px' }}>
            <div className="row polo-parts-bin-component polo-simulator" authenticated="true" lesson="1" lessonidx="1">
                <div className="polo-preview" id="polo-preview">
                    <div className="polo-char">
                        <PoloPreview Polo={this.state.Polo} bo={this.state.bo}></PoloPreview>
                        <FeedArea></FeedArea>
                        <button className="pay-btn" style={{ marginTop: '10px' }} onClick={this.loadSVGContent}>
                            <span>
                                矢量模拟
                            </span>
                        </button>
                        <div style={{
                            width: '220px',
                            height: '493px',
                            position: 'relative', // 设置相对定位
                            overflow: 'hidden',
                            top: '-830px',
                            left: '65px',
                            clip: 'rect(0px, 269px, 200px, 0px)', // 指定裁剪区域的坐标（上，右，下，左）
                        }}>
                            <img src={this.state.base64} alt="" style={{
                                width: '100%', // 图像宽度设置为100%，以适应裁剪框
                                position: 'absolute',
                                top: '157px', // 图像位置设置为顶部
                                left: '-3px', // 图像位置设置为左侧
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}



export default PoloSimulator
