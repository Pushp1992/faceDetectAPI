import React, { Component } from 'react';
import { Container, Row, Col, Input, Button, Spinner, Card, CardText, CardHeader, CardBody, Collapse } from 'reactstrap';
import PropTypes from 'prop-types';
// Service
import cognitiveService from '../FaceDetect/service';


Container.propTypes = {
    fluid: PropTypes.bool
}
Row.propTypes = {
    noGutters: PropTypes.bool
}

class FaceRecognition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            imageData: '',
            myurl: '',
            loader: false,
            collapse: false,
            processesedData: [],

            faceAttributes: {},
            blur: {},
            exposure: {},
            emotion: {},
            facialHair: {},
            hair: '',
            makeup: {},
            accessories: [],
            faceRectangle: {},

            // Single value for faceAttributes
            emotionType: '',
            bald: '',
            hairColor: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.callFaceAPI = this.callFaceAPI.bind(this);
    }
    toggle = (event) => {
        event.preventDefault();

        this.setState({ collapse: !this.state.collapse })
    }

    handleInputChange(event) {
        event.preventDefault();

        if (!event.currentTarget.files || !event.currentTarget.files.length) {
            return false;
        }

        const { name, value } = event.currentTarget;
        this.setState({ [name]: value },
            () => {
                console.log("Handle change", this.state.imageUrl);
            });

        var files = event.currentTarget.files[0];

        /** Mapping actual image from fakepath to the UI */
        let actualURL = URL.createObjectURL(files);
        this.setState({ myurl: actualURL });

        var reader = new FileReader();
        reader.onload = () => {

            /** converting image to binary data */
            this.setState({ imageData: reader.result });
        };
        reader.readAsArrayBuffer(files);
    }

    callFaceAPI(event) {
        event.preventDefault();
        let self = this;
        self.setState({ loader: true })

        let makeFaceAPICall = cognitiveService.faceAPIService(self.state.imageData);
        makeFaceAPICall.then((response) => {

            self.setState({ loader: false })
            if (response.data.length !== 0) {
                self.setState({ processesedData: response.data[0] })
            } else {
                window.alert('Hey ! Make sure, you have uploaded Human Image ?')
                return false;
            }

            self.filteredData();
        }, function (error) {
            // this.setState({ loader: false })
            console.error("API error response\n : ", error)
        })
    }

    filteredData = () => {
        this.setState({ faceAttributes: this.state.processesedData.faceAttributes })
        this.setState({ blur: this.state.faceAttributes.blur })
        this.setState({ exposure: this.state.faceAttributes.exposure })
        this.setState({ emotion: this.state.faceAttributes.emotion })
        this.setState({ facialHair: this.state.faceAttributes.facialHair })
        this.setState({ hair: this.state.faceAttributes.hair })
        this.setState({ makeup: this.state.faceAttributes.makeup })

        /**
         * Getting EMOTION_TYPE
         */
        const emotionArray = Object.values(this.state.emotion)
        let emotionMaxConfidence = Math.max.apply(null, emotionArray)
        // Getting emotionType from object based on max_value
        const actualEmotion = Object.keys(this.state.emotion)[Object.values(this.state.emotion).indexOf(emotionMaxConfidence)]
        this.setState({ emotionType: actualEmotion })

        /**
         * Getting HAIR_COLOR
         */

        // Getting Array of HairColor (Array of Objects)
        let hairColorArray = this.state.hair.hairColor

        // creating colorConfidence array from hairColorArray
        let colorConfidenceArray = hairColorArray.map(({ confidence }) => confidence)

        // Fetching max value from colorConfidenceArray
        let maxConfidence = Math.max.apply(null, colorConfidenceArray)

        // Fetching actual objectArray from Array of object based on a particular key
        let finalHairColorArray = hairColorArray.filter((hairObject) => {
            return hairObject.confidence === maxConfidence
        })

        // Getting actual hairColor from finalHairColorArray
        let personHairColor = finalHairColorArray[0].color

        // setting state
        this.setState({ hairColor: personHairColor })

        console.log(this.state.hairColor);



        console.log(this.state.faceAttributes);
    }

    render() {
        return (
            <Container fluid={true}>
                <br />

                <form onSubmit={this.callFaceAPI}>
                    <Row noGutters={true}>
                        <Col xs="3" md={{ offset: 3 }}>
                            <Input type="file" name="imageUrl" value={this.state.imageUrl} onChange={this.handleInputChange} accept="image/*" />
                        </Col>
                        <Col xs="3" md={{ offset: 1 }}>
                            <Button outline color="success" type="submit">Recognise Face</Button>
                            {
                                (this.state.loader === true) ? <Spinner color="danger" style={{ width: '3rem', height: '3rem' }} type="grow" /> : null
                            }
                        </Col>
                    </Row>
                </form>
                <br />

                <Row noGutters={true}>
                    <Col md={{ size: 4, offset: 3 }}>
                        <div>
                            {
                                (this.state.imageData) ?
                                    <img src={this.state.myurl} alt="pic" style={{ width: 400, height: 400 }} />
                                    : <div> <span>No Image selected</span> <br /> <i className="fa fa-frown-o fa-3x" aria-hidden="true" style={{ color: 'green', marginLeft: '40px' }}></i> </div>
                            }
                        </div>
                    </Col>
                    <Col md={{ size: 4 }}>
                        {
                            (this.state.loader === true) ? "Recognising your Face . . ." : null
                        }
                        {
                            (this.state.processesedData.length !== 0) ?
                                <React.Fragment>
                                    <div>
                                        <Card body outline color="primary">

                                            <CardHeader>
                                                <Card body outline color="warning">
                                                    <CardText>
                                                        Image of <b>{this.state.faceAttributes.age}</b> year {''}
                                                        {
                                                            (this.state.faceAttributes.gender === 'male') ?
                                                                ((this.state.faceAttributes.age < 19) ? <b>'BOY'</b> : ((this.state.faceAttributes.age > 19 && this.state.faceAttributes.age < 60) ? <b>'MAN'</b> : <b>'Old Man'</b>))
                                                                : ((this.state.faceAttributes.age < 19) ? <b>'GIRL' </b> : ((this.state.faceAttributes.age > 19 && this.state.faceAttributes.age < 60) ? <b>'Lady' </b> : <b>'Old WOMan'</b>))
                                                        }
                                                        {''} with {''} <b>{this.state.emotionType.toUpperCase()} </b> facial reaction.
                                                   </CardText>
                                                </Card>
                                            </CardHeader>

                                            <CardBody>
                                                <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }}>More Details >>></Button>

                                                {/** Hidden Card */}

                                                <Collapse isOpen={this.state.collapse}>
                                                    <Row noGutters={true}>
                                                        <Col>
                                                            <Card body outline color="success">
                                                                <CardText>
                                                                    <div>Wearing <b>{this.state.faceAttributes.glasses}</b></div> <br/>
                                                                    <div>
                                                                        {
                                                                            (this.state.faceAttributes.gender === 'male') ?
                                                                                (
                                                                                    <div>
                                                                                        <b>Face Attributes</b> <br />
                                                                                        <span>Has Moustache: {''} {this.state.facialHair.moustache < 0.1 ? 'NO' : (this.state.facialHair.moustache <= 0.5 ? 'Somewhat' : 'Yes')} </span> <br />
                                                                                        <span>Has Beard: {''} {this.state.facialHair.beard < 0.1 ? 'NO' : (this.state.facialHair.beard <= 0.5 ? 'Somewhat' : 'Yes')} </span>
                                                                                    </div>
                                                                                ) : null
                                                                        }
                                                                    </div> <br/>
                                                                    <div>
                                                                        <b>Image Characteristic</b> <br />
                                                                        <span>BlurLevel: {''} {this.state.blur.blurLevel} </span> <br />
                                                                        <span>ExposureLevel: {''} {this.state.exposure.exposureLevel} </span>
                                                                    </div>
                                                                </CardText>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                    <Row>
                                                        <Col>
                                                            <Card body outline color="danger">
                                                                <CardText>
                                                                    <div>
                                                                        <b>Hair</b> <br />
                                                                        <span>
                                                                            {
                                                                                (this.state.hair.bald > 0.7) ? 'Person is Bald' :
                                                                                    ((this.state.hair.bald >= 0.5) ? 'Person has less hair or he is somehwat Bald' : 'Person has Hair')
                                                                            }
                                                                        </span> <br />
                                                                        <span hidden={this.state.hair.bald > 0.7 ? true : false}>Hair Color: {this.state.hairColor} </span>
                                                                    </div>
                                                                    <div>
                                                                        <b>Makeup</b> <br />
                                                                        <span>Lip Makeup: {''} {this.state.makeup.lipMakeup === true ? <b>'LipStick'</b> : <b>'No'</b>} </span> <br />
                                                                        <span>Eye Makeup: {''} {this.state.makeup.eyeMakeup === true ? <b>'Yes'</b> : <b>'No'</b>}</span>
                                                                    </div> <br />
                                                                </CardText>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Collapse>
                                            </CardBody>

                                        </Card>
                                    </div>

                                    <br />
                                </React.Fragment>
                                : null
                        }

                    </Col>
                </Row>
            </Container>
        )
    }
}

export default FaceRecognition;





