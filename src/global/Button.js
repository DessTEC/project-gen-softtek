import React, { Component } from 'react';

class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }

        this.handleValue = this.handleValue.bind(this);
    }

    handleValue(e) {
        let value = e.target.value;
        this.setState({value});
        if(this.props.handleValue)
            this.props.handleValue(value);
    }

    render(){
        return(
            <button 
                type={this.props.type ? this.props.type : 'button'}
                className={`m-4 inline-block font-bold py-2 px-4 rounded ${this.props.variant === 'primary' ? 'bg-blue-500 hover:bg-blue-700 text-white ' : 'bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white border border-blue-500 hover:border-transparent'}`}
                disabled={this.props.disabled}
                onClick={this.props.onClick}
            >
                <p><b>{this.props.label}</b></p>
            </button>
        );
    }
}

export default Button;