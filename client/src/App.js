import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter , Form, FormGroup, Label, Input, FormText  } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import update, { extend } from 'immutability-helper';
import './App.css';
import CheckboxTree from 'react-checkbox-tree';
import File from "./File"
import Folder from "./Folder"
import beforeIcon from "./beforeIcon.svg";
import download from 'js-file-download';

let aes256 = require('aes256');
let arrFile = []
class App extends Component {
  state = {
    childrens: [],
    aux:"aux",
    modalNewFolder: false,
    listOfChildren:[],
    key: "my passphrase;",
    here: {},
    nameEncrypted:"",
    portaPapel:{},
    contentF:"",
    nameF:"",
    nodes :[{
      value: 'mars',
      label: 'Home',
      children: [
        { 
        value: 'phobos', 
        label: 'Phobos1' 
        },
        { 
         value: 'deimos', 
         label: 'Deimos' ,
         children: [
          { 
          value: 'phobos2', 
          label: 'Phobos2' 
          },
          { 
           value: 'deim', 
           label: 'Deim' ,
           children: [
            { 
            value: 'phobos3', 
            label: 'Phobos3' 
            },
            { 
            value: 'phobos4', 
            label: 'Phobos4' 
            },
            { 
             value: 'deimo', 
             label: 'Deimos3',
             children: []
             
            }
          ]
           
          }
        ]
        }
      ]
    }]
  };
  componentWillMount() {
    console.log("this.state.nodes[0]")
    this.setState({here:this.state.nodes[0]});
  }

  componentDidMount() {
    this.callJSON()
    // console.log(JSON.stringify(this.state.nodes[0]))
    // fetch('api/prueba', { // Your POST endpoint
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify(this.state.nodes)
    //   })
    //   .then((response) => response.json())
    //   .then((data) => {console.log(data)})
    //   .catch(function() {
    //     console.log("error in post data");
    //   });
    
   
  }

 sendJson = () => {
  fetch('api/createFolder', { // Your POST endpoint
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(this.state.nodes)
    })
    .then((response) => response.json())
    .then((data) => {console.log(data)})
    .catch(function() {
      console.log("error in post data");
    });

 }

 search = (path, obj, target) => {
    for (var k in obj) {
      //console.log("k",k)
        if (obj.hasOwnProperty(k))//si esta el atributo k en el objeto
            if (obj[k] === target)
                return path + "," + k 
            else if (typeof obj[k] === "object") {
                var result = this.search(path + "," + k , obj[k], target);
                if (result)
                    return result;
            }
    }
    return false;
}

  clickInLoad = () => {
    document.getElementById("inputUpload").click();
    let UpdFile = document.getElementById("inputUpload");
    UpdFile.addEventListener('change',this.handleFileSelect, false);
  }

  callFile = async (value,label) => {
    const response = await fetch('/api/getFile/'+value);
    const body = await response.blob();
    if (response.status !== 200){
      console.log("ERRORRR")
      alert("Por favor intente de nuevo")
    }
    let key = "my passphrase;"
    let fileReader = new FileReader();
    let content;
    let filename=label;
    fileReader.onloadend =  async function  (e){

       content = aes256.decrypt(key,fileReader.result);
      console.log("contentdes", content);
      var fileDown =[];
      
      fileDown[0]=content;
      fileDown[1]=filename;

        await fetch('api/postForDownload', { // Your POST endpoint
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ "file": {
          "content" : content,
          "name" : filename
        }}) // This is your file object
        }).then(response =>{
          //console.log(response.blob)
          //download("hola",'hola.txt')
         
        })
        .catch(function() {
          console.log("error in post data");
        });
     // download(content,filename,"js");
        
    }
    fileReader.readAsText(body);
    this.setState({contentF:content})
    this.setState({nameF:filename})
    console.log(filename)
    this.downloadFile(filename);
  };


  downloadFile  = async (filename) => {

    window.open('http://localhost:5000/download/'+filename)
  }
  
  handleFileSelect = (evt) => {
    if(evt.target.files.length>0){
      var files = evt.target.files; // FileList object
      console.log("llamo")
      this.postContentFile(files);
      
    }
  }
  postContentFile = async (files) =>{
    let flagError=false;
    
      var formData = new FormData();
      //formData.set('files', files);
      
      formData.append('files', files[0]);
      console.log("entro", formData)
      await fetch('api/postContentFile', { // Your POST endpoint
      method: 'POST',
      body: formData // This is your file object
      }).catch(function() {
        console.log("error in post data");
        flagError=true;
      });
    
    this.getContentFile(files,flagError);
  }

  getContentFile = async (files,flagError) =>{
    this.setState({nameF:files[0].name})
    console.log("name hereee",this.state.nameF)
    let response;
    arrFile[0] = files[0].name;
    sessionStorage.setItem('a', files[0].name);
     response = await fetch('api/getContentFile?name='+files[0].name).catch(function() {
			console.log("error in get files");
			flagError=true;
      });
      if(response.status == 500){
        console.log("ERROR 500000000")
        alert("SERVER ERROR 500, porfavor ELIMINE el archivo e intente de nuevo o recarge la pestaNa")
        flagError=true;
      }else{
        if(!flagError){
          console.log("respuesta",response)
        let json = await response.json();
  
       
           setTimeout(async () => {
            var filename = files[0].name;
            console.log("json",json)
            this.setState({nameF:filename});
            var key = "my passphrase;"
            // var contentEncrypted = aes256.encrypt(key, contentString);
            var contentEncrypted = aes256.encrypt(key, json)
            var nameEncrypted = aes256.encrypt(key, filename);
            this.setState({nameEncrypted:nameEncrypted})
  
            //nameEncrypted = nameEncrypted.toString().replace(":", "\/");
            //
            /* create file encrypt */
            await fetch('api/file1/', { // Your POST endpoint
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ "file": {
                "content" : contentEncrypted,
                "name" : nameEncrypted
              }})  // This is your file object
            }).catch(function() {
              console.log("error in post data");
              flagError=true;
            });
            
          }, 600);
        }
      }
			
  }

  selected = (clicked) => {
    if(clicked.isParent){
      this.setState({childrens:clicked.children});
      var objHere = {}
      for (var i =0; i<clicked.parent.children.length; i++){
        if (clicked.parent.children[i].value === clicked.value){ //find parent element
          objHere=clicked.parent.children[i].value;
        }
      }
      this.setState({here:objHere});
    }else{
      console.log("hoja")
    }
  }

  clickInNewFolder= () => {
    this.setState(prevState => ({
      modalNewFolder: !prevState.modalNewFolder
    }));
  }

  createFolder= () => {
    var newName = document.getElementById("newFolder").value;
    this.setState(prevState => ({
      modalNewFolder: !prevState.modalNewFolder
    }));
    var path = "nodes";
    path = this.search(path, this.state.nodes, this.state.here);
    let newObj = {
      value: aes256.encrypt(this.state.key, newName),
      label: newName,
      children: []
    }
    let flagFolderHome = false;
    console.log("path",path)
    console.log("newobj", newObj)
    path = path.replace("['value']","");
    path = path.replace("nodes,0,","");
    if(path.includes('nodes,0')){
      flagFolderHome=true;
    }
    console.log("path2",path)
    var auxSubPaths= path.split(',')
    console.log("auxSubPaths",auxSubPaths)
    var subPaths = ""
    var x=0;
     for(var i=0; i<auxSubPaths.length;i++){
      if(/^\d+$/.test(auxSubPaths[i+1])){
        if(i===0){
          subPaths=auxSubPaths[i]+"["+auxSubPaths[i+1]+"]"
        }else{
          subPaths=subPaths+"."+auxSubPaths[i]+"["+auxSubPaths[i+1]+"]"
        }      
        i++;
        x++;
      } //if string is num
     }

      var data = this.state.nodes[0];
      console.log("subpth", subPaths)
      if(flagFolderHome){
        eval("data.children[data.children.length]= newObj")
      }else{
        eval("data."+subPaths+".children[data."+subPaths+".children.length]= newObj")
      }
      //this.setState({nodes:data})

      setTimeout( 
        function() {
        this.saveJson()
        }
        .bind(this),
        3000
      ); 

  }

  changeHere= (children) => {
    console.log("childrenhere", children)
   this.setState({here:children})
  }

  clickInBefore = () => {
    var path = "nodes";
    path = this.search(path, this.state.nodes, this.state.here);
    let flagHome=false;
    console.log("path",path)
    let flagFolderHome = false;
    path = path.replace("['value']","");
    path = path.replace("nodes,0,","");
    if(path.includes('nodes,0')){
      flagFolderHome=true;
    }
    console.log("path2",path)
    path = path.replace("nodes,","");
    var auxSubPaths= path.split(',')
    
    var subPaths = ""
    var x=0;
     for(var i=0; i<auxSubPaths.length;i++){
      if(/^\d+$/.test(auxSubPaths[i+1])){
        if(i===0){
          subPaths=auxSubPaths[i]+"["+auxSubPaths[i+1]+"]"
        }else{
          subPaths=subPaths+"."+auxSubPaths[i]+"["+auxSubPaths[i+1]+"]"
        }      //var newName = document.getElementById("newFolder").value;
        i++;
        x++;
      } //if string is num
     }
     console.log("NODESSS",this.state.nodes[0])
     console.log("SubPaths",subPaths)
     var arr = subPaths.split(".");
     subPaths=""
     console.log("arrr",arr)
     if(flagFolderHome){
      flagHome=true;
      alert("Estas en el home")
     }else{
      for(var i = 0; i<arr.length-1; i++){
        if (i===0){
          console.log("PASEEEE")
          subPaths = subPaths.concat(arr[i])
        }else{
          subPaths = subPaths.concat("."+arr[i])
        }
      } console.log("SUBPATHSSSSSSS",subPaths)
      if(arr.length==1){
       
        eval("this.setState({here:this.state.nodes[0]})")
      }else{
        eval("this.setState({here:this.state.nodes[0]."+subPaths+"})")
      }
      
     }
     console.log("SubPaths2",subPaths)
     
  }

  saveJson= async (children) => {
    let msj=aes256.encrypt(this.state.key, JSON.stringify(this.state.nodes))
    console.log("msj",msj)

          await fetch('api/file1/', { // Your POST endpoint
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ "file": {
              "content" : msj,
              "name" : "kYS1cBJ6oqukp0KTeDScD7XHvh5WJF36nDk="
            }})  // This is your file object
          }).catch(function() {
            console.log("error in post data");
            alert("recargue la pagina por favor")
          });
   }

   listChildren = (childrenHere) =>{
    console.log("child", childrenHere)
    var arr =[];
    if(childrenHere.children!== undefined){
      for(var i=0; i<childrenHere.children.length;i++){
        if(childrenHere.children[i].children!== "undefined"){ //is folder
          console.log("isfolder")
          this.listChildren(childrenHere.children[i])
        }else{
          console.log(childrenHere.children[i].value)
        }
      }
    }else{
      console.log(childrenHere.value)
    }
    return arr
   }

   deleteElement = (valueFile,isFolder) => {
     let childrenHere=this.state.here.children;
     let children;
     if(isFolder){
      this.setState({listOfChildren:[]})
      for(var i=0;i<childrenHere.length;i++){
        if(childrenHere[i].value===valueFile){
          children=i;
        }
      }
      var arrToDelete = this.listChildren(childrenHere[children])
      console.log("arrToDelete",arrToDelete)
     }else{

     }

   } 

paste = () => {
  console.log("paste")

    var path = "nodes";
    path = this.search(path, this.state.nodes, this.state.here);
    let flagFolderHome = false;
    console.log("path",path)
    path = path.replace("['value']","");
    path = path.replace("nodes,0,","");
    if(path.includes('nodes,0')){
      flagFolderHome=true;
    }
    console.log("path2",path)
    var auxSubPaths= path.split(',')
    console.log("auxSubPaths",auxSubPaths)
    var subPaths = ""
    var x=0;
     for(var i=0; i<auxSubPaths.length;i++){
      if(/^\d+$/.test(auxSubPaths[i+1])){
        if(i===0){
          subPaths=auxSubPaths[i]+"["+auxSubPaths[i+1]+"]"
        }else{
          subPaths=subPaths+"."+auxSubPaths[i]+"["+auxSubPaths[i+1]+"]"
        }      
        i++;
        x++;
      } //if string is num
     }

      var data = this.state.nodes[0];
      console.log("subpth", subPaths)
      if(flagFolderHome){
        eval("data.children[data.children.length]= this.state.portaPapel")
      }else{
        eval("data."+subPaths+".children[data."+subPaths+".children.length]= this.state.portaPapel")
      }
}

copyElement = (element) => {
console.log("HOLA VALE",element)
//element.value="copied";
  this.setState({portaPapel:element})
}

editName = (valueFile,newName) => {
  var childrens = this.state.here.children;
  var numChildren=0;
  for(var i=0;i<childrens.length;i++){
    if(childrens[i].value===valueFile){
      numChildren=i;
    }
  }
  console.log("numChildren",numChildren)
  console.log("newname",newName)
  var path = "nodes";
  path = this.search(path, this.state.nodes, this.state.here);
  let flagFolderHome = false;
  console.log("path",path)
  path = path.replace("['value']","");
  path = path.replace("nodes,0,","");
  if(path.includes('nodes,0')){
    flagFolderHome=true;
  }
  console.log("path2",path)
  var auxSubPaths= path.split(',')
  console.log("auxSubPaths",auxSubPaths)
  var subPaths = ""
  var x=0;
  for(var i=0; i<auxSubPaths.length;i++){
    if(/^\d+$/.test(auxSubPaths[i+1])){
      if(i===0){
        subPaths=auxSubPaths[i]+"["+auxSubPaths[i+1]+"]"
      }else{
        subPaths=subPaths+"."+auxSubPaths[i]+"["+auxSubPaths[i+1]+"]"
      }      
      i++;
      x++;
    } //if string is num
  }

  var data = this.state.nodes[0];
  console.log("subpth", subPaths)
  if(flagFolderHome){
    eval("data.children[numChildren].label= newName")
  }else{
    eval("data."+subPaths+".children[numChildren].label= newName")
  }
  this.clickInNewFolder()
  this.clickInNewFolder()

  setTimeout( 
    function() {
    this.saveJson()
    }
    .bind(this),
    3000
  ); 
}

uploadFile = async () => {
  await this.clickInLoad();
  setTimeout( 
      function() {
      var path = "nodes";
      path = this.search(path, this.state.nodes, this.state.here);
      var nameEncrypted =  this.state.nameEncrypted;
      var nameF=  this.state.nameF;
      console.log("NAMEEE",this.state.nameF)
      let newObj = {
        value: nameEncrypted,
        label: nameF
      }
      let flagFolderHome = false;
      console.log("path",path)
      console.log("newobj", newObj)
      path = path.replace("['value']","");
      path = path.replace("nodes,0,","");
      if(path.includes('nodes,0')){
        flagFolderHome=true;
      }
      console.log("path2",path)
      var auxSubPaths= path.split(',')
      console.log("auxSubPaths",auxSubPaths)
      var subPaths = ""
      var x=0;
       for(var i=0; i<auxSubPaths.length;i++){
        if(/^\d+$/.test(auxSubPaths[i+1])){
          if(i===0){
            subPaths=auxSubPaths[i]+"["+auxSubPaths[i+1]+"]"
          }else{
            subPaths=subPaths+"."+auxSubPaths[i]+"["+auxSubPaths[i+1]+"]"
          }      
          i++;
          x++;
        } //if string is num
       }
  
        var data = this.state.nodes[0];
        console.log("subpth", subPaths)
        if(flagFolderHome){
          eval("data.children[data.children.length]= newObj")
        }else{
          eval("data."+subPaths+".children[data."+subPaths+".children.length]= newObj")
        }
        this.clickInNewFolder()
        this.clickInNewFolder()
        //this.setState({nodes:data})
        setTimeout( 
          function() {
          this.saveJson()
          }
          .bind(this),
          3000
        ); 
    }
    .bind(this),
    5000
); 
}

callJSON = async () => {

  const response = await fetch('/api/getFile/kYS1cBJ6oqukp0KTeDScD7XHvh5WJF36nDk=');
  const body = await response.blob();
  if (response.status !== 200){
    console.log("ERRORRR")
    alert("Por favor intente de nuevo")
  }
  let key = "my passphrase;"
  let fileReader = new FileReader();
  let content;
  fileReader.onloadend =  async function  (e){

    content = aes256.decrypt(key,fileReader.result);
    console.log("contentdes", JSON.parse(content));
    console.log("nodes",this.state.nodes)
    var fileDown =[];
    this.setState({nodes:JSON.parse(content)})
    console.log("nodes",this.state.nodes)
    fileDown[0]=content;
    this.setState({here:this.state.nodes[0]});
    this.clickInNewFolder()
    this.clickInNewFolder()

   // download(content,filename,"js");
      
  }.bind(this)
  fileReader.readAsText(body);

}  
render() {
  const childrenFolder = [];
  const childrenFile = [];
  var flagEmpty = false;

  console.log("here",this.state.here)
    let auxChildren=this.state.here.children;
    for (var i = 0; i < auxChildren.length; i += 1) {
      
      if(typeof auxChildren[i].children !== "undefined") {  // ES PADRE (Carpeta)

        childrenFolder.push(<Col key={i} className="nodeCard " sm="8" md="3"><Folder  number={i}  
          children={auxChildren[i]}labelFile={auxChildren[i].label} 
          valueFile={auxChildren[i].value} changeHere={this.changeHere}
          deleteElement={this.deleteElement} copyElement={this.copyElement}
          editName={this.editName} /></Col>);
        
        flagEmpty = true;
      }else{//Es un file

        childrenFile.push(<Col key={i} className="nodeCard " sm="8" md="3"><File  number={i}
         labelFile={auxChildren[i].label} valueFile={auxChildren[i].value}
         deleteElement={this.deleteElement} copyElement={this.copyElement}
         editName={this.editName} callFile = {this.callFile} /></Col>);
        flagEmpty = true;
      }
        
    };
    if(!flagEmpty){
      childrenFolder.push(<h2 key="empty">
        Folder Empty
      </h2>)
    }
    childrenFolder.push(childrenFile);

    return (
      <Container className="App">
        <img src={beforeIcon} width="40px" alt="Folder" className="clickeable " onClick={this.clickInBefore}></img>
        <Row>
          <Button color="primary" onClick={this.clickInNewFolder}>Create Folder</Button>
          <Button color="primary" onClick={this.saveJson}>save</Button>
          <Button color="primary" onClick={this.callJSON}>callJSON</Button>
          <Button color="primary" onClick={this.paste}>Paste</Button>
          <Button color="primary" onClick={this.uploadFile}>Upload file</Button>
        </Row>
        <br></br>
        <br></br>

        <Row> 
          {/* <Col xs="4">
            <CheckboxTree
              nodes={this.state.nodes}
              checked={this.state.checked}
              expanded={this.state.expanded}
              onCheck={checked => this.setState({ checked })}
              onExpand={expanded => this.setState({ expanded })}
              onClick={clicked => this.selected(clicked)}
            />
          </Col> */}
          <Col xs="8">
            <Row>
            {childrenFolder}
            </Row>
          </Col>
        </Row>

        {/* modal new folder */}
        <Modal isOpen={this.state.modalNewFolder} toggle={this.clickInNewFolder}>
          <ModalHeader toggle={this.clickInNewFolder}>Create Folder</ModalHeader>
          <ModalBody>
          <FormGroup>
            <Label for="newFolder">Name of folder:</Label>
            <Input type="text" name="newFolder" id="newFolder" placeholder="New name"/>
          </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.createFolder}>Create</Button>{' '}
            <Button color="secondary" onClick={this.clickInNewFolder}>Cancel</Button>
          </ModalFooter>
        </Modal>
        
 


        {/* file */}

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <Button onClick={this.clickInLoad} color="primary">primary</Button>{' '}
        <input type="file" id="inputUpload" name="files[]" multiple/> 

        <Button onClick={this.callFile} color="primary">call file</Button>{' '}
        <Button onClick={this.downloadFile} color="primary">dw</Button>{' '}

      </Container>
    );
  }
}

export default App;
