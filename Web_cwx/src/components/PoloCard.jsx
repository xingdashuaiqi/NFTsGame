import React, { Component } from 'react';
import PoloPreview from "./PoloPreview"

class PoloCard extends Component {
    constructor(props) {
        super(props)
        this.state = { Polo:this.props.Polo,name:this.props.name,level:this.props.level}
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                Polo: this.props.Polo,
                name: this.props.name,
                level: this.props.level
            });
        }
    }
    render() { 
        return ( 
            <div className="game-card home-card selectable">
                <div className="polo-char">
                <PoloPreview Polo={this.state.Polo}></PoloPreview>
                    <div className="polo-card card bg-shaded">
                        <div className="card-header bg-dark hide-overflow-text">
                            <strong>{this.state.name}</strong>
                        </div>
                        <small className="hide-overflow-text">CryptoPolo{this.state.level}级</small>
                    </div>
                </div>
            </div>            
        )
    }
}
 
export default PoloCard;