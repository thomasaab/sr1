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

  }
  clickInLoad = () => {
    document.getElementById("inputUpload").click();
    let UpdFile = document.getElementById("inputUpload");
    UpdFile.addEventListener('change',this.handleFileSelect, false);
  }
  
  handleFileChosen = (file) => {
    let fileReader = new FileReader();
    fileReader.onloadend = function (e){
      console.log("file",file);
     
      var content = fileReader.result;
      console.log("result",content)
      // let view = new Int8Array(content);
      // let contentString = '';
      // for(var i=0;i<view.length;i++){
      //   if(i==0){
      //     contentString = contentString.concat(view[i].toString())
      //   }else{
      //     contentString = contentString.concat(" " + view[i].toString())
      //   }   
      // }

      // console.log(view);

      // console.log("content",contentString)
      console.log("fileReader",fileReader)
      /* encrypt */
      var key = "my passphrase;"
      // var contentEncrypted = aes256.encrypt(key, contentString);
      var contentEncrypted = aes256.encrypt(key, content)
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
    fileReader.readAsBinaryString(file);
    //fileReader.readAsArrayBuffer(file);
    //codificar a base 64 
  }

   callFile = async () => {
    const response = await fetch('/api/getFile');
    const body = await response.blob();
    if (response.status !== 200) throw Error(body.message);
    let key = "my passphrase;"
    let fileReader = new FileReader();
 
    fileReader.onloadend = function (e){

      let content = aes256.decrypt(key,fileReader.result);
      console.log("contentdes", content);
      var fileDown =[];
      var filename = "pruba.pdf";
      fileDown[0]=content;
      fileDown[1]=filename;
      
      fetch('api/postForDownload', { // Your POST endpoint
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ "file": {
          "content" : content,
          "name" : filename
        }}) // This is your file object
        }).catch(function() {
          console.log("error in post data");
        });
     // download(content,filename,"js");
     
      function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    
      }

    }
    fileReader.readAsText(body);
  };

  download = (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

  handleFileSelect = (evt) => {
    if(evt.target.files.length>0){
      var files = evt.target.files; // FileList object

      // Loop through the FileList and render image files as thumbnails.
      // for (var i = 0;i<files.length; i++) {
      //   this.handleFileChosen(files[i])
      // }
      console.log("llamo")
      this.postContentFile(files);
      
    }
  }
  postContentFile = async (files) =>{
    let flagError=false;
    
      var formData = new FormData();
      //formData.set('files', files);
      console.log("entro", formData)
      formData.append('files', files[0]);
      fetch('api/postContentFile', { // Your POST endpoint
      method: 'POST',
      body: formData // This is your file object
      }).catch(function() {
        console.log("error in post data");
        flagError=true;
      });
    
    this.getContentFile(files,flagError);
  }

  getContentFile = async (files,flagError) =>{
    const response = await fetch('api/getContentFile?name='+files[0].name).catch(function() {
			console.log("error in get files");
			flagError=true;
			});
			if(!flagError){
			let json = await response.json();

				setTimeout(() => {
          var filename = files[0].name;
          console.log("json",json)

          var key = "my passphrase;"
          // var contentEncrypted = aes256.encrypt(key, contentString);
          var contentEncrypted = aes256.encrypt(key, json)
          var nameEncrypted = aes256.encrypt(key, filename);
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

				}, 500);
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

      <Button onClick={this.callFile} color="primary">call file</Button>{' '}
      </div>
    );
  }
}

export default App;
