import React, { Component } from 'react'
import { BrowserRouter as Routes, Route, Link } from 'react-router-dom';
import '../static/PoloPreview.css';
import MyWeb3 from "../MyWeb3"
import PoloCard from "./PoloCard";
class PoloPower extends Component {
    constructor(props) {
        super(props);
        this.state = { polo: [] }
    }

    componentDidMount() {
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function (res) {
                that.UserPowerPolo()
            })
        } else {
            alert('You have to install MetaMask !')
        }
    }
    UserPowerPolo() {
        let that = this;
        MyWeb3.GetPolo().then(function (UserPolo) {
            let id = 0;
            let _userPolo = that.state.polo;
            if(UserPolo.length>0){
            for(let i =0;i<UserPolo.length;i++){
                console.log(11111111111111)
                if(UserPolo[i].id!=0&&UserPolo[i].level>4){
                    _userPolo[id]=UserPolo[i];
                    id=id+1;
                }
            } 
            that.setState({ polo:_userPolo});
        }});
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }
    render() {
        if (this.state.polo.length >= 0) {
            return (
                <div className="cards">
                     {this.state.polo.map(item => {
                            var name = item.name;
                            var level = item.level;
                            return (
                                <Link to={`/PoloSimulator?id=${item.id}`} key={item.id}>
                                    <PoloCard Polo={item} name={name} level={level} key={item.id}></PoloCard>
                                </Link>
                            );
                        })}
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}

export default PoloPower;