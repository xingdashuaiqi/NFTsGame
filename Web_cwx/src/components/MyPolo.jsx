import React, { Component } from 'react';
import PoloCard from "./PoloCard";
import '../static/PoloPreview.css';
import MyWeb3 from '../MyWeb3';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

class MyPolo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            UserPoloCount: "2",
            UserPolo: [],
            PoloName: '',
            transactionHash: '',
            buyAreaDisp: true,
            createAreaDisp: true,
            txHashDisp: false,
            isDataLoaded: false // 初始化 isDataLoaded 状态属性
        };
        this.CreatePolo = this.CreatePolo.bind(this);
        this.buyPolo = this.buyPolo.bind(this);
    }

    componentDidMount() {
        let that = this;
        let ethereum = window.ethereum;
        if (typeof ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
            MyWeb3.init().then(function (res) {
                if (!that.state.isDataLoaded) {
                    that.GetPolo();
                }
            });
        } else {
            alert('You have to install MetaMask!');
        }
    }

    GetPolo() {
        let that = this;
        MyWeb3.GetPolo().then(function (UserPolo) {
            let id = 0;
            let _userPolo = that.state.UserPolo;
            if(UserPolo.length>0){
            for(let i =0;i<UserPolo.length;i++){
                if(UserPolo[i].id!=0){
                    _userPolo[id]=UserPolo[i];
                    id=id+1;
                }
            } 
            that.setState({ UserPolo:_userPolo, isDataLoaded: true,UserPoloCount:1 });
            console.log(UserPoloCount)
        }});
    }

    CreatePolo() {
        let that = this;
        let _name = this.state.PoloName;
        MyWeb3.CreatePolo(_name).then(function (transactionHash) {
            that.setState({
                transactionHash: transactionHash,
                createAreaDisp: false,
                txHashDisp: true
            });
        });
    }
    buyPolo() {
        let that = this
        let _name = this.state.PoloName
        MyWeb3.buyPolo(_name).then(function (transactionHash) {
            that.setState({
                transactionHash: transactionHash,
                buyAreaDisp: 0,
                txHashDisp: 1
            })
        })
    }
    render() {
        const { UserPolo, PoloName, buyAreaDisp, createAreaDisp, txHashDisp, transactionHash } = this.state;

        if (this.state.UserPoloCount == 1) {
            return (
                    <div className="cards">
                        {UserPolo.map(item => {
                            var name = item.name;
                            var level = item.level;
                            return (
                                <Link to={`/PoloDetail?id=${item.id}`} key={item.id}>
                                    <PoloCard Polo={item} name={name} level={level} key={item.id}></PoloCard>
                                </Link>
                            );
                        })}
                        <div className='buyArea' style={{ display: buyAreaDisp ? 'block' : 'none' }}>
                            <div className='poloInput'>
                            <input
                                type="text"
                                id='PoloName'
                                placeholder='给购买的魄罗起个好名字'
                                ref={(input) => { this.input = input }}
                                value={PoloName}
                                onChange={(event) => { this.setState({ PoloName: event.target.value }); }}>
                            </input>
                            </div>
                            <div>
                                <button className="attack-btn" onClick={this.buyPolo}>
                                    <span>
                                        购买魄罗
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className='transactionHash' style={{ display: txHashDisp ? 'block' : 'none' }}>
                            {transactionHash}
                            <br></br>
                            等待确认中...
                        </div>
                    </div>
                );
        } else {
            return (
                <div>
                    <div className='createArea' style={{ display: createAreaDisp ? 'block' : 'none' }}>
                        <div className='poloInput'>
                            <input
                                type="text"
                                id='PoloName'
                                placeholder='给将获取的魄罗起个好名字'
                                ref={(input) => { this.input = input }}
                                value={PoloName}
                                onChange={(event) => { this.setState({ PoloName: event.target.value }); }}>
                            </input>
                        </div>
                        <div>
                            <button className="attack-btn" onClick={this.CreatePolo}>
                                <span>
                                    免费领养魄罗
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className='transactionHash' style={{ display: txHashDisp ? 'block' : 'none' }}>
                        {transactionHash}
                        <br></br>
                        等待确认中...
                    </div>
                </div>
            );
        }
    }
}

export default MyPolo;
