import React, { Component } from 'react';
import filePic from "./file.svg";
import { Row, Button, Modal, ModalHeader, ModalBody, ModalFooter , FormGroup, Label, Input  } from 'reactstrap';
import menuPic from "./menu.svg";

class File extends Component {
  state={
    modalEdit:false
  }
  clickCard= () => {
    this.props.changeHere(this.props.children);
  }
  clickDelete = () => {
    this.props.deleteElement(this.props.valueFile,false)
  }
  clickCopy = () => {
    var aux = this.props.children;
    console.log("PRUEBAAA CHILDREEN",this.props.children)
    this.props.copyElement(aux)
  }
  clickEdit= () => {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

  clickDownload = () => {
  
    this.props.callFile(this.props.valueFile,this.props.labelFile)
  }

  editName = () => {
    var newName=document.getElementById("editName").value;
    this.props.editName(this.props.valueFile, newName)
    this.clickEdit();
   }
  render() {
      return (
        <div className="element" >
          <Row>
            <img className="menuPic"  src={menuPic} width="25px" alt="Folder"></img>
          </Row>
          <div className="clickeable">
            <Row>
              <img className="fileIcon" src={filePic} width="80px" alt="File"></img>
            </Row>
            <Row >
              <p className="textElement" width="60px">{this.props.labelFile}</p>
            </Row>
          </div>
          <button onClick={this.clickDelete}> DELETE </button>
          <button onClick={this.clickCopy}> COPY </button>
          <button onClick={this.clickEdit}> EDIT </button>
          <button onClick={this.clickDownload}> DOWNLOAD </button>
       {/* modal edit name */}
       <Modal isOpen={this.state.modalEdit} toggle={this.clickEdit}>
          <ModalHeader toggle={this.clickEdit}>Edit Name</ModalHeader>
          <ModalBody>
          <FormGroup>
            <Label for="newFolder">New Name for {this.props.labelFile}:</Label>
            <Input type="text" name="editName" id="editName" placeholder="New name"/>
          </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.editName}>Edit</Button>{' '}
            <Button color="secondary" onClick={this.clickEdit}>Cancel</Button>
          </ModalFooter>
        </Modal>
        </div>
      );
    }
  }
  
  export default File;
  