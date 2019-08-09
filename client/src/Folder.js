import React, { Component } from 'react';
import folderPic from "./folder.svg";
import menuPic from "./menu.svg";
import { Row, Button, Modal, ModalHeader, ModalBody, ModalFooter , FormGroup, Label, Input  } from 'reactstrap';
  
class Folder extends Component {
  state={
    modalEdit:false
  }

  clickCard= () => {
    this.props.changeHere(this.props.children);
  }
  clickDelete = () => {
    this.props.deleteElement(this.props.valueFile,true)
  }
  clickCopy = () => {
    var aux = this.props.children;
    this.props.copyElement(aux)
  }
  clickEdit= () => {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit
    }));
  }

  editName = () => {
   var newName=document.getElementById("editName").value;
   this.props.editName(this.props.valueFile, newName)
   this.clickEdit();
  }

  render() {
      return (
        <div className=" element" >
          <Row>
            <img className="menuPic"  src={menuPic} width="25px" alt="Folder"></img>
          </Row>
          <div className="clickeable" onClick={this.clickCard}>
            <Row>
              <img className="folderIcon" src={folderPic} width="80px" alt="Folder"></img>
            </Row>
            <Row>
              <p className="textElement" width="60px">{this.props.labelFile}</p>
            </Row>
          </div>
          <button onClick={this.clickDelete}> DELETE </button>
          <button onClick={this.clickCopy}> COPY </button>
          <button onClick={this.clickEdit}> EDIT </button>

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
  
  export default Folder;
  