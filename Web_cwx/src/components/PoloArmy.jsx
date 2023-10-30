import React, { Component } from 'react'
import { BrowserRouter as Routes, Route, Link } from 'react-router-dom';
import '../static/PoloPreview.css';
import MyWeb3 from "../MyWeb3"
import PoloCard from "./PoloCard";
class PoloArmy extends Component {
    constructor(props) {
        super(props);
        this.state = { polo: [] }
    }

    componentDidMount() {
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function (res) {
                that.AllPolo()
            })
        } else {
            alert('You have to install MetaMask !')
        }
    }
    AllPolo() {
        let that = this
        MyWeb3.GetAllPolo().then(function (result) {
                  that.setState({ polo: result })
            
        })
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }
    render() {
        if (this.state.polo.length > 0) {
            return (
                <div className="cards">
                     {this.state.polo.map(item => {
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

export default PoloArmy;