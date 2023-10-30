import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3'
import PoloCard from "./PoloCard";
import {
    BrowserRouter as
        Route,
    Link
} from "react-router-dom"

class PoloMarket extends Component {
    constructor(props) {
        super(props);
        this.state = { shopPolos: [] }
    }

    componentDidMount() {
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function (res) {
                that.PoloShop()
            })
        } else {
            alert('You have to install MetaMask !')
        }
    }

    PoloShop() {
        let that = this
        MyWeb3.getShopPolo().then(function (ShopPolo) {
            if (ShopPolo.length>0){
                for(var i=0;i<ShopPolo.length;i++){
                    let poloid = ShopPolo[i].poloid;
                    console.log(poloid)
                    MyWeb3.GetPoloById(poloid).then(function(UserPolo){
                        let _shopPolos = that.state.shopPolos;
                        _shopPolos.push(UserPolo);
                        console.log(_shopPolos)
                        that.setState({ shopPolos: _shopPolos })
                    })
                }
               
            }
           
        })
    }


    render() {
        if (this.state.shopPolos.length > 0) {
            return (
                <div className="cards">
                {this.state.shopPolos.map(item => {
                    var name = item.name;
                    var level = item.level;
                    return (
                        <Link to={`/PoloDetail?id=${item.id}`} key={item.id}>
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

export default PoloMarket;