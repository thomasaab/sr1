import React, { Component } from 'react';
import filePic from "./file.svg";
import { Container, Row, Col } from 'reactstrap';

class File extends Component {
   
    
  render() {
      return (
        <div className="clickeable element" >
            <Row>
                <img className="fileIcon" src={filePic} width="80px" alt="File"></img>
            </Row>
            <Row >
              <p className="textElement" width="60px">{this.props.labelFile}</p>
            </Row>
           
        </div>
      );
    }
  }
  
  export default File;
  