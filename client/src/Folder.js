import React, { Component } from 'react';
import folderPic from "./folder.svg";
import menuPic from "./menu.svg";
import { Container, Row, Col } from 'reactstrap';

class Folder extends Component {
   
  clickCard= () => {
    this.props.changeHere(this.props.children);
  }
  render() {
      return (
        <div className=" element" onClick={this.clickCard}>
          <Row>
            <img className="menuPic"  src={menuPic} width="25px" alt="Folder"></img>
            <div class="dropdown-menu ddm1">	
              <label for="toggle">Menu</label>
              <ul>
                <li><a href="#" title="Do something">Do something</a></li>
                <li><a href="#" title="Do something else">Do something else</a></li>
                <li><a href="#" title="Options">Options</a></li>
              </ul>
            </div>
          </Row>
          <div className="clickeable">
            <Row>
              <img className="folderIcon" src={folderPic} width="80px" alt="Folder"></img>
            </Row>
            <Row>
              <p className="textElement" width="60px">{this.props.labelFile}</p>
            </Row>
          </div>
        </div>
      );
    }
  }
  
  export default Folder;
  