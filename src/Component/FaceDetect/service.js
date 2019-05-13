
// const request = require('request');
import axios from 'axios';

/** 
const subscriptionKey = '1a9203628b2341df9fe5c2a9d31e7dd1';

const uriBase = "https://centralindia.api.cognitive.microsoft.com/face/v1.0/detect";

const imageUrl = 'https://lh3.googleusercontent.com/-HRsxRxK3Hio/AAAAAAAAAAI/AAAAAAAAAA0/piymMRxAnZI/photo.jpg';

// Request Parameter
const reqParameter = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
}

// Request Payload
const reqPayload = {
    'uri': uriBase,
    'qs': reqParameter,
    'body': '{"url": ' + '"' + imageUrl + '"}',
    'headers': {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey
    }
}

request.post(reqPayload, (error, response, body) => {

    if (error) {
        console.error('Error during Api call', error);
        return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
    console.log('JSON Response\n');
    console.log(jsonResponse);
})
*/



// axios Code

// /**

const cognitiveService = {

    faceAPIService(formData) {

        const subscriptionKey = '1a9203628b2341df9fe5c2a9d31e7dd1';

        const uriBase = "https://centralindia.api.cognitive.microsoft.com/face/v1.0/detect";
        // const encodedURI = window.encodeURI("/proxy/face/v1.0/detect")

        // const imageUrl = 'https://lh3.googleusercontent.com/-HRsxRxK3Hio/AAAAAAAAAAI/AAAAAAAAAA0/piymMRxAnZI/photo.jpg';

        // const dataObj = {
        //     "url": imageUrl
        // }

        // Request Parameter
        const reqParameter = {
            'returnFaceId': 'true',
            'returnFaceLandmarks': 'true',
            'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
                'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
        }

        return axios({
            "method": "POST",
            "url": uriBase,
            "params": reqParameter,
            "data": formData,
            "headers": {
                // 'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Content-Type': 'application/octet-stream',
            }
        })

    }
}

export default cognitiveService;