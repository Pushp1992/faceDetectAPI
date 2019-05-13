import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Container } from 'reactstrap';

//Custom Component
import FaceRecognition from './Component/FaceDetect/faceDetect';
import image from '../src/img/face-detection-recognition.png';
import './App.css';


Container.propTypes = {
  fluid: PropTypes.bool
}
Row.propTypes = {
  noGutters: PropTypes.bool
}


class App extends Component {
  render() {
    return (
      <React.Fragment>

        <div className="App">
          <header className="App-header">
            <img src={image} alt="bannerImage" style={{ width: 250, height: 60 }} />
            FACE DETECTION
          </header>
        </div>
        <div>
          <FaceRecognition />
        </div>

      </React.Fragment>
    );
  }
}

export default App;
