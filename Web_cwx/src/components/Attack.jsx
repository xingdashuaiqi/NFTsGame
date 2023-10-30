import React, { Component } from 'react';
import MyWeb3 from '../MyWeb3'
import PoloPreview from "./PoloPreview"
import '../static/PoloPreview.css'
import moment from "moment"

class Attack extends Component {
    constructor(props) {
        super(props);
        const searchParams = new URLSearchParams(window.location.search)
        const id = searchParams.get('id')   
        this.state = {
            targetId:id,
            targetPolo:{},
            UserPolo:[],
            myPolo:{},
            poloiddd:[],
            mypoloid:'',
            active: {},
            buttonTxt:'',
            modalDisplay:'none',
            transactionHash:'',
            AttackBtn:()=>{
                return( <button className="attack-btn">
                            <span role="img" aria-label="polo">
                                选一只polo挑战他！
                            </span>
                        </button>
                )
            }
        }
        this.selectZombie = this.selectPolo.bind(this)
        this.PoloAttack = this.PoloAttack.bind(this)
    }
    componentDidMount(){
        let that = this
    
        let ethereum = window.ethereum
        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                console.log(that.state.targetId)
                that.GetPoloById(that.state.targetId)
                that.getPolo()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    
    GetPoloById(Poloid){
        let that = this
        MyWeb3.GetPoloById(Poloid).then(function (result) {
            that.setState({targetPolo:result})
           
          
        })
    }
    getPolo(){
        let that = this
        MyWeb3.GetPolo().then(function(UserPolo){
            let id = 0;
            let _userPolo = that.state.UserPolo;
            if(UserPolo.length > 0){
                for(let i =0;i<UserPolo.length;i++){
                    if(UserPolo[i].id!=0&&(UserPolo[i].readyTime=== 0 || moment().format('X')>UserPolo[i].readyTime)){
                        console.log(UserPolo[i].id)
                        _userPolo[id]=UserPolo[i];
                        that.state.poloiddd[UserPolo[i].id] = id;
                        id=id+1;
                    }
                    console.log(_userPolo)
                    console.log(that.state.targetId)
                    that.setState({UserPolo:_userPolo})
                }
            }
        })
    }
    selectPolo(id1){
        var _active = this.state.active
        var _id = this.state.poloiddd[id1]
        var prev_active = _active[_id]
        for(var i=0;i<this.state.UserPolo.length;i++){
            _active[i] = 0
        }
        console.log(this.state.UserPolo[_id].name)
        _active[_id] = prev_active === 0 || prev_active === undefined ? 1 : 0
        this.setState({
            active:_active,buttonTxt:'用'+this.state.UserPolo[_id].name,
            myPolo:this.state.UserPolo[_id],
            mypoloid:this.state.UserPolo[_id].id,
            AttackBtn:()=>{
                return( <button className="attack-btn" onClick={this.PoloAttack}>
                            <span role="img">
                                用{this.state.UserPolo[_id].name}干它！id为{this.state.UserPolo[_id].id}
                            </span>
                        </button>
                )
            }
        })
    }

    PoloAttack(){
        let that = this
            this.setState({modalDisplay:''})
            console.log(this.state.mypoloid,this.state.targetId)
            MyWeb3.attack(this.state.mypoloid,this.state.targetId)
            .then(function(transactionHash){
                that.setState({
                    transactionHash:transactionHash,
                    AttackBtn : () =>{
                    return(<div></div>)
                    }
                })
            })
        
    }
    render() { 
        let AttackBtn = this.state.AttackBtn
        if(this.state.UserPolo.length>0) {
            return ( 
                <div className="App polo-attack">
                <div
                    className="modal"
                    style={{
                        display:this.state.modalDisplay
                    }}
                >
                    <div className='battelArea'>
                        <div className='targetZombie'>
                            <PoloPreview Polo={this.state.targetPolo}></PoloPreview>
                        </div>
                        <div className='vs'>
                            VS
                        </div>
                        <div className='myZombie'>
                            <PoloPreview Polo={this.state.myPolo}></PoloPreview>
                        </div>
                    </div>
                    <div><h2>{this.state.transactionHash}</h2></div>
                </div>
                    <div  className="row polo-parts-bin-component" >
                        <div  className="game-card home-card target-card" >
                            <div className="polo-char">
                                <PoloPreview Polo={this.state.targetPolo}></PoloPreview>
                            </div>
                        </div>
                        <div className="polo-detail">
                            <div className="flex">
                                {this.state.UserPolo.map(item=>{
                                    var name = item.name
                                    var level = item.level
                                    return(
                                        <div className="game-card home-card selectable" key={item.id} active={this.state.active[item.id] || 0} onClick={() => this.selectPolo(item.id)} >
                                            <div className="polo-char">
                                            <PoloPreview Polo={item}></PoloPreview>
                                                <div className="polo-card card bg-shaded">
                                                    <div className="card-header bg-dark hide-overflow-text">
                                                        <strong>{name}</strong>
                                                    </div>
                                                    <small className="hide-overflow-text">CryptoZombie{level}级</small>
                                                </div>
                                            </div>
                                        </div>  
                                    )
                                })}
                            </div>
                            <AttackBtn></AttackBtn>
                        </div>
                    </div>
                </div>
            );
        }else{
            return(
                <div>没有能挑战他的魄罗</div>
            )
        }
    }
}
 
export default Attack;