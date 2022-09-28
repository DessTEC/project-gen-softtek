import React, { Component } from 'react';

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            valid: -1,
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
            case 'file':
                return(
                    <>
                    <div className='mt-4 ml-4 mr-4 mb-1'>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor={this.props.name}>
                            <div className={`block text-gray-700 text-sm mb-2 ${this.state.value.length > 0 && 'font-bold'}`}>
                                {this.props.label}
                            </div>
                        </label>
                        <input
                                type={this.props.type}
                                id={this.props.name}
                                className="w-full text-sm text-grey-500 bg-gray-50 rounded-lg border border-gray-300
                                file:mr-5 file:py-2 file:px-6
                                file:border-0
                                file:text-sm file:font-medium
                                file:bg-blue-50 file:text-blue-700
                                hover:file:cursor-pointer hover:file:bg-sky-900
                                hover:file:text-white"
                                onChange={this.props.handleFiles}
                                ref={this.props.innerRef}
                                accept={this.props.accept}
                                multiple=''
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">{this.props.acceptMessage}</p> 
                    </div>
                    {this.props.submitted && !this.props.valid &&
                        <p className="ml-4 text-red-500 text-xs italic whitespace-pre-wrap">* {this.props.errorText}</p>
                    }
                    </>
                );
            case 'looksLikeFile': 
                return(
                    <>
                        <label htmlFor={this.props.name} className='flex flex-row mt-4 ml-4 mr-4 mb-1' onClick={this.props.handleValue}>
                            <div className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline block">
                                <p>{this.props.value}</p>
                                <div className={`${this.props.value.length > 0 && 'font-bold'}`}>
                                    {this.props.label}
                                </div>
                            </div>
                            <div className='ml-4 inline-block font-bold py-2 px-4 rounded bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white border border-blue-500 hover:border-transparent'>
                                <p className='text-smaller'>{this.props.buttonLabel}</p>
                            </div>
                        </label>
                    </>
                );
            default:
                return(
                    <>
                    <div className="mt-4 ml-4 mr-4 mb-1">
                        <label className={`block text-gray-700 text-sm mb-2 ${this.state.value.length > 0 && 'font-bold'}`}>
                            {this.props.label}
                        </label>
                        <input className = {`${this.props.submitted && (this.props.valid ? 'border border-green-500' : 'border border-red-500')} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`} 
                        type={this.props.type} value={this.state.value} onChange={this.handleValue} ref={this.props.innerRef}/>
                    </div>
                    {this.props.submitted && !this.props.valid &&
                        <p className="ml-4 text-red-500 text-xs italic">* {this.props.errorText}</p>
                    }
                    </>
                );
        }
    }
}

export default React.forwardRef((props, ref) => <Input innerRef={ref} {...props} />);