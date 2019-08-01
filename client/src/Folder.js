import React, { Component } from 'react';
import folderPic from "./folder.svg";
import { Container, Row, Col } from 'reactstrap';

class Folder extends Component {
   
  clickCard= () => {
    this.props.changeHere(this.props.children);
  }
  render() {
      return (
        <div className="clickeable element" onClick={this.clickCard}>
            <Row>
                <img className="folderIcon" src={folderPic} width="80px" alt="Folder"></img>
            </Row>
            <Row>
                <p className="textElement" width="60px">{this.props.labelFile}</p>
            </Row>
        </div>
      );
    }
  }
  
  export default Folder;
  