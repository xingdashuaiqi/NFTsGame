import React, { Component } from 'react'
import PoloPreview from "./PoloPreview"
import '../static/PoloPreview.css';
import MyWeb3 from '../MyWeb3';
import moment from "moment"

import {
    BrowserRouter as
        Route,
    Link
} from "react-router-dom"

class PoloDetail extends Component {
    constructor(props) {
        super(props)
        const searchParams = new URLSearchParams(window.location.search)

        const id = searchParams.get('id')
        this.state = {
            id: id,
            Polo: {},
            owner: '',
            PoloFeedTimes: 0,
            myPrice: 0,
            minPrice: 0,
            AttackBtn: () => { return (<div></div>) },
            RenameArea: () => { return (<div></div>) },
            PoloNewname: '',
            FeedArea: () => { return (<div></div>) },
            LevelupArea: () => { return (<div></div>) },
            SaleArea: () => { return (<div></div>) },
            BuyArea: () => { return (<div></div>) },
            onShop: false,
            shopInfo: {},
            bo: 0
        }
        this.PoloChangeName = this.PoloChangeName.bind(this)
        this.changeName = this.changeName.bind(this)
        this.feed = this.feed.bind(this)
        this.levelUp = this.levelUp.bind(this)
        this.salePolo = this.salePolo.bind(this)
        this.buyShopPolo = this.buyShopPolo.bind(this)
        this.setPrice = this.setPrice.bind(this)
    }

    componentDidMount() {
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function (res) {
                that.GetPoloById(that.state.id)
                that.getMinPrice()
                that.getPoloShop(that.state.id)
            })
        } else {
            alert('You have to install MetaMask !')
        }
    }
    getPoloShop(poloid) {
        let that = this
        MyWeb3.PoloShop(poloid).then(function (shopInfo) {
            if (shopInfo.price > 0) {
                that.setState({ onShop: true, shopInfo: shopInfo })
            }
        })
    }
    getMinPrice() {
        let that = this
        MyWeb3.minPrice().then(function (minPrice) {
            if (minPrice > 0) {
                that.setState({ myPrice: parseFloat(minPrice), minPrice: parseFloat(minPrice) })
            }
        })
    }
    setPrice(event) {
        this.setState({
            myPrice: event.target.value
        })
    }
    PoloChangeName(event) {
        this.setState({
            PoloNewname: event.target.value
        })
    }
    changeName() {
        let that = this
        if (window.defaultAccount !== undefined) {
            MyWeb3.changeName(this.state.id, this.state.PoloNewname)
                .then(function (transactionHash) {
                    that.setState({
                        RenameArea: () => {
                            return (<div>{transactionHash}</div>)
                        }
                    })
                })
        }
    }
    feed() {
        let that = this
        if (window.defaultAccount !== undefined) {
            MyWeb3.feed(this.state.id)
                .then(function (transactionHash) {
                    that.setState({
                        FeedArea: () => {
                            return (<div>{transactionHash}</div>)
                        }
                    })
                })
        }
    }
    levelUp() {
        let that = this
        if (window.defaultAccount !== undefined) {
            MyWeb3.levelUp(this.state.id)
                .then(function (transactionHash) {
                    that.setState({
                        LevelupArea: () => {
                            return (<div>{transactionHash}</div>)
                        }
                    })
                })
        }
    }
    salePolo() {
        let that = this
        if (window.defaultAccount !== undefined
            && this.state.myPrice * this.state.minPrice > 0
            && this.state.myPrice >= this.state.minPrice) {
            console.log(this.state.id, this.state.myPrice, this.state.minPrice)
            MyWeb3.saleMyPolo(this.state.id, this.state.myPrice)
                .then((transactionHash) => {
                    this.setState({
                        SaleArea: () => {
                            return <div>{transactionHash}</div>;
                        }
                    })
                })
        }
    }
    buyShopPolo() {
        let that = this
        if (window.defaultAccount !== undefined) {
            MyWeb3.buyShopPolo(this.state.id, this.state.shopInfo.price)
                .then(function (transactionHash) {
                    that.setState({
                        BuyArea: () => {
                            return (<div>{transactionHash}</div>)
                        }
                    })
                })
        }
    }
    GetPoloById(Poloid) {
        let that = this
        MyWeb3.GetPoloById(Poloid).then(function (result) {
            that.setState({ Polo: result,bo:1  })
            that.setState({ PoloNewname: result.name })
            MyWeb3.UsePoloAddress(Poloid).then(function (result) {
                let ownerAddress = result.toLowerCase();
                that.setState({ owner: result})
                let defaultAddress = window.defaultAccount.toLowerCase();
                if (ownerAddress !== defaultAddress) {
                    that.setState({
                        AttackBtn: () => {
                            return (
                                <button className="attack-btn">
                                    <span>
                                        <Link to={`/Attack?id=${that.state.id}`} >发起挑战</Link>
                                    </span>
                                </button>)
                        }
                    })
                    if (that.state.onShop) {
                        that.setState({
                            BuyArea: () => {
                                return (
                                    <div>
                                        <div className='PoloInput'>
                                            售价：{that.state.shopInfo.price} ether
                                        </div>
                                        <div>
                                            <button className="pay-btn pay-btn-last" onClick={that.buyShopPolo}>
                                                <span>
                                                    买下它
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                } else {
                    that.setState({ AttackBtn: () => { return (<div></div>) } })
                    if (that.state.Polo.level > 1) {
                        that.setState({
                            RenameArea: () => {
                                return (
                                    <div>
                                        <div className='PoloInput'>
                                            <input
                                                type="text"
                                                id='PoloName'
                                                placeholder={that.state.Polo.name}
                                                value={that.state.PoloNewname}
                                                onChange={that.PoloChangeName}>
                                            </input>
                                        </div>
                                        <div>
                                            <button className="pay-btn pay-btn-last" onClick={that.changeName}>
                                                <span>
                                                    改个名字
                                                </span>
                                            </button>
                                        </div>
                                    </div>)
                            }
                        })
                    }
                    if (parseInt(that.state.Polo.feedTime) === 0) {
                        that.setState({
                            FeedArea: () => {
                                return (
                                    <div>
                                        <button className="pay-btn" onClick={that.feed}>
                                            <span>
                                                喂食一次
                                            </span>
                                        </button>
                                    </div>)
                            }
                        })
                    }
                    that.setState({
                        LevelupArea: () => {
                            return (
                                <div>
                                    <button className="pay-btn" onClick={that.levelUp}>
                                        <span>
                                            付费升级
                                        </span>
                                    </button>
                                </div>)
                        }
                    })
                    if (!that.state.onShop) {
                        that.setState({
                            SaleArea: () => {
                                return (
                                    <div>
                                        <div className='PoloInput'>
                                            <input
                                                type="text"
                                                id='salePrice'
                                                placeholder={that.state.minPrice}
                                                value={that.state.myPrice}
                                                onChange={that.setPrice}>
                                            </input>
                                        </div>
                                        <div>
                                            <button className="pay-btn pay-btn-last" onClick={that.salePolo}>
                                                <span>
                                                    卖了它
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                }
            })
        })
    }

    render() {
        var readyTime = '已冷却'

        if (this.state.Polo.readyTime !== undefined && moment().format('X') < this.state.Polo.readyTime) {
            readyTime = moment(parseInt(this.state.Polo.readyTime) * 1000).format('YYYY-MM-DD')
        }
        var AttackBtn = this.state.AttackBtn
        var RenameArea = this.state.RenameArea
        var FeedArea = this.state.FeedArea
        var LevelupArea = this.state.LevelupArea
        var SaleArea = this.state.SaleArea
        var BuyArea = this.state.BuyArea
        console.log("FeedArea:", this.state.FeedArea);
        console.log(FeedArea);
        return (
            <div className="App">
                <div className="row polo-parts-bin-component" authenticated="true" lesson="1" lessonidx="1">
                    <div className="newcard" id="newcard">
                        <div className="polo-char">
                            <div className="polo-loading polo-parts" style={{ display: "none" }}></div>
                            <PoloPreview Polo={this.state.Polo} bo={this.state.bo}></PoloPreview>
                            <div className="hide">
                                <div className="card-header bg-dark hide-overflow-text">
                                    <strong ></strong></div>
                                <small className="hide-overflow-text">CryptoPolo第一级</small>
                            </div>
                        </div>
                    </div>
                    <div className="polo-detail">
                        <dl>
                            <dt>{this.state.Polo.name}</dt>
                            <dt>TOKENID</dt>
                            <dd>{this.state.Polo.id}</dd>
                            <dt>等级</dt>
                            <dd>{this.state.Polo.level}</dd>
                            <dt>胜利次数</dt>
                            <dd>{this.state.Polo.winCount}</dd>
                            <dt>失败次数</dt>
                            <dd>{this.state.Polo.lossCount}</dd>
                            <dt>进攻冷却时间</dt>
                            <dd>{readyTime}</dd>
                            <dt>喂食冷却时间</dt>
                            <dd>{this.state.Polo.feedTime}</dd>
                            <dt>喂食次数</dt>
                            <dd>{this.state.Polo.feedCount}</dd>
                            <dt></dt>
                            <dd>
                                <AttackBtn></AttackBtn>
                                <RenameArea></RenameArea>
                                <FeedArea></FeedArea>
                                <LevelupArea></LevelupArea>
                                <SaleArea></SaleArea>
                                <BuyArea></BuyArea>
                            </dd>
                        </dl>
                    </div>
                    </div>
                    </div> 
        );
    }
}

export default PoloDetail;