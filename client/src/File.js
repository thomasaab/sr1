import React, { Component } from 'react';
import filePic from "./file.svg";
import { Container, Row, Col } from 'reactstrap';
import menuPic from "./menu.svg";

class File extends Component {
   
    
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
        </div>
      );
    }
  }
  
  export default File;
  