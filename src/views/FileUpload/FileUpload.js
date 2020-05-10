import React, { Component } from 'react';

class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    onChangeHandler(event) {
        alert(event.target.files[0]);
    }

    render() {
        return (
            <input type="file" name="file" onChange={this.onChangeHandler}/>
        );
    }
}

export default FileUpload;