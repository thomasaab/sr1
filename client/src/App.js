import React, { Component } from 'react';
import { Button } from 'reactstrap';

import logo from './logo.svg';
import './App.css';
let aes256 = require('aes256');

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  clickInLoad = () => {
    document.getElementById("inputUpload").click();
    let UpdFile = document.getElementById("inputUpload");
    UpdFile.addEventListener('change',this.handleFileSelect, false);
  }
  
  handleFileChosen = (file) => {
    let fileReader = new FileReader();
    fileReader.onloadend = function (e){
      var content = fileReader.result;

      /* encrypt */
      var key = "my passphrase;"
      var contentEncrypted = aes256.encrypt(key, content);
      var nameEncrypted = aes256.encrypt(key, file.name);
      //nameEncrypted = nameEncrypted.toString().replace(":", "\/");
      //
      /* create file encrypt */
      var fileEncrypted = new File([contentEncrypted], nameEncrypted);
      console.log("fileEncrypted",fileEncrypted);
      var formData = new FormData();
      //formData.set('files', files);
      formData.append('files', fileEncrypted);
      fetch('api/file', { // Your POST endpoint
        method: 'POST',
        body: formData // This is your file object
      })
      .catch(function() {
        console.log("error in post data");
      });
    }
    fileReader.readAsText(file);
  }

  handleFileSelect = (evt) => {
    if(evt.target.files.length>0){
      var files = evt.target.files; // FileList object

      // Loop through the FileList and render image files as thumbnails.
      for (var i = 0;i<files.length; i++) {
        this.handleFileChosen(files[i])
      }
    }
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  };
  
render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>

      {/* file */}
      <Button onClick={this.clickInLoad} color="primary">primary</Button>{' '}
      <input type="file" id="inputUpload" name="files[]" multiple/> 
      </div>
    );
  }
}

export default App;
