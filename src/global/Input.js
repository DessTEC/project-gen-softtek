import React, { Component } from 'react';

class Input extends Component {
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
        switch (this.props.type) {
            case 'color':
                return(
                    <>
                        <p className='non-bold'>{this.props.label} <input type={this.props.type} value={this.state.value} onChange={this.handleValue} ref={this.props.innerRef}/></p>
                    </>
                );
            case 'file':
                return(
                    <div className={`${this.props.className && this.props.className} ${this.props.size && this.props.size} `}>
                        <input type={this.props.type} className='input' value={this.state.value} onChange={this.handleValue} ref={this.props.innerRef} directory='' webkitdirectory='' multiple='' />
                        <div className={`non-bold ${this.state.value.length > 0 && 'focused'}`}>
                            {this.props.label}
                        </div>
                    </div>
                );
            default:
                return(
                    <div className={`input-wrapper ${this.props.className && this.props.className} ${this.props.size ? this.props.size : 'block'} `}>
                        <input type={this.props.type} className='input' value={this.state.value} onChange={this.handleValue} ref={this.props.innerRef}/>
                        <div className={`input-placeholder non-bold ${this.state.value.length > 0 && 'focused'}`}>
                            {this.props.label}
                        </div>
                    </div>
                );
        }
    }
}

export default React.forwardRef((props, ref) => <Input innerRef={ref} {...props} />);