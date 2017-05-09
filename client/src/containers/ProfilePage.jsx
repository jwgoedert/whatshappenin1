import React, { Component } from 'react';
import { Timeline } from 'react-twitter-widgets';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import Auth from '../modules/Auth.js';
import Profile from '../components/Profile.jsx';

const axios = require('axios');

const CLOUDINARY_UPLOAD_PRESET = 'ofoowivp';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dzwquspqa/upload';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.email,
      picture: '',
      uploadedFileCloudinaryUrl: '',
      secretData: '',
      eventList: [],
      detailsBox: {
        name,
      },
    };
    /**
   *
   * @param {events} a list of event objects from query
   * @returns Sets the state eventlist to the array of events
   */
    fetch('/events').then(events => events.json())
    .then((events) => {
      this.setState({
        eventList: events,
        detailsBox: events[0]
      });
    }).catch(err => console.log(err));
    this.setCoordinates = this.setCoordinates.bind(this);
    this.setDetailsBox = this.setDetailsBox.bind(this);
    this.setEventList = this.setEventList.bind(this);
    this.getPicture();
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
    /**
   *
   * @param {none} sets security token
   * @returns sets secret message on state for authorization
   * with the given location
   */
    fetch('/api/Profile', {
      method: 'GET',
      headers: new Headers({
        'Content-type': 'application/x-www-form-urlencoded',
        authorization: `bearer ${(Auth.getToken())}`
      })
    }).then(res => res.json())
    .then((data) => {
      this.setState({
        secretData: data.message,
      });
    })
    .catch(err => `Whoops: ${err}`);
  }


  /**
   * Returns the sum of a and b
   * @param {event} the event object a user clicks on
   * @return Sets the state detailbox to the clicked event
   */
  setDetailsBox(detailsBox) {
    this.setState({ detailsBox });
  }

/**
 *
 * @param {events} a list of event objects from query
 * @returns Sets the state eventlist to the array of events
 */
  setEventList(eventList) {
    this.setState({ eventList });
  }
/**
 *
 * @param {location} will be a set of coordinates
 * @returns Sets the state coordinates, for each event list member
 * allowing for the map to be updated
 */
  setCoordinates(location) {
    this.setState({ location });
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
        console.log(this.state.uploadedFileCloudinaryUrl, 'the url to find image');
        axios.put('/add/picture', { email: this.state.email, pictureUrl: this.state.uploadedFileCloudinaryUrl });
        console.log(JSON.parse(localStorage.profile).clientID);
        

      }
    });
  }

  getPicture() {
    axios.get(`/user/picture/${this.state.email}`).then((suc) => {
      console.log(suc.data, 'success in getting user picture???');
      this.setState({ picture: suc.data || '' });
    });
  }

// want to check if user array of pics is empty. if not, display image. else display their pic
// store users in DB using clientID???
  render() {
    return (
      <div class="row">
        <div class="col-md-2">
        {console.log(this.state.picture, this.state.uploadedFileCloudinaryUrl, 'both params')}
          { this.state.picture === '' && this.state.uploadedFileCloudinaryUrl === '' ?
            <div className="FileUpload">
              <Dropzone
                multiple={false}
                accept="image/*"
                onDrop={this.onImageDrop.bind(this)}>
                <p>Drop an image or click to select a file to upload.</p>
              </Dropzone>
            </div> : <img src={this.state.uploadedFileCloudinaryUrl || this.state.picture} alt="you!" /> }
        </div>

        <div class="col-md-10">
          <h4>Hello World</h4>
        </div>
      </div>
    );
  }

}

export default ProfilePage;